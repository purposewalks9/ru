// ============================================
// SUPABASE EDGE FUNCTION: send-bulk-email
// File: supabase/functions/send-bulk-email/index.ts
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Rate limiting: Max emails per batch (adjust based on Brevo limits)
const BATCH_SIZE = 10;
const DELAY_BETWEEN_BATCHES_MS = 1000; // 1 second

interface SendEmailRequest {
  batch_id: string;
  template_id: string;
}

interface EmailRecord {
  id: string;
  email: string;
  status: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Parse request body
    const { batch_id, template_id }: SendEmailRequest = await req.json();

    if (!batch_id || !template_id) {
      return new Response(
        JSON.stringify({ error: "batch_id and template_id are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Starting email send for batch: ${batch_id}, template: ${template_id}`);

    // Create send run record
    const { data: sendRun, error: sendRunError } = await supabase
      .from("email_send_runs")
      .insert({
        batch_id,
        template_id,
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (sendRunError) {
      console.error("Error creating send run:", sendRunError);
      return new Response(
        JSON.stringify({ error: "Failed to create send run" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch all pending emails from the batch
    const { data: emails, error: fetchError } = await supabase
      .from("batch_emails")
      .select("id, email, status")
      .eq("batch_id", batch_id)
      .eq("status", "pending");

    if (fetchError || !emails) {
      console.error("Error fetching emails:", fetchError);
      await updateSendRunStatus(supabase, sendRun.id, "failed", "Failed to fetch emails");
      return new Response(
        JSON.stringify({ error: "Failed to fetch emails" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (emails.length === 0) {
      await updateSendRunStatus(supabase, sendRun.id, "completed", "No pending emails to send");
      return new Response(
        JSON.stringify({ message: "No pending emails to send", send_run_id: sendRun.id }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update total emails in send run
    await supabase
      .from("email_send_runs")
      .update({ total_emails: emails.length })
      .eq("id", sendRun.id);

    // Process emails in batches
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      
      // Process batch in parallel
      const results = await Promise.allSettled(
        batch.map((email) => sendEmailToBrevo(email, template_id, supabase))
      );

      // Update counters
      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value.success) {
          sentCount++;
        } else {
          failedCount++;
        }
      });

      // Update send run progress
      await supabase
        .from("email_send_runs")
        .update({ sent_count: sentCount, failed_count: failedCount })
        .eq("id", sendRun.id);

      // Delay between batches to respect rate limits
      if (i + BATCH_SIZE < emails.length) {
        await delay(DELAY_BETWEEN_BATCHES_MS);
      }
    }

    // Mark send run as completed
    await updateSendRunStatus(
      supabase,
      sendRun.id,
      "completed",
      null,
      sentCount,
      failedCount
    );

    console.log(`Email send completed. Sent: ${sentCount}, Failed: ${failedCount}`);

    return new Response(
      JSON.stringify({
        message: "Email sending completed",
        send_run_id: sendRun.id,
        sent_count: sentCount,
        failed_count: failedCount,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Send email using Brevo API
 */
async function sendEmailToBrevo(
  emailRecord: EmailRecord,
  templateId: string,
  supabase: any
): Promise<{ success: boolean; error?: string }> {
  try {
    // Call Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        to: [{ email: emailRecord.email }],
        templateId: parseInt(templateId),
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Failed to send to ${emailRecord.email}:`, errorData);

      // Update email status to failed
      await supabase
        .from("batch_emails")
        .update({
          status: "failed",
          error_message: `Brevo API error: ${errorData.substring(0, 500)}`,
          sent_at: new Date().toISOString(),
        })
        .eq("id", emailRecord.id);

      return { success: false, error: errorData };
    }

    // Update email status to sent
    await supabase
      .from("batch_emails")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", emailRecord.id);

    console.log(`Successfully sent email to ${emailRecord.email}`);
    return { success: true };
  } catch (error) {
    console.error(`Exception sending to ${emailRecord.email}:`, error);

    // Update email status to failed
    await supabase
      .from("batch_emails")
      .update({
        status: "failed",
        error_message: error.message,
        sent_at: new Date().toISOString(),
      })
      .eq("id", emailRecord.id);

    return { success: false, error: error.message };
  }
}

/**
 * Update send run status
 */
async function updateSendRunStatus(
  supabase: any,
  sendRunId: string,
  status: string,
  errorMessage: string | null = null,
  sentCount?: number,
  failedCount?: number
) {
  const updateData: any = {
    status,
    completed_at: new Date().toISOString(),
  };

  if (errorMessage) {
    updateData.error_message = errorMessage;
  }

  if (sentCount !== undefined) {
    updateData.sent_count = sentCount;
  }

  if (failedCount !== undefined) {
    updateData.failed_count = failedCount;
  }

  await supabase.from("email_send_runs").update(updateData).eq("id", sendRunId);
}

/**
 * Delay helper
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}