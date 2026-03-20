import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Send, MessageSquare, Mail, Phone, Globe, Clock } from 'lucide-react';

const statusColors = {
  new: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  contacted: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  converted: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
};

const sourceLabels = {
  website: 'Website',
  referral: 'Referral',
  social_media: 'Social Media',
  advertisement: 'Advertisement',
  other: 'Other',
};

const LeadDetailModal = ({ lead, onClose, onAddNote, onStatusChange }) => {
  const [noteText, setNoteText] = useState('');
  const [sending, setSending] = useState(false);
  const [agents, setAgents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role?.toLowerCase() === 'admin') {
      import('../services/api').then(m => m.getUsers()).then(({ data }) => {
        // Filter out the current admin from the list of agents
        setAgents(data.filter(a => a._id !== user._id));
      });
    }
  }, [user]);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setSending(true);
    await onAddNote(lead._id, noteText.trim());
    setNoteText('');
    setSending(false);
  };

  const handleAssign = async (agentId) => {
    await onStatusChange(lead._id, { assignedTo: agentId || null });
  };

  const handleFollowUpChange = async (date) => {
    await onStatusChange(lead._id, { followUpDate: date });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface-900 border border-surface-700/50 rounded-2xl shadow-2xl animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-800">
          <div>
            <h2 className="text-lg font-bold text-surface-100">{lead.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-surface-400">Lead Details</p>
              {lead.assignedTo && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-600/20 text-primary-400 border border-primary-500/20">
                  Assigned to: {lead.assignedTo.name}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-800 text-surface-400 flex items-center justify-center hover:bg-surface-700 transition-smooth cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4 bg-surface-800/30 p-4 rounded-xl border border-surface-800">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-surface-500" />
              <span className="text-surface-300 truncate">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-surface-500" />
              <span className="text-surface-300">{lead.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-surface-500" />
              <span className="text-surface-300">{sourceLabels[lead.source] || lead.source}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-surface-500" />
              <span className="text-surface-300">
                {new Date(lead.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Admin Assignment */}
          {user?.role?.toLowerCase() === 'admin' && (
            <div>
              <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
                Assign to Agent
              </label>
              <select
                value={lead.assignedTo?._id || ''}
                onChange={(e) => handleAssign(e.target.value)}
                className="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-xl text-sm text-surface-200 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
              >
                <option value="">Unassigned</option>
                {agents.map(a => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Follow-up Date */}
          <div>
            <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
              Follow-up Date
            </label>
            <input
              type="date"
              value={lead.followUpDate ? new Date(lead.followUpDate).toISOString().split('T')[0] : ''}
              onChange={(e) => handleFollowUpChange(e.target.value)}
              className="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-xl text-sm text-surface-200 focus:outline-none focus:border-primary-500 cursor-pointer"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
              Status
            </label>
            <div className="flex gap-2">
              {['new', 'contacted', 'converted'].map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(lead._id, { status: s })}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-smooth cursor-pointer ${
                    lead.status === s
                      ? statusColors[s]
                      : 'bg-surface-800 text-surface-400 hover:bg-surface-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-surface-400" />
              <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                Follow-up Notes ({lead.notes?.length || 0})
              </span>
            </div>

            {/* Notes List */}
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {lead.notes && lead.notes.length > 0 ? (
                [...lead.notes].reverse().map((note) => (
                  <div
                    key={note._id}
                    className="bg-surface-800/50 rounded-xl p-3 border border-surface-700/30"
                  >
                    <p className="text-sm text-surface-200">{note.text}</p>
                    <p className="text-xs text-surface-500 mt-1.5">
                      {new Date(note.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-surface-500 italic">No notes yet.</p>
              )}
            </div>

            {/* Add Note */}
            <div className="flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a follow-up note..."
                className="flex-1 px-4 py-2.5 bg-surface-800/50 border border-surface-700 rounded-xl text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:border-primary-500"
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim() || sending}
                className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-500 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
