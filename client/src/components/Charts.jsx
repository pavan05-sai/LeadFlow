import { useState, useEffect } from 'react';
import { getMonthlyReports } from '../services/api';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

const Charts = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await getMonthlyReports();
        setReports(data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="glass rounded-2xl h-64 animate-pulse" />
      <div className="glass rounded-2xl h-64 animate-pulse" />
    </div>
  );

  const maxLeads = Math.max(...reports.map(r => r.leads), 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Lead Volume Chart */}
      <div className="glass rounded-2xl p-6 border border-surface-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-600/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-primary-400" />
            </div>
            <h3 className="font-bold text-surface-200">Lead Volume (6 Months)</h3>
          </div>
        </div>
        
        <div className="flex items-end gap-2 h-40">
          {reports.length > 0 ? reports.map((r, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div 
                className="w-full bg-primary-600/40 rounded-t-lg border-x border-t border-primary-500/30 transition-all duration-500 group-hover:bg-primary-500/60 relative"
                style={{ height: `${(r.leads / maxLeads) * 100}%` }}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-smooth bg-surface-800 text-[10px] px-2 py-0.5 rounded border border-surface-700 text-white font-bold">
                  {r.leads}
                </div>
              </div>
              <span className="text-[10px] text-surface-500 font-medium rotate-45 sm:rotate-0 mt-1">{r.name.split(' ')[0]}</span>
            </div>
          )) : (
            <div className="w-full h-full flex items-center justify-center text-surface-500 italic text-sm">
              Not enough data for charting
            </div>
          )}
        </div>
      </div>

      {/* Conversion Trend */}
      <div className="glass rounded-2xl p-6 border border-surface-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-bold text-surface-200">Lead Converisons</h3>
          </div>
        </div>

        <div className="space-y-4">
          {reports.length > 0 ? reports.slice(-3).reverse().map((r, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-surface-400 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {r.name}
                </span>
                <span className="text-emerald-400 font-bold">{r.conversions} Converted</span>
              </div>
              <div className="h-2 bg-surface-800 rounded-full overflow-hidden border border-surface-700">
                <div 
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000"
                  style={{ width: `${(r.conversions / Math.max(r.leads, 1)) * 100}%` }}
                />
              </div>
            </div>
          )) : (
            <div className="py-10 text-center text-surface-500 italic text-sm">
              Waiting for data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
