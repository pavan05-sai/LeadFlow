import { Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';

const StatsCards = ({ analytics }) => {
  const stats = [
    {
      label: 'Total Leads',
      value: analytics.total || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
    },
    {
      label: 'New Leads',
      value: analytics.new || 0,
      icon: UserPlus,
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
    },
    {
      label: 'Contacted',
      value: analytics.contacted || 0,
      icon: UserCheck,
      color: 'from-purple-500 to-violet-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
    },
    {
      label: 'Converted',
      value: analytics.converted || 0,
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`glass rounded-2xl p-5 ${stat.border} animate-fadeIn`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.text}`} />
            </div>
            {stat.label === 'Converted' && (
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                {analytics.conversionRate || '0.0'}%
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-surface-100">{stat.value}</p>
          <p className="text-sm text-surface-400 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
