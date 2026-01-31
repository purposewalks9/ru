import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Mail,
  Phone,
  Globe,
  Building2,
  Calendar,
  FileText,
  X,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';

const PAGE_SIZES = [10, 20, 50];

const RecruitmentApplicationsPortal = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & filters
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [total, setTotal] = useState(0);

  // Filters & search (debounced)
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Selection / modals
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  useEffect(() => {
    // debounce searchTerm
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setCurrentPage(1);
    }, 450);
    return () => {
      if (searchRef.current) clearTimeout(searchRef.current);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, debouncedSearch, filterStatus]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);

    try {
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('recruitment_applications')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (filterStatus && filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (debouncedSearch) {
        const q = debouncedSearch.replace(/%/g, '\\%');
        const ilikePattern = `%${q}%`;
        query = query.or(
          `organization_name.ilike.${ilikePattern},contact_person.ilike.${ilikePattern},email.ilike.${ilikePattern},industry.ilike.${ilikePattern}`
        );
      }

      const { data, error: fetchErr, count } = await query;

      if (fetchErr) throw fetchErr;

      setApplications(data || []);
      setTotal(count ?? (data ? data.length : 0));
      const totalPages = Math.max(1, Math.ceil((count ?? data.length) / pageSize));
      if (currentPage > totalPages) setCurrentPage(totalPages);
    } catch (err) {
      setError(`Error fetching applications: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setError(null);
    try {
      const { error } = await supabase
        .from('recruitment_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app)));
      if (selectedApplication?.id === id) {
        setSelectedApplication((s) => ({ ...s, status: newStatus }));
      }
    } catch (err) {
      setError(`Error updating status: ${err.message || err}`);
    }
  };

  const confirmDelete = (application) => {
    setApplicationToDelete(application);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!applicationToDelete) return;
    setError(null);
    try {
      const { error } = await supabase.from('recruitment_applications').delete().eq('id', applicationToDelete.id);
      if (error) throw error;

      setApplications((prev) => prev.filter((a) => a.id !== applicationToDelete.id));
      setApplicationToDelete(null);
      setShowDeleteModal(false);
      fetchApplications();
    } catch (err) {
      setError(`Error deleting application: ${err.message || err}`);
    }
  };

  const viewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const getPageList = () => {
    const maxVisible = 7;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handleChangePageSize = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleGoToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      new: 'bg-blue-50 text-blue-700 border border-blue-200',
      reviewing: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      contacted: 'bg-purple-50 text-purple-700 border border-purple-200',
      completed: 'bg-green-50 text-green-700 border border-green-200',
      rejected: 'bg-red-50 text-red-700 border border-red-200',
    };

    const statusLabels = {
      new: 'New',
      reviewing: 'Reviewing',
      contacted: 'Contacted',
      completed: 'Completed',
      rejected: 'Rejected',
    };

    return (
      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${statusStyles[status] || 'bg-gray-50 text-gray-700 border border-gray-200'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Header + filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header section */}
        <div className="bg-gray-50 px-3 py-3 md:px-4 md:py-4 border-b border-gray-200">
          {/* Title row */}
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center flex-shrink-0">
              <Building2 size={18} className="md:hidden" />
              <Building2 size={20} className="hidden md:block" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate">Recruitment Applications</h1>
              <p className="text-xs md:text-sm text-gray-600 truncate hidden sm:block">Manage and review recruitment requests</p>
            </div>
          </div>

          {/* Filters row - stacked on mobile */}
          <div className="space-y-2 md:space-y-0 md:flex md:items-center md:gap-3">
            {/* Search */}
            <div className="relative flex-1 md:max-w-xs lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search organization, contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 md:py-2.5 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400"
              />
            </div>

            {/* Status & Page size on same row for mobile */}
            <div className="flex items-center gap-2">
              {/* Status filter */}
              <div className="relative flex-1 md:w-44">
                <Filter className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-8 py-2 md:py-2.5 bg-white border border-gray-200 rounded-lg text-xs md:text-sm outline-none appearance-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              </div>

              {/* Page size */}
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => handleChangePageSize(Number(e.target.value))}
                  className="pl-3 pr-8 py-2 md:py-2.5 bg-white border border-gray-200 rounded-lg text-xs md:text-sm outline-none appearance-none"
                >
                  {PAGE_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Application cards */}
        <div className="p-3 md:p-4 space-y-3">
          {applications.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Building2 size={24} className="md:hidden text-gray-300" />
                <Building2 size={32} className="hidden md:block text-gray-300" />
              </div>
              <p className="text-sm md:text-base text-gray-500 font-medium mb-1">
                {debouncedSearch || filterStatus !== 'all' ? 'No applications match your search' : 'No recruitment applications yet'}
              </p>
              <p className="text-xs md:text-sm text-gray-400">
                {debouncedSearch || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Applications will appear here once submitted'}
              </p>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="p-4 md:p-6">
                  {/* Header with org name and status */}
                  <div className="flex items-start justify-between gap-3 mb-3 md:mb-4">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 flex-1 min-w-0 break-words">{app.organization_name}</h3>
                    <div className="flex-shrink-0">{getStatusBadge(app.status)}</div>
                  </div>

                  {/* Contact info - stacked on mobile */}
                  <div className="space-y-2 mb-3 md:mb-4">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                      <Mail size={14} className="flex-shrink-0 text-gray-400" />
                      <span className="truncate">{app.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                      <Phone size={14} className="flex-shrink-0 text-gray-400" />
                      <span>{app.phone}</span>
                    </div>
                    {app.website && (
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                        <Globe size={14} className="flex-shrink-0 text-gray-400" />
                        <a 
                          href={app.website.startsWith('http') ? app.website : `https://${app.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-900 hover:text-gray-700 hover:underline transition-colors truncate"
                        >
                          {app.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Contact person and industry */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 md:mb-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Contact</p>
                      <p className="text-xs md:text-sm text-gray-900">{app.contact_person}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Industry</p>
                      <p className="text-xs md:text-sm text-gray-900 capitalize">{app.industry}</p>
                    </div>
                  </div>

                  {/* Footer with date and actions */}
                  <div className="pt-3 md:pt-4 border-t border-gray-200 space-y-3">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                      <Calendar size={12} className="md:hidden" />
                      <Calendar size={14} className="hidden md:block" />
                      <span className="hidden sm:inline">Submitted {formatDate(app.created_at)}</span>
                      <span className="sm:hidden">{formatDate(app.created_at)}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* View Details button */}
                      <button 
                        onClick={() => viewDetails(app)} 
                        className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-300 rounded-lg transition-colors text-xs md:text-sm font-medium"
                      >
                        <Eye size={14} className="md:hidden" />
                        <Eye size={16} className="hidden md:block" />
                        <span>View Details</span>
                      </button>

                      {/* Status dropdown */}
                      <div className="relative flex-1 sm:flex-initial">
                        <select 
                          value={app.status} 
                          onChange={(e) => handleStatusChange(app.id, e.target.value)} 
                          className="w-full px-3 md:px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs md:text-sm font-medium text-gray-900 focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none appearance-none pr-8 md:pr-12"
                        >
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      </div>

                      {/* Delete button */}
                      <button 
                        onClick={() => confirmDelete(app)} 
                        className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition-colors text-xs md:text-sm font-medium"
                      >
                        <Trash2 size={14} className="md:hidden" />
                        <Trash2 size={16} className="hidden md:block" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination - responsive */}
        <div className="px-3 py-3 md:px-4 border-t border-gray-200 bg-white">
          {/* Mobile pagination */}
          <div className="md:hidden space-y-3">
            <div className="text-xs text-center text-gray-600">
              <span className="font-semibold text-gray-900">{Math.min(total, (currentPage - 1) * pageSize + 1)}</span>-
              <span className="font-semibold text-gray-900">{Math.min(total, currentPage * pageSize)}</span> of{' '}
              <span className="font-semibold text-gray-900">{total}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button 
                onClick={() => handleGoToPage(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-xs text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => handleGoToPage(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Desktop pagination */}
          <div className="hidden md:flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing{' '}
              <span className="font-semibold text-gray-900">{Math.min(total, (currentPage - 1) * pageSize + 1)}</span> —{' '}
              <span className="font-semibold text-gray-900">{Math.min(total, currentPage * pageSize)}</span> of{' '}
              <span className="font-semibold text-gray-900">{total}</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleGoToPage(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="px-3 py-2 bg-white border border-gray-200 rounded-md disabled:opacity-50 text-sm"
              >
                Prev
              </button>

              {getPageList().map((p) => (
                <button 
                  key={p} 
                  onClick={() => handleGoToPage(p)} 
                  className={`px-3 py-2 border rounded-md text-sm ${p === currentPage ? 'bg-gray-800 text-white' : 'bg-white border-gray-200'}`}
                >
                  {p}
                </button>
              ))}

              <button 
                onClick={() => handleGoToPage(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="px-3 py-2 bg-white border border-gray-200 rounded-md disabled:opacity-50 text-sm"
              >
                Next
              </button>

              <div className="ml-3 flex items-center gap-2">
                <label className="text-xs text-gray-500">Go to</label>
                <input 
                  type="number" 
                  min={1} 
                  max={totalPages} 
                  value={currentPage} 
                  onChange={(e) => handleGoToPage(Number(e.target.value || 1))} 
                  className="w-16 px-2 py-1 border border-gray-200 rounded-md text-sm" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal - responsive */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-700/40 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 break-words">{selectedApplication.organization_name}</h2>
                {getStatusBadge(selectedApplication.status)}
              </div>
              <button 
                onClick={() => setShowDetailModal(false)} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors flex-shrink-0"
              >
                <X size={20} className="md:hidden" />
                <X size={24} className="hidden md:block" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-200">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Contact Person</p>
                    <p className="text-sm text-gray-900">{selectedApplication.contact_person}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Email</p>
                    <a 
                      href={`mailto:${selectedApplication.email}`} 
                      className="text-sm text-gray-900 hover:text-gray-700 hover:underline break-all"
                    >
                      {selectedApplication.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Phone</p>
                    <a 
                      href={`tel:${selectedApplication.phone}`} 
                      className="text-sm text-gray-900 hover:text-gray-700 hover:underline"
                    >
                      {selectedApplication.phone}
                    </a>
                  </div>
                  {selectedApplication.website && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Website</p>
                      <a 
                        href={selectedApplication.website.startsWith('http') ? selectedApplication.website : `https://${selectedApplication.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-gray-900 hover:text-gray-700 hover:underline break-all"
                      >
                        {selectedApplication.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Industry</p>
                    <p className="text-sm text-gray-900 capitalize">{selectedApplication.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Submitted</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedApplication.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <FileText className="text-gray-700" size={18} />
                  <h3 className="text-base md:text-lg font-bold text-gray-900">Job Description</h3>
                </div>
                <div className="bg-gray-50 p-4 md:p-5 rounded-lg border border-gray-200">
                  <pre className="whitespace-pre-wrap text-xs md:text-sm text-gray-700 font-sans leading-relaxed break-words">
                    {selectedApplication.job_description || 'No job description provided'}
                  </pre>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 md:pt-6 border-t border-gray-200">
                <select 
                  value={selectedApplication.status} 
                  onChange={(e) => { 
                    handleStatusChange(selectedApplication.id, e.target.value); 
                    setSelectedApplication({ ...selectedApplication, status: e.target.value }); 
                  }} 
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 outline-none"
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button 
                  onClick={() => confirmDelete(selectedApplication)} 
                  className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                >
                  <Trash2 size={16} className="md:hidden" />
                  <Trash2 size={18} className="hidden md:block" />
                  <span>Delete Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal - responsive */}
       {showDeleteModal && applicationToDelete && (
        <div className="fixed inset-0 bg-gray-700/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Confirm Delete
              </h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">
                {`Are you sure you want to delete "${applicationToDelete.organization_name}"? This action cannot be undone.`}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setApplicationToDelete(null);
                  }}
                  disabled={loading}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors w-full sm:w-1/2 font-medium border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-1/2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentApplicationsPortal;