
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wsytochnwyitcdijioay.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeXRvY2hud3lpdGNkaWppb2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNjU3NTIsImV4cCI6MjA4Mzc0MTc1Mn0.ED7FvFc0iwxEo4K4uPRfaOUnd9LK1-sUZN1WHiSXdvU';

export const supabase = createClient(supabaseUrl, supabaseKey);
