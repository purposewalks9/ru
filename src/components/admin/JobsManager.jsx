import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit3, Briefcase, MapPin, Clock, Save, X, Building2 } from 'lucide-react';

const JobsManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    location: '', 
    type: 'Full-time', 
    description: '' 
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        // Update existing job
        const { error } = await supabase
          .from('jobs')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        showSuccess('Job updated successfully!');
      } else {
        // Add new job
        const { error } = await supabase
          .from('jobs')
          .insert([formData]);

        if (error) throw error;
        showSuccess('New job posted!');
      }
      resetForm();
      await fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      showSuccess('Job deleted successfully!');
      await fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: '', location: '', type: 'Full-time', description: '' });
  };

  const startEdit = (job) => {
    setEditingId(job.id);
    setFormData({
      title: job.title,
      location: job.location,
      type: job.type,
      description: job.description
    });
    setIsAdding(true);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#478100]/20 border-t-[#478100] rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading jobs data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#478100]/10 via-white to-[#E9C236]/10 p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-5">
          <Briefcase size={200} />
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#478100]/10 text-[#478100] flex items-center justify-center shadow-sm border border-[#478100]/20">
              <Briefcase size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Job Board Manager</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">
                {jobs.length} {jobs.length === 1 ? 'Position' : 'Positions'} • Manage open roles
              </p>
            </div>
          </div>
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center px-6 py-3 bg-[#478100] text-white rounded-2xl hover:bg-[#5a9e00] transition-all shadow-xl shadow-[#478100]/20 font-bold text-sm"
            >
              <Plus size={20} className="mr-2" /> Add Position
            </button>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-lg animate-in">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E9C236]/10 text-[#E9C236] flex items-center justify-center">
                  <Edit3 size={20} />
                </div>
                <h4 className="text-xl font-bold text-slate-900">
                  {editingId ? 'Edit Position' : 'Post New Position'}
                </h4>
              </div>
              <button 
                type="button" 
                onClick={resetForm} 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Job Title
                </label>
                <div className="relative">
                  <input 
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#478100]/30 focus:ring-4 focus:ring-[#478100]/5 outline-none text-sm font-semibold text-slate-800 transition-all" 
                    value={formData.title} 
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                    required 
                  />
                  <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Location
                </label>
                <div className="relative">
                  <input 
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#478100]/30 focus:ring-4 focus:ring-[#478100]/5 outline-none text-sm font-semibold text-slate-800 transition-all" 
                    value={formData.location} 
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Remote, New York, Hybrid"
                    required 
                  />
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Job Type
                </label>
                <div className="relative">
                  <select 
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#478100]/30 focus:ring-4 focus:ring-[#478100]/5 outline-none text-sm font-semibold text-slate-800 transition-all appearance-none"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                  <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Job Description
                </label>
                <textarea 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-[#478100]/30 focus:ring-4 focus:ring-[#478100]/5 outline-none text-sm text-slate-600 font-medium transition-all resize-none" 
                  rows={6}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-bold text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center px-6 py-3 bg-[#478100] text-white rounded-xl hover:bg-[#5a9e00] transition-all shadow-lg shadow-[#478100]/20 disabled:opacity-50 font-bold text-sm"
              >
                <Save size={18} className="mr-2" />
                {loading ? 'Saving...' : editingId ? 'Update Job' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="bg-white p-16 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase size={40} className="text-slate-300" />
            </div>
            <h4 className="text-lg font-bold text-slate-400 mb-2">No job postings yet</h4>
            <p className="text-sm text-slate-400 mb-6">Click "Add Position" to create your first job posting</p>
          </div>
        ) : (
          jobs.map(job => (
            <div 
              key={job.id} 
              className="group bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-[#478100]/30 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-4">
                  {/* Job Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#478100]/10 text-[#478100] flex items-center justify-center flex-shrink-0 group-hover:bg-[#478100] group-hover:text-white transition-all duration-300">
                      <Building2 size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#478100] transition-colors">
                        {job.title}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <MapPin size={14} className="text-[#E9C236]" /> 
                          <span className="font-medium">{job.location}</span>
                        </span>
                        <span className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <Clock size={14} className="text-[#478100]" /> 
                          <span className="font-medium">{job.type}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="pl-16">
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEdit(job)}
                    className="p-3 text-slate-400 hover:text-[#478100] hover:bg-[#478100]/10 rounded-xl transition-all"
                    title="Edit job"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete job"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobsManager;