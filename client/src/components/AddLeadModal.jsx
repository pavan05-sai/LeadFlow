import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { createLead } from '../services/api';

const AddLeadModal = ({ onClose, onLeadAdded }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'website',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }

    setLoading(true);
    try {
      await createLead(form);
      onLeadAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-surface-900 border border-surface-700/50 rounded-2xl shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-600/20 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-lg font-bold text-surface-100">Add New Lead</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-800 text-surface-400 flex items-center justify-center hover:bg-surface-700 transition-smooth cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="w-full px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Source</label>
            <select
              name="source"
              value={form.source}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-surface-200 text-sm focus:outline-none focus:border-primary-500 cursor-pointer"
            >
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social_media">Social Media</option>
              <option value="advertisement">Advertisement</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Add Lead
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
