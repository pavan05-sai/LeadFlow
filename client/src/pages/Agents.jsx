import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { getUsers, createUser, deleteUser } from '../services/api';
import Sidebar from '../components/Sidebar';
import { UserPlus, Trash2, Mail, Shield, User as UserIcon } from 'lucide-react';

const Agents = () => {
  const { user, logout } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', email: '', password: '', role: 'agent' });
  const [error, setError] = useState('');

  const fetchAgents = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getUsers();
      setAgents(data);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
      setError(err.response?.data?.message || 'Failed to load agents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUser(newAgent);
      setShowAddModal(false);
      setNewAgent({ name: '', email: '', password: '', role: 'agent' });
      fetchAgents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create agent');
    }
  };

  const handleDeleteAgent = async (id) => {
    if (!window.confirm('Are you sure you want to remove this agent?')) return;
    try {
      await deleteUser(id);
      fetchAgents();
    } catch (err) {
      console.error('Failed to delete agent:', err);
      setError(err.response?.data?.message || 'Failed to delete the agent.');
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar
        user={user}
        logout={logout}
        isOpen={sidebarOpen}
        toggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-surface-100 uppercase tracking-tight">Agent Management</h1>
              <p className="text-surface-400 mt-1 text-sm">Create and manage your team of agents</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-smooth cursor-pointer shadow-lg shadow-primary-600/20"
            >
              <UserPlus className="w-5 h-5" />
              Add New Agent
            </button>
          </div>

          {error && (
            <p role="alert" className="mb-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-6 h-48 animate-pulse border border-surface-800" />
              ))
            ) : agents.length > 0 ? (
              agents.map((agent) => (
                <div key={agent._id} className="glass rounded-2xl p-6 border border-surface-800 hover:border-primary-500/30 transition-smooth group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-smooth">
                    <button
                      onClick={() => handleDeleteAgent(agent._id)}
                      className="p-2 bg-danger/10 text-danger rounded-lg hover:bg-danger hover:text-white transition-smooth"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center border border-primary-500/20">
                      <UserIcon className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-surface-100">{agent.name}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-800 text-surface-400 border border-surface-700 mt-1">
                        {agent.role}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-surface-400">
                      <Mail className="w-4 h-4" />
                      {agent.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-surface-400">
                      <Shield className="w-4 h-4" />
                      Limited Access
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-surface-500 italic">No agents found. Add your first team member!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative glass rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fadeIn border border-surface-700">
            <h2 className="text-2xl font-bold text-surface-100 mb-6">Create Agent Account</h2>
            <form onSubmit={handleCreateAgent} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Agent Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 bg-surface-900 border border-surface-800 rounded-xl text-surface-200 focus:outline-none focus:border-primary-500"
                  value={newAgent.name}
                  onChange={e => setNewAgent({...newAgent, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full px-4 py-3 bg-surface-900 border border-surface-800 rounded-xl text-surface-200 focus:outline-none focus:border-primary-500"
                  value={newAgent.email}
                  onChange={e => setNewAgent({...newAgent, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Password</label>
                <input
                  required
                  minLength={12}
                  type="password"
                  className="w-full px-4 py-3 bg-surface-900 border border-surface-800 rounded-xl text-surface-200 focus:outline-none focus:border-primary-500"
                  value={newAgent.password}
                  onChange={e => setNewAgent({...newAgent, password: e.target.value})}
                />
              </div>
              {error && <p className="text-danger text-sm">{error}</p>}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-surface-800 text-surface-300 rounded-xl hover:bg-surface-700 transition-smooth"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-500 font-bold transition-smooth shadow-lg shadow-primary-600/20"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;
