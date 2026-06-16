import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';

const COLORS = {
  High: '#ef4444',   // red-500
  Medium: '#eab308', // yellow-500
  Low: '#22c55e',    // green-500
  Pending: '#3b82f6',    // blue-500
  InProgress: '#f59e0b', // amber-500
  Resolved: '#10b981'    // emerald-500
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-white font-semibold text-sm mb-1">{label || payload[0].name}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsDashboard = ({ complaints }) => {
  // 1. Priority Distribution Data (Pie Chart)
  const priorityData = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    complaints.forEach(c => counts[c.priority] = (counts[c.priority] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [complaints]);

  // 2. Status Distribution Data (Bar Chart)
  const statusData = useMemo(() => {
    const counts = { Pending: 0, 'In Progress': 0, Resolved: 0 };
    complaints.forEach(c => counts[c.status] = (counts[c.status] || 0) + 1);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [complaints]);

  // 3. Trends over Time (Line Chart)
  const trendData = useMemo(() => {
    // Group by day for the last 14 days
    const days = {};
    const today = new Date();
    
    // Initialize last 14 days with 0
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days[dateStr] = { name: dateStr, Opened: 0, Resolved: 0 };
    }

    complaints.forEach(c => {
      const createdDateStr = new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (days[createdDateStr]) days[createdDateStr].Opened += 1;

      if (c.status === 'Resolved') {
        const resolvedDateStr = new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (days[resolvedDateStr]) days[resolvedDateStr].Resolved += 1;
      }
    });

    return Object.values(days);
  }, [complaints]);

  // 4. Average Resolution Time
  const avgResolutionTime = useMemo(() => {
    const resolved = complaints.filter(c => c.status === 'Resolved' && c.createdAt && c.updatedAt);
    if (resolved.length === 0) return 'N/A';
    
    const totalMs = resolved.reduce((acc, c) => {
      return acc + (new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime());
    }, 0);
    
    const avgMs = totalMs / resolved.length;
    const hours = Math.round(avgMs / (1000 * 60 * 60));
    return hours < 24 ? `${hours} Hours` : `${Math.round(hours/24)} Days`;
  }, [complaints]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-0">
      
      {/* Trends Chart */}
      <div className="bg-surface/50 border border-white/[0.06] backdrop-blur p-5 sm:p-6 rounded-2xl lg:col-span-2 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">14-Day Activity Trends</h3>
            <p className="text-sm text-slate-400">Tickets opened vs. resolved over the last two weeks.</p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Avg Resolution</p>
            <p className="text-xl font-bold text-brand-400">{avgResolutionTime}</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="Opened" stroke={COLORS.High} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Resolved" stroke={COLORS.Resolved} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-surface/50 border border-white/[0.06] backdrop-blur p-5 sm:p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-1">Tickets by Priority</h3>
        <p className="text-sm text-slate-400 mb-4">Breakdown of urgency levels.</p>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.Low} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-surface/50 border border-white/[0.06] backdrop-blur p-5 sm:p-6 rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-1">Tickets by Status</h3>
        <p className="text-sm text-slate-400 mb-4">Current operational workload.</p>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} allowDecimals={false} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'Pending' ? COLORS.Pending : entry.name === 'In Progress' ? COLORS.InProgress : COLORS.Resolved} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsDashboard;
