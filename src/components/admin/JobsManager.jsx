import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Edit3, Briefcase, MapPin, Clock, Save, X, Building2, AlertCircle, DollarSign, Calendar } from 'lucide-react';

const JobsManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    location: '', 
    description: '',
    department: '',
    salary: '',
    work_type: 'Remote',
    time_type: 'Full-time',
    badge: 'HIRING'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
      setError(`Error loading jobs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.title || !formData.location || !formData.description || !formData.department || !formData.salary) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const jobData = {
        title: formData.title,
        location: formData.location,
        description: formData.description,
        department: formData.department,
        salary: formData.salary,
        work_type: formData.work_type,
        time_type: formData.time_type,
        badge: formData.badge
      };

      if (editingId) {
        const { error } = await supabase
          .from('jobs')
          .update(jobData)
          .eq('id', editingId);

        if (error) throw error;
        showSuccess('Job updated successfully!');
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([jobData]);

        if (error) throw error;
        showSuccess('New job posted!');
      }
      resetForm();
      await fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      setError(`Error saving job: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    
    setLoading(true);
    setError(null);
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
      setError(`Error deleting job: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ 
      title: '', 
      location: '', 
      description: '',
      department: '',
      salary: '',
      work_type: 'Remote',
      time_type: 'Full-time',
      badge: 'HIRING'
    });
  };

  const startEdit = (job) => {
    setEditingId(job.id);
    setFormData({
      title: job.title,
      location: job.location,
      description: job.description,
      department: job.department || '',
      salary: job.salary || '',
      work_type: job.work_type || 'Remote',
      time_type: job.time_type || 'Full-time',
      badge: job.badge || 'HIRING'
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading jobs data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-600 text-white flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Job Board Manager</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {jobs.length} {jobs.length === 1 ? 'Position' : 'Positions'} Available
                </p>
              </div>
            </div>
            {!isAdding && (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium text-sm"
              >
                <Plus size={18} /> Add Position
              </button>
            )}
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
                  <Edit3 size={20} className="text-gray-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  {editingId ? 'Edit Position' : 'Post New Position'}
                </h4>
              </div>
              <button 
                type="button" 
                onClick={resetForm} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Job Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Job Title *
                </label>
                <div className="relative">
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors" 
                    value={formData.title} 
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                  />
                  <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Department *
                </label>
                <div className="relative">
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors" 
                    value={formData.department} 
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Engineering"
                  />
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Location *
                </label>
                <div className="relative">
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors" 
                    value={formData.location} 
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., New York, NY"
                  />
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Salary Range *
                </label>
                <div className="relative">
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors" 
                    value={formData.salary} 
                    onChange={e => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g., $80,000 - $120,000"
                  />
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Work Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Work Type
                </label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors appearance-none cursor-pointer"
                  value={formData.work_type}
                  onChange={e => setFormData({ ...formData, work_type: e.target.value })}
                >
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                </select>
              </div>

              {/* Time Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Schedule
                </label>
                <div className="relative">
                  <select 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors appearance-none cursor-pointer"
                    value={formData.time_type}
                    onChange={e => setFormData({ ...formData, time_type: e.target.value })}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Badge/Status
                </label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors appearance-none cursor-pointer"
                  value={formData.badge}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                >
                  <option>HIRING</option>
                  <option>URGENT</option>
                  <option>NEW</option>
                  <option>HOT</option>
                </select>
              </div>

              {/* Job Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Job Description *
                </label>
                <textarea 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors resize-none" 
                  rows={6}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, qualifications, and requirements..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 font-medium text-sm"
              >
                <Save size={16} />
                {loading ? 'Saving...' : editingId ? 'Update Job' : 'Post Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-200 p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Briefcase size={32} className="text-gray-300" />
            </div>
            <h4 className="text-lg font-bold text-gray-400 mb-2">No job postings yet</h4>
            <p className="text-sm text-gray-400 mb-6">Click "Add Position" to create your first job posting</p>
          </div>
        ) : (
          jobs.map(job => (
            <div 
              key={job.id} 
              className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-all duration-200 border border-gray-200">
                        <Building2 size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                            {job.title}
                          </h4>
                          {job.badge && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">
                              {job.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm mb-3">
                          <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <Building2 size={14} className="text-gray-500" /> 
                            <span className="font-medium">{job.department || 'N/A'}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <MapPin size={14} className="text-gray-500" /> 
                            <span className="font-medium">{job.location}</span>
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            <Clock size={14} className="text-gray-500" /> 
                            <span className="font-medium">{job.time_type || job.type || 'Full-time'}</span>
                          </span>
                        </div>
                        {job.salary && (
                          <p className="text-sm text-gray-600 font-medium">
                             {job.salary}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pl-16">
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2  transition-opacity">
                    <button 
                      onClick={() => startEdit(job)}
                      className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit job"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(job.id)}
                      className="p-2.5  text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete job"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
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