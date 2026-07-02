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
import {
  Car, Trash2, Zap, Utensils, MapPin, CheckCircle2,
  History, BarChart2, Leaf, TrendingDown,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  const [country, setCountry]                     = useState('India');
  const [commuteDistance, setCommuteDistance]     = useState(25);
  const [wasteGenerated, setWasteGenerated]       = useState(10);
  const [electricityConsumed, setElectricityConsumed] = useState(150);
  const [mealsPerDay, setMealsPerDay]             = useState(3);

  const [realTimeCommute, setRealTimeCommute]         = useState(0);
  const [realTimeWaste, setRealTimeWaste]             = useState(0);
  const [realTimeElectricity, setRealTimeElectricity] = useState(0);
  const [realTimeMeals, setRealTimeMeals]             = useState(0);
  const [realTimeTotal, setRealTimeTotal]             = useState(0);

  const [history, setHistory]         = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg]   = useState('');
  const [mealsError, setMealsError]   = useState('');

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
      const res = await axios.get('http://localhost:5000/api/emissions/history');
      setHistory(res.data);
    } catch (err) { console.error('Failed to fetch history', err); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleLogEmissions = async () => {
    if (mealsPerDay <= 0 || isNaN(Number(mealsPerDay))) { setMealsError('Please enter a valid number of meals.'); return; }
    setIsSubmitting(true); setSuccessMsg('');
    try {
      await axios.post('http://localhost:5000/api/emissions/user', {
        country, commuteDistanceKm: commuteDistance, wasteGeneratedKg: wasteGenerated,
        electricityConsumedKwh: electricityConsumed, mealsPerDay: Number(mealsPerDay),
      });
      setSuccessMsg('Footprint calculated and saved successfully.');
      fetchHistory();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  // Sustainability score (0–100, higher = better)
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
    { key: 'createdAt', label: 'Date', render: (r: any) => new Date(r.createdAt).toLocaleDateString() },
    { key: 'country',   label: 'Country' },
    { key: 'commuteDistanceKm',      label: 'Commute', render: (r: any) => `${r.commuteDistanceKm} km` },
    { key: 'wasteGeneratedKg',       label: 'Waste',   render: (r: any) => `${r.wasteGeneratedKg} kg` },
    { key: 'electricityConsumedKwh', label: 'Energy',  render: (r: any) => `${r.electricityConsumedKwh} kWh` },
    { key: 'mealsPerDay',            label: 'Meals',   render: (r: any) => `${r.mealsPerDay}/day` },
    {
      key: 'totalEmissionsKg', label: 'Total CO₂', align: 'right' as const,
      render: (r: any) => (
        <span className="font-bold text-accent-glow">{r.totalEmissionsKg.toFixed(2)} kg</span>
      ),
    },
  ];

  return (
    <AppShell>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-50">My Carbon Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, <span className="text-accent-glow font-semibold">{user?.name}</span>. Track and reduce your daily footprint.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Daily Total CO₂"  value={realTimeTotal.toFixed(2)} unit="kg"   icon={<Leaf className="w-5 h-5" />}     color="green"  delay={0}    />
        <KpiCard label="Transit Emissions" value={realTimeCommute.toFixed(2)} unit="kg" icon={<Car className="w-5 h-5" />}      color="cyan"   delay={0.05} />
        <KpiCard label="Energy Emissions"  value={realTimeElectricity.toFixed(2)} unit="kg" icon={<Zap className="w-5 h-5" />} color="violet" delay={0.1}  />
        <KpiCard label="Diet Impact"       value={realTimeMeals.toFixed(2)} unit="kg"   icon={<Utensils className="w-5 h-5" />} color="amber"  delay={0.15} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Input Panel */}
        <section className="lg:col-span-7 glass-card p-6">
          <div className="section-heading">
            <div className="section-heading-icon"><TrendingDown className="w-4 h-4" /></div>
            <span>Track Footprint Parameters</span>
          </div>

          <div className="flex flex-col gap-6">
            {/* Country */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Country of Residence
              </label>
              <select value={country} onChange={e => setCountry(e.target.value)} className="glass-input">
                <option>India</option><option>Brazil</option><option>China</option><option>Japan</option>
                <option>USA</option><option>UK</option><option>Germany</option><option>Australia</option>
              </select>
            </div>

            <CustomSlider label="Daily Commute Distance" min={1} max={100} value={commuteDistance} onChange={setCommuteDistance} icon={<Car className="w-5 h-5" />} suffix="km" />
            <CustomSlider label="Daily Waste Generated"  min={1} max={100} value={wasteGenerated}  onChange={setWasteGenerated}  icon={<Trash2 className="w-5 h-5" />} suffix="kg" />
            <CustomSlider label="Monthly Electricity"    min={1} max={1000} value={electricityConsumed} onChange={setElectricityConsumed} icon={<Zap className="w-5 h-5" />} suffix="kWh" />

            {/* Meals input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Utensils className="w-3.5 h-3.5" /> Meals per Day
                </label>
                {mealsError && <span className="text-rose-400 text-xs font-semibold">{mealsError}</span>}
              </div>
              <input
                type="number"
                value={mealsPerDay || ''}
                onChange={e => setMealsPerDay(Number(e.target.value))}
                placeholder="3"
                className={`glass-input ${mealsError ? 'glass-input-error' : ''}`}
              />
            </div>

            <div className="mt-2 flex flex-col gap-3">
              <button onClick={handleLogEmissions} disabled={isSubmitting} className="btn-primary w-full py-3">
                {isSubmitting
                  ? <div className="w-5 h-5 border-2 border-carbon-950 border-t-transparent rounded-full animate-spin" />
                  : <><CheckCircle2 className="w-5 h-5" /><span>Log &amp; Record Calculation</span></>
                }
              </button>
              <AnimatePresence>
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="badge-green px-4 py-3 rounded-xl text-sm font-medium text-center"
                  >
                    {successMsg}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Right: Score + Chart */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card p-6 flex flex-col items-center">
            <SustainabilityScore score={sustainabilityScore} />

            <div className="w-full mt-6 pt-5 border-t border-white/6 grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Commute', value: realTimeCommute.toFixed(2) },
                { label: 'Waste',   value: realTimeWaste.toFixed(2) },
                { label: 'Energy',  value: realTimeElectricity.toFixed(2) },
                { label: 'Diet',    value: realTimeMeals.toFixed(2) },
              ].map(item => (
                <div key={item.label} className="bg-white/3 rounded-xl p-3 border border-white/5">
                  <span className="text-xs text-slate-500 font-bold block">{item.label}</span>
                  <span className="font-bold text-slate-100">{item.value} kg</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="section-heading">
              <div className="section-heading-icon"><BarChart2 className="w-4 h-4" /></div>
              <span>Category Breakdown</span>
            </div>
            <CategoryBreakdown data={chartData} />
          </div>
        </section>
      </div>

      {/* Trend Chart */}
      {trendData.length > 1 && (
        <div className="glass-card p-6 mb-6">
          <div className="section-heading">
            <div className="section-heading-icon"><TrendingDown className="w-4 h-4" /></div>
            <span>Emissions Trend (Last {trendData.length} Entries)</span>
          </div>
          <EmissionsTrend data={trendData} />
        </div>
      )}

      {/* History Table */}
      <div className="glass-card p-6">
        <div className="section-heading">
          <div className="section-heading-icon"><History className="w-4 h-4" /></div>
          <span>Calculation Log History</span>
        </div>
        <DataTable columns={tableColumns} data={history} pageSize={6} emptyMessage="No calculations logged yet." />
      </div>
    </AppShell>
  );
};

export default UserDashboard;
