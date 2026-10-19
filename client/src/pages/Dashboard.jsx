import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/useAuth';
import { useLocation } from 'react-router-dom';
import { getLeads, updateLead, deleteLead, addNote } from '../services/api';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import LeadsTable from '../components/LeadsTable';
import LeadDetailModal from '../components/LeadDetailModal';
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
} from 'lucide-react';
import AddLeadModal from '../components/AddLeadModal';
import Charts from '../components/Charts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAllLeadsPage = location.pathname === '/leads';

  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (sourceFilter) params.source = sourceFilter;
      params.sortBy = sortBy;
      params.order = order;

      const { data } = await getLeads(params);
      setLeads(data.leads);
      setAnalytics(data.analytics);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      setError(err.response?.data?.message || 'Failed to load leads. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter, sortBy, order]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleUpdateLead = async (id, updates) => {
    try {
      const { data } = await updateLead(id, updates);
      if (selectedLead?._id === id) setSelectedLead(data);
      fetchLeads();
    } catch (err) {
      console.error('Failed to update lead:', err);
      setError(err.response?.data?.message || 'Failed to update the lead.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await deleteLead(id);
      fetchLeads();
      if (selectedLead?._id === id) setSelectedLead(null);
    } catch (err) {
      console.error('Failed to delete lead:', err);
      setError(err.response?.data?.message || 'Failed to delete the lead.');
    }
  };

  const handleAddNote = async (leadId, text) => {
    try {
      const { data } = await addNote(leadId, { text });
      setSelectedLead(data);
      fetchLeads();
    } catch (err) {
      console.error('Failed to add note:', err);
      setError(err.response?.data?.message || 'Failed to add the note.');
    }
  };

  const handleLeadAdded = () => {
    fetchLeads();
    setShowAddModal(false);
  };

  return (
    <div className="flex min-h-screen bg-surface-950">
      {/* Sidebar */}
      <Sidebar
        user={user}
        logout={logout}
        isOpen={sidebarOpen}
        toggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}
      >
        <div className="p-6 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-surface-100">
                {isAllLeadsPage ? (
                  'All Leads'
                ) : (
                  <>Welcome back, <span className="gradient-text">{user?.name || 'Admin'}</span></>
                )}
              </h1>
              <p className="text-surface-400 mt-1">
                {isAllLeadsPage 
                  ? 'Manage and track your entire lead database' 
                  : "Here's your lead pipeline overview"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchLeads}
                className="flex items-center gap-2 px-4 py-2.5 bg-surface-800 border border-surface-700 text-surface-300 rounded-xl hover:bg-surface-700 transition-smooth cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-smooth cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Lead
              </button>
            </div>
          </div>

          {/* Stats Cards - Only visible on Dashboard Overview */}
          {!isAllLeadsPage && (
            <>
              <StatsCards analytics={analytics} />
              <Charts />
            </>
          )}

          {error && (
            <p role="alert" className="mb-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
              {error}
            </p>
          )}

          {/* Filters */}
          <div className="glass rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads by name or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500 text-sm"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-surface-200 text-sm focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
                >
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-surface-200 text-sm focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
              >
                <option value="">All Sources</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social_media">Social Media</option>
                <option value="advertisement">Advertisement</option>
                <option value="other">Other</option>
              </select>
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split('-');
                  setSortBy(s);
                  setOrder(o);
                }}
                className="px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-surface-200 text-sm focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="status-asc">Status A-Z</option>
              </select>
            </div>
          </div>

          {/* Leads Table */}
          <LeadsTable
            leads={leads}
            loading={loading}
            onStatusChange={(id, status) => handleUpdateLead(id, { status })}
            onDelete={handleDelete}
            onViewLead={setSelectedLead}
          />
        </div>
      </main>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onAddNote={handleAddNote}
          onStatusChange={handleUpdateLead}
        />
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onLeadAdded={handleLeadAdded}
        />
      )}
    </div>
  );
};

export default Dashboard;
