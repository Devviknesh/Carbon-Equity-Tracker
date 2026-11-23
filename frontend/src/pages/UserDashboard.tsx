import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { KpiCard } from '../components/ui/KpiCard';
import { SustainabilityScore } from '../components/ui/SustainabilityScore';
import { CustomSlider } from '../components/ui/CustomSlider';
import { DataTable } from '../components/ui/DataTable';
import { EmissionsTrend } from '../components/charts/EmissionsTrend';
import { CategoryBreakdown } from '../components/charts/CategoryBreakdown';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import {
  Car, Trash2, Zap, Utensils, MapPin, CheckCircle2,
  History, BarChart2, Leaf, TrendingDown,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  const [country, setCountry]                       = useState('India');
  const [commuteDistance, setCommuteDistance]       = useState(25);
  const [wasteGenerated, setWasteGenerated]         = useState(10);
  const [electricityConsumed, setElectricityConsumed] = useState(150);
  const [mealsPerDay, setMealsPerDay]               = useState(3);

  const [realTimeCommute, setRealTimeCommute]           = useState(0);
  const [realTimeWaste, setRealTimeWaste]               = useState(0);
  const [realTimeElectricity, setRealTimeElectricity]   = useState(0);
  const [realTimeMeals, setRealTimeMeals]               = useState(0);
  const [realTimeTotal, setRealTimeTotal]               = useState(0);

  const [history, setHistory]           = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg]     = useState('');
  const [mealsError, setMealsError]     = useState('');

  useEffect(() => {
    const commute     = commuteDistance * 0.05;
    const waste       = wasteGenerated * 0.1;
    const electricity = electricityConsumed * 0.4;
    let meals = 0;
    if (mealsPerDay > 0) { meals = mealsPerDay * 0.3; setMealsError(''); }
    else if (mealsPerDay !== 0) setMealsError('Enter a valid number of meals.');
    setRealTimeCommute(commute);
    setRealTimeWaste(waste);
    setRealTimeElectricity(electricity);
    setRealTimeMeals(meals);
    setRealTimeTotal(Math.round((commute + waste + electricity + meals) * 1000) / 1000);
  }, [commuteDistance, wasteGenerated, electricityConsumed, mealsPerDay]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/emissions/history`);
      setHistory(res.data);
    } catch (err) { console.error('Failed to fetch history', err); }
  };
  useEffect(() => { fetchHistory(); }, []);

  const handleLogEmissions = async () => {
    if (mealsPerDay <= 0 || isNaN(Number(mealsPerDay))) { setMealsError('Please enter a valid number of meals.'); return; }
    setIsSubmitting(true); setSuccessMsg('');
    try {
      await axios.post(`${API_BASE_URL}/emissions/user`, {
        country, commuteDistanceKm: commuteDistance, wasteGeneratedKg: wasteGenerated,
        electricityConsumedKwh: electricityConsumed, mealsPerDay: Number(mealsPerDay),
      });
      setSuccessMsg('Footprint calculated and saved successfully.');
      fetchHistory();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  const sustainabilityScore = Math.max(0, Math.min(100, Math.round(100 - (realTimeTotal / 80) * 100)));

  const chartData = [
    { name: 'Commute',     value: Number(realTimeCommute.toFixed(2)) },
    { name: 'Waste',       value: Number(realTimeWaste.toFixed(2)) },
    { name: 'Electricity', value: Number(realTimeElectricity.toFixed(2)) },
    { name: 'Meals',       value: Number(realTimeMeals.toFixed(2)) },
  ];

  const trendData = history.slice(0, 10).reverse().map((r, i) => ({
    name: `#${i + 1}`,
    value: r.totalEmissionsKg,
  }));

  const tableColumns = [
    { key: 'createdAt', label: 'Date',    render: (r: any) => new Date(r.createdAt).toLocaleDateString() },
    { key: 'country',   label: 'Country' },
    { key: 'commuteDistanceKm',      label: 'Commute',  render: (r: any) => `${r.commuteDistanceKm} km` },
    { key: 'wasteGeneratedKg',       label: 'Waste',    render: (r: any) => `${r.wasteGeneratedKg} kg` },
    { key: 'electricityConsumedKwh', label: 'Energy',   render: (r: any) => `${r.electricityConsumedKwh} kWh` },
    { key: 'mealsPerDay',            label: 'Meals',    render: (r: any) => `${r.mealsPerDay}/day` },
    {
      key: 'totalEmissionsKg', label: 'Total CO₂', align: 'right' as const,
      render: (r: any) => <span className="font-bold text-accent-primary">{r.totalEmissionsKg.toFixed(2)} kg</span>,
    },
  ];

  return (
    <AppShell>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink-primary">My Carbon Dashboard</h1>
        <p className="text-ink-muted text-sm mt-0.5">
          Welcome back, <span className="text-accent-primary font-semibold">{user?.name}</span>. Track and reduce your daily footprint.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard label="Daily Total CO₂"  value={realTimeTotal.toFixed(2)}       unit="kg" icon={<Leaf className="w-4 h-4" />}     color="orange"  delay={0}    />
        <KpiCard label="Transit"          value={realTimeCommute.toFixed(2)}     unit="kg" icon={<Car className="w-4 h-4" />}       color="neutral" delay={0.05} />
        <KpiCard label="Energy"           value={realTimeElectricity.toFixed(2)} unit="kg" icon={<Zap className="w-4 h-4" />}       color="neutral" delay={0.1}  />
        <KpiCard label="Diet"             value={realTimeMeals.toFixed(2)}       unit="kg" icon={<Utensils className="w-4 h-4" />}  color="warm"    delay={0.15} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Input Panel */}
        <section className="lg:col-span-7 dark-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-semibold text-ink-primary">Track Footprint Parameters</h2>
          </div>

          <div className="flex flex-col gap-5">
            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> Country of Residence
              </label>
              <select value={country} onChange={e => setCountry(e.target.value)} className="dark-input">
                <option>India</option><option>Brazil</option><option>China</option><option>Japan</option>
                <option>USA</option><option>UK</option><option>Germany</option><option>Australia</option>
              </select>
            </div>

            <CustomSlider label="Daily Commute Distance" min={1} max={100}  value={commuteDistance}    onChange={setCommuteDistance}    icon={<Car className="w-5 h-5" />}     suffix="km"  />
            <CustomSlider label="Daily Waste Generated"  min={1} max={100}  value={wasteGenerated}     onChange={setWasteGenerated}     icon={<Trash2 className="w-5 h-5" />}  suffix="kg"  />
            <CustomSlider label="Monthly Electricity"    min={1} max={1000} value={electricityConsumed} onChange={setElectricityConsumed} icon={<Zap className="w-5 h-5" />}     suffix="kWh" />

            {/* Meals */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Utensils className="w-3 h-3" /> Meals per Day
                </label>
                {mealsError && <span className="text-red-400 text-xs">{mealsError}</span>}
              </div>
              <input
                type="number" value={mealsPerDay || ''}
                onChange={e => setMealsPerDay(Number(e.target.value))}
                placeholder="3"
                className={`dark-input ${mealsError ? 'border-red-500/50' : ''}`}
              />
            </div>

            <div className="mt-1 flex flex-col gap-3">
              <button onClick={handleLogEmissions} disabled={isSubmitting} className="btn-orange w-full justify-center py-2.5">
                {isSubmitting
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><CheckCircle2 className="w-4 h-4" /><span>Log &amp; Record Calculation</span></>
                }
              </button>
              <AnimatePresence>
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="badge-orange px-4 py-2.5 rounded-xl text-sm font-medium text-center"
                  >
                    {successMsg}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Right: Score + Chart */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="dark-card p-5 flex flex-col items-center">
            <SustainabilityScore score={sustainabilityScore} />
            <div className="w-full mt-5 pt-4 border-t border-border grid grid-cols-2 gap-2.5 text-sm">
              {[
                { label: 'Commute', value: realTimeCommute.toFixed(2) },
                { label: 'Waste',   value: realTimeWaste.toFixed(2) },
                { label: 'Energy',  value: realTimeElectricity.toFixed(2) },
                { label: 'Diet',    value: realTimeMeals.toFixed(2) },
              ].map(item => (
                <div key={item.label} className="bg-bg-elevated rounded-xl p-3 border border-border">
                  <span className="text-[10px] text-ink-muted font-semibold block uppercase tracking-wider">{item.label}</span>
                  <span className="font-bold text-ink-primary text-sm">{item.value} kg</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dark-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                <BarChart2 className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-semibold text-ink-primary">Category Breakdown</h2>
            </div>
            <CategoryBreakdown data={chartData} />
          </div>
        </section>
      </div>

      {/* Trend Chart */}
      {trendData.length > 1 && (
        <div className="dark-card p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-semibold text-ink-primary">Emissions Trend (Last {trendData.length} Entries)</h2>
          </div>
          <EmissionsTrend data={trendData} />
        </div>
      )}

      {/* History Table */}
      <div className="dark-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
            <History className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-semibold text-ink-primary">Calculation Log History</h2>
        </div>
        <DataTable columns={tableColumns} data={history} pageSize={6} emptyMessage="No calculations logged yet." />
      </div>
    </AppShell>
  );
};

export default UserDashboard;
