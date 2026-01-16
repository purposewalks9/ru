import React, { useState, useEffect } from 'react';
import { Mail, Users, Send, Plus, Upload, Trash2, Eye, CheckCircle, XCircle, Clock, AlertCircle, Menu, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const EmailManager = ({ showSuccess }) => {
  const [activeView, setActiveView] = useState('batches');
  const [batches, setBatches] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ id: null, type: '', name: '' });

  // Batch creation state
  const [newBatch, setNewBatch] = useState({ name: '', emails: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  // Template state
  const [newTemplate, setNewTemplate] = useState({ brevo_id: '', name: '', description: '' });

  // Send email state
  const [sendConfig, setSendConfig] = useState({ batch_id: '', template_id: '' });
  const [sendRuns, setSendRuns] = useState([]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    loadBatches();
    loadTemplates();
    loadSendRuns();
  }, []);

  const loadBatches = async () => {
    try {
      const { data, error } = await supabase
        .from('email_batches')
        .select('id, name, total_emails, created_at')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setBatches(data || []);
    } catch (error) {
      console.error('Error loading batches:', error);
      setErrorMessage(`Error loading batches: ${error.message}`);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('brevo_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      setErrorMessage(`Error loading templates: ${error.message}`);
    }
  };

  const loadSendRuns = async () => {
    try {
      const { data, error } = await supabase
        .from('send_run_details')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      setSendRuns(data || []);
    } catch (error) {
      console.error('Error loading send runs:', error);
      setErrorMessage(`Error loading history: ${error.message}`);
    }
  };

  const handleCreateBatch = async () => {
    if (!newBatch.name.trim()) {
      setErrorMessage('Please enter a batch name');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const emails = newBatch.emails
        .split(/[\n,]/)
        .map(e => e.trim())
        .filter(e => e.includes('@'));

      if (emails.length === 0) {
        setErrorMessage('No valid email addresses found');
        setLoading(false);
        return;
      }

      const { data: batch, error: batchError } = await supabase
        .from('email_batches')
        .insert({ name: newBatch.name })
        .select()
        .single();

      if (batchError) throw batchError;

      const emailRecords = emails.map(email => ({
        batch_id: batch.id,
        email,
        status: 'pending'
      }));

      const { error: emailsError } = await supabase
        .from('batch_emails')
        .insert(emailRecords);

      if (emailsError) throw emailsError;

      showSuccess(`Batch "${newBatch.name}" created with ${emails.length} emails`);
      setNewBatch({ name: '', emails: '' });
      setShowModal(false);
      loadBatches();
    } catch (error) {
      console.error('Error creating batch:', error);
      setErrorMessage(`Error creating batch: ${error.message}`);
    }
    setLoading(false);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split('\n');
        
        // Extract emails from first column, skip header if present
        const emails = lines
          .map(line => {
            const parts = line.split(',');
            return parts[0] ? parts[0].trim() : '';
          })
          .filter(e => e.includes('@'))
          .join('\n');
        
        setNewBatch({ ...newBatch, emails });
      };
      reader.readAsText(file);
    }
  };

  const handleAddTemplate = async () => {
    if (!newTemplate.brevo_id.trim() || !newTemplate.name.trim()) {
      setErrorMessage('Please enter template ID and name');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const { error } = await supabase
        .from('brevo_templates')
        .insert({
          id: newTemplate.brevo_id,
          name: newTemplate.name,
          description: newTemplate.description
        });

      if (error) throw error;

      showSuccess('Brevo template reference saved');
      setNewTemplate({ brevo_id: '', name: '', description: '' });
      setShowModal(false);
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      setErrorMessage(`Error saving template: ${error.message}`);
    }
    setLoading(false);
  };

  const handleSendEmail = async () => {
    if (!sendConfig.batch_id || !sendConfig.template_id) {
      setErrorMessage('Please select both batch and template');
      return;
    }

    setShowDeleteModal(true);
    setItemToDelete({ 
      id: 'send_confirmation', 
      type: 'send_confirmation',
      name: 'send this email campaign? This action cannot be undone.'
    });
  };

  const confirmSendEmail = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Get Supabase config from your supabase client
      const supabaseUrl = supabase.supabaseUrl;
      const supabaseKey = supabase.supabaseKey;
      
      const functionUrl = `${supabaseUrl}/functions/v1/send-bulk-email`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          batch_id: sendConfig.batch_id,
          template_id: sendConfig.template_id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send emails');
      }

      showSuccess('Email campaign initiated! Check the History tab for progress.');
      setSendConfig({ batch_id: '', template_id: '' });
      setShowDeleteModal(false);
      
      setTimeout(() => {
        loadSendRuns();
      }, 1000);
    } catch (error) {
      console.error('Error sending emails:', error);
      setErrorMessage(`Error sending emails: ${error.message}`);
    }
    setLoading(false);
  };

  const handleDeleteBatch = async (id, name) => {
    setItemToDelete({ id, type: 'batch', name });
    setShowDeleteModal(true);
  };

  const handleDeleteTemplate = async (id, name) => {
    setItemToDelete({ id, type: 'template', name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (itemToDelete.type === 'batch') {
        const { error } = await supabase
          .from('email_batches')
          .update({ is_deleted: true })
          .eq('id', itemToDelete.id);

        if (error) throw error;

        showSuccess('Batch deleted successfully');
        loadBatches();
      } else if (itemToDelete.type === 'template') {
        const { error } = await supabase
          .from('brevo_templates')
          .delete()
          .eq('id', itemToDelete.id);

        if (error) throw error;

        showSuccess('Template deleted successfully');
        loadTemplates();
      } else if (itemToDelete.type === 'send_confirmation') {
        await confirmSendEmail();
        return;
      }
      
      setShowDeleteModal(false);
      setItemToDelete({ id: null, type: '', name: '' });
    } catch (error) {
      console.error('Error deleting item:', error);
      setErrorMessage(`Error deleting: ${error.message}`);
      setShowDeleteModal(false);
    }
  };

  const renderBatchesView = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-xl font-bold text-gray-800">Email Batches</h2>
        <button
          onClick={() => { setModalType('batch'); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors w-full sm:w-auto font-medium"
        >
          <Plus size={18} />
          New Batch
        </button>
      </div>

      {batches.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8 text-center">
          <Users className="mx-auto text-gray-400 mb-3" size={36} md:size={48} />
          <p className="text-gray-600">No batches yet. Create your first batch to get started!</p>
        </div>
      ) : (
        <div className="grid gap-3 md:gap-4">
          {batches.map(batch => (
            <div key={batch.id} className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{batch.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {batch.total_emails || 0} recipients • Created {new Date(batch.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 self-end sm:self-start">
                  <button
                    onClick={() => handleDeleteBatch(batch.id, batch.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete batch"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTemplatesView = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-xl font-bold text-gray-800">Brevo Templates</h2>
        <button
          onClick={() => { setModalType('template'); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors w-full sm:w-auto font-medium"
        >
          <Plus size={18} />
          Add Template
        </button>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4 mb-4">
        <div className="flex gap-2">
          <AlertCircle className="text-gray-600 flex-shrink-0 mt-0.5" size={18} md:size={20} />
          <div className="text-sm text-gray-800">
            <p className="font-medium">Templates are managed in Brevo</p>
            <p className="mt-1">Create and design your email templates in your Brevo dashboard, then reference them here by ID.</p>
          </div>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8 text-center">
          <Mail className="mx-auto text-gray-400 mb-3" size={36} md:size={48} />
          <p className="text-gray-600">No templates yet. Add your first Brevo template reference!</p>
        </div>
      ) : (
        <div className="grid gap-3 md:gap-4">
          {templates.map(template => (
            <div key={template.id} className="bg-white p-4 md:p-6 rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{template.name}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded whitespace-nowrap">ID: {template.id}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
                </div>
                <div className="flex gap-2 self-end sm:self-start">
                  <button
                    onClick={() => handleDeleteTemplate(template.id, template.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete template"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSendView = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Send Email Campaign</h2>

      <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Batch</label>
          <select
            value={sendConfig.batch_id}
            onChange={(e) => setSendConfig({ ...sendConfig, batch_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-500"
          >
            <option value="">Choose a batch...</option>
            {batches.map(batch => (
              <option key={batch.id} value={batch.id}>
                {batch.name} ({batch.total_emails || 0} recipients)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Template</label>
          <select
            value={sendConfig.template_id}
            onChange={(e) => setSendConfig({ ...sendConfig, template_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-500"
          >
            <option value="">Choose a template...</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name} (ID: {template.id})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSendEmail}
          disabled={!sendConfig.batch_id || !sendConfig.template_id || loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <Send size={18} />
          {loading ? 'Sending...' : 'Send Email Campaign'}
        </button>
      </div>
    </div>
  );

  const renderHistoryView = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Send History</h2>

      {sendRuns.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8 text-center">
          <Clock className="mx-auto text-gray-400 mb-3" size={36} md:size={48} />
          <p className="text-gray-600">No campaigns sent yet. Send your first campaign to see it here!</p>
        </div>
      ) : (
        <div className="grid gap-3 md:gap-4">
          {sendRuns.map(run => (
            <div key={run.id} className="bg-white p-4 md:p-6 rounded-lg border border-gray-200">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{run.batch_name}</h3>
                  <p className="text-sm text-gray-500 truncate">Template: {run.template_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap self-start ${
                  run.status === 'completed' ? 'bg-green-100 text-green-700' :
                  run.status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {run.status === 'completed' ? <CheckCircle size={14} className="inline mr-1" /> :
                   run.status === 'failed' ? <XCircle size={14} className="inline mr-1" /> :
                   <Clock size={14} className="inline mr-1" />}
                  {run.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Sent</p>
                  <p className="font-semibold text-gray-800">{run.sent_count || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Failed</p>
                  <p className="font-semibold text-gray-800">{run.failed_count || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Started</p>
                  <p className="font-semibold text-gray-800 truncate">{new Date(run.started_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-gray-700/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">
              {modalType === 'batch' ? 'Create New Batch' : 'Add Brevo Template'}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {modalType === 'batch' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch Name</label>
                  <input
                    type="text"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                    placeholder="e.g., Newsletter Jan 2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-white hover:file:bg-gray-900"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">CSV should have email addresses in the first column</p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paste Emails</label>
                  <textarea
                    value={newBatch.emails}
                    onChange={(e) => setNewBatch({ ...newBatch, emails: e.target.value })}
                    placeholder="Paste email addresses (comma or newline separated)"
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {newBatch.emails.split(/[\n,]/).filter(e => e.trim().includes('@')).length} valid emails detected
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brevo Template ID</label>
                  <input
                    type="text"
                    value={newTemplate.brevo_id}
                    onChange={(e) => setNewTemplate({ ...newTemplate, brevo_id: e.target.value })}
                    placeholder="e.g., 12"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="e.g., Welcome Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="Brief description of this template"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-500 resize-none"
                  />
                </div>
              </>
            )}
          </div>

          <div className="p-4 md:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full sm:w-auto order-2 sm:order-1 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={modalType === 'batch' ? handleCreateBatch : handleAddTemplate}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300 transition-colors w-full sm:w-auto order-1 sm:order-2 font-medium"
            >
              {loading ? 'Saving...' : modalType === 'batch' ? 'Create Batch' : 'Add Template'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-gray-700/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">
              {itemToDelete.type === 'send_confirmation' ? 'Confirm Send' : 'Confirm Delete'}
            </h3>
          </div>
          
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              {itemToDelete.type === 'send_confirmation' 
                ? 'Are you sure you want to send this email campaign? This action cannot be undone.'
                : `Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete({ id: null, type: '', name: '' });
                }}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full sm:w-1/2 font-medium border border-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-1/2 font-medium"
              >
                Yes, {itemToDelete.type === 'send_confirmation' ? 'Send' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const views = [
    { id: 'batches', label: 'Batches', icon: Users },
    { id: 'templates', label: 'Templates', icon: Mail },
    { id: 'send', label: 'Send', icon: Send },
    { id: 'history', label: 'History', icon: Clock }
  ];

  return (
    <div className="space-y-6">
      {/* Error Message Display */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex gap-2">
            <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-red-800">
              <p className="font-medium">Error</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu button */}
      <div className="sm:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex items-center gap-2 px-4 py-2 ${mobileMenuOpen ? "border border-gray-600 text-gray-800" : "border border-gray-600 text-gray-800"} rounded-lg mb-4 w-full justify-center font-medium` }
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          {mobileMenuOpen ? 'Close Menu' : 'Navigation'}
        </button>
      </div>

      <div className={`flex flex-col sm:flex-row gap-2 border-b border-gray-200 overflow-x-auto ${
        mobileMenuOpen ? 'flex' : 'hidden sm:flex'
      }`}>
        {views.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveView(id);
              setMobileMenuOpen(false);
            }}
            className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap min-w-[120px] sm:min-w-0 ${
              activeView === id
                ? 'text-gray-800 border-b-2 sm:border-b-2 border-gray-800'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      <div className="min-w-0">
        {activeView === 'batches' && renderBatchesView()}
        {activeView === 'templates' && renderTemplatesView()}
        {activeView === 'send' && renderSendView()}
        {activeView === 'history' && renderHistoryView()}
      </div>

      {renderModal()}
      {renderDeleteModal()}
    </div>
  );
};

export default EmailManager;