import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { KpiCard } from '../components/ui/KpiCard';
import { DataTable } from '../components/ui/DataTable';
import { BenchmarkBar } from '../components/charts/BenchmarkBar';
import { EmissionsTrend } from '../components/charts/EmissionsTrend';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { Users, Building2, Database, ShieldCheck, RefreshCw, Activity, BarChart2, Award } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats]     = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/emissions/admin/stats`);
      setStats(res.data);
    } catch (err) { console.error('Failed to retrieve administrative statistics', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  const compareData = [
    { name: 'Individuals (Avg)', value: stats?.summary?.averageUserEmissionKg     ? Number(stats.summary.averageUserEmissionKg.toFixed(1))     : 0 },
    { name: 'Industries (Avg)',  value: stats?.summary?.averageIndustryEmissionKg ? Number(stats.summary.averageIndustryEmissionKg.toFixed(1)) : 0 },
  ];

  const userTrendData = (stats?.recentIndividualLogs ?? []).slice().reverse().map((log: any, i: number) => ({
    name: `#${i + 1}`,
    value: log.totalEmissionsKg,
  }));

  const industryTrendData = (stats?.recentIndustryLogs ?? []).slice().reverse().map((log: any, i: number) => ({
    name: `#${i + 1}`,
    value: log.totalEmissionsKg,
  }));

  const indivTableColumns = [
    { key: 'user',            label: 'User',    render: (r: any) => r.user?.name ?? '—' },
    { key: 'country',         label: 'Country' },
    { key: 'createdAt',       label: 'Date',    render: (r: any) => new Date(r.createdAt).toLocaleDateString() },
    {
      key: 'totalEmissionsKg', label: 'Emissions', align: 'right' as const,
      render: (r: any) => <span className="font-bold text-accent-primary">{r.totalEmissionsKg.toFixed(1)} kg</span>,
    },
  ];

  const industryTableColumns = [
    { key: 'user',        label: 'Enterprise', render: (r: any) => r.user?.name ?? '—' },
    { key: 'processType', label: 'Process',    render: (r: any) => <span className="badge-muted">{r.processType}</span> },
    { key: 'month',       label: 'Month' },
    {
      key: 'totalEmissionsKg', label: 'Emissions', align: 'right' as const,
      render: (r: any) => (
        <span className={`font-bold ${r.totalEmissionsKg > 45000 ? 'text-rose-400' : 'text-accent-primary'}`}>
          {r.totalEmissionsKg.toFixed(1)} kg
        </span>
      ),
    },
  ];

  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-ink-primary">Administrative Console</h1>
          </div>
          <p className="text-ink-muted text-sm pl-9">
            Global analytics & aggregate metrics. Logged in as{' '}
            <span className="text-accent-primary font-semibold">{user?.name}</span>.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="btn-outline p-3"
          title="Refresh stats"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <KpiCard label="Total Users"    value={stats?.summary?.totalUsers ?? 0}                                           icon={<ShieldCheck className="w-5 h-5" />} color="orange" delay={0}    />
            <KpiCard label="Individuals"    value={stats?.summary?.individualUsersCount ?? 0}                                 icon={<Users className="w-5 h-5" />}       color="neutral" delay={0.05} />
            <KpiCard label="Industries"     value={stats?.summary?.industryUsersCount ?? 0}                                   icon={<Building2 className="w-5 h-5" />}   color="neutral" delay={0.1}  />
            <KpiCard label="Total Tracked"  value={stats?.summary ? Math.round((stats.summary.totalUserEmissionsKg + stats.summary.totalIndustryEmissionsKg) * 10) / 10 : 0} unit="kg" icon={<Database className="w-5 h-5" />} color="warm" delay={0.15} />
            <KpiCard label="Avg Individual" value={stats?.summary?.averageUserEmissionKg ? Number(stats.summary.averageUserEmissionKg.toFixed(1)) : 0}     unit="kg" icon={<Activity className="w-5 h-5" />}  color="orange" delay={0.2}  />
            <KpiCard label="Avg Industry"   value={stats?.summary?.averageIndustryEmissionKg ? Number(stats.summary.averageIndustryEmissionKg.toFixed(1)) : 0} unit="kg" icon={<BarChart2 className="w-5 h-5" />} color="red"    delay={0.25} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="dark-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
                  <BarChart2 className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-ink-primary text-sm">Average Emissions Comparison</span>
              </div>
              <BenchmarkBar data={compareData} colors={['#E87542', '#A8A29E']} />
            </div>

            <div className="dark-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-ink-primary text-sm">Sustainability Analytics</span>
              </div>
              <div className="flex flex-col gap-4 mt-2">
                <p className="text-sm text-ink-secondary leading-relaxed">
                  Industrial processes account for significantly higher carbon output than individual usage.
                  The platform currently tracks{' '}
                  <strong className="text-ink-primary">{stats?.summary?.totalUsers ?? 0}</strong> users
                  across{' '}
                  <strong className="text-ink-primary">{stats?.summary?.industryUsersCount ?? 0}</strong> enterprise accounts.
                </p>
                <div className="space-y-3 pt-3 border-t border-border">
                  {[
                    { label: 'Total User Emissions',     val: `${(stats?.summary?.totalUserEmissionsKg ?? 0).toFixed(1)} kg` },
                    { label: 'Total Industry Emissions', val: `${(stats?.summary?.totalIndustryEmissionsKg ?? 0).toFixed(1)} kg` },
                    { label: 'Avg Individual Footprint', val: `${stats?.summary?.averageUserEmissionKg ? stats.summary.averageUserEmissionKg.toFixed(2) : '0.00'} kg` },
                    { label: 'Avg Industry Footprint',   val: `${stats?.summary?.averageIndustryEmissionKg ? stats.summary.averageIndustryEmissionKg.toFixed(2) : '0.00'} kg` },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-ink-muted font-medium">{row.label}</span>
                      <strong className="text-accent-primary">{row.val}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trend Charts */}
          {(userTrendData.length > 1 || industryTrendData.length > 1) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {userTrendData.length > 1 && (
                <div className="dark-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-ink-primary text-sm">Individual Emissions Trend</span>
                  </div>
                  <EmissionsTrend data={userTrendData} color="#E87542" />
                </div>
              )}
              {industryTrendData.length > 1 && (
                <div className="dark-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-ink-primary text-sm">Industry Emissions Trend</span>
                  </div>
                  <EmissionsTrend data={industryTrendData} color="#A8A29E" />
                </div>
              )}
            </div>
          )}

          {/* Recent Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="dark-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-ink-primary text-sm">Recent Individual Logs</span>
              </div>
              <DataTable columns={indivTableColumns} data={stats?.recentIndividualLogs ?? []} pageSize={5} emptyMessage="No logs found." />
            </div>
            <div className="dark-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-ink-primary text-sm">Recent Industrial Logs</span>
              </div>
              <DataTable columns={industryTableColumns} data={stats?.recentIndustryLogs ?? []} pageSize={5} emptyMessage="No logs found." />
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
};

export default AdminDashboard;
