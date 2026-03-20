import { Eye, Trash2 } from 'lucide-react';

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

const LeadsTable = ({ leads, loading, onStatusChange, onDelete, onViewLead }) => {
  if (loading) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-surface-400">Loading leads...</p>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <p className="text-surface-400 text-lg">No leads found</p>
        <p className="text-surface-500 text-sm mt-2">
          Add a new lead or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden animate-fadeIn">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-700/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider hidden md:table-cell">
                Phone
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider hidden lg:table-cell">
                Source
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider hidden sm:table-cell">
                Date
              </th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/50">
            {leads.map((lead, i) => (
              <tr
                key={lead._id}
                className="hover:bg-surface-800/30 transition-smooth animate-fadeIn"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-surface-100">{lead.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-surface-300">{lead.email}</p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <p className="text-sm text-surface-400">{lead.phone || '—'}</p>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="text-sm text-surface-400">
                    {sourceLabels[lead.source] || lead.source}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={lead.status}
                    onChange={(e) => onStatusChange(lead._id, e.target.value)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer focus:outline-none ${statusColors[lead.status]} bg-transparent appearance-none`}
                    style={{ WebkitAppearance: 'none' }}
                  >
                    <option value="new" className="bg-surface-800 text-surface-200">New</option>
                    <option value="contacted" className="bg-surface-800 text-surface-200">Contacted</option>
                    <option value="converted" className="bg-surface-800 text-surface-200">Converted</option>
                  </select>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <p className="text-sm text-surface-500">
                    {new Date(lead.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewLead(lead)}
                      className="w-8 h-8 rounded-lg bg-primary-600/10 text-primary-400 flex items-center justify-center hover:bg-primary-600/20 transition-smooth cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(lead._id)}
                      className="w-8 h-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center hover:bg-danger/20 transition-smooth cursor-pointer"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;
