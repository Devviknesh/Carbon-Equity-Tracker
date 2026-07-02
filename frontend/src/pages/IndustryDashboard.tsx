import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { KpiCard } from '../components/ui/KpiCard';
import { CustomSlider } from '../components/ui/CustomSlider';
import { DataTable } from '../components/ui/DataTable';
import { CategoryBreakdown } from '../components/charts/CategoryBreakdown';
import { BenchmarkBar } from '../components/charts/BenchmarkBar';
import axios from 'axios';
import {
  Leaf, Settings, Calendar, Info, CheckCircle2,
  History, ShieldAlert, TrendingUp, Trash2, BarChart2, Zap,
} from 'lucide-react';

const INDUSTRY_BENCHMARK = 45000;

export const IndustryDashboard: React.FC = () => {
  const { user } = useAuth();

  const [month, setMonth]                 = useState('January');
  const [processType, setProcessType]     = useState('Manufacturing');
  const [rawMaterials, setRawMaterials]   = useState(5.5);
  const [energyConsumed, setEnergyConsumed]       = useState(25000);
  const [totalWaste, setTotalWaste]               = useState(3000);
  const [transportation, setTransportation]       = useState(1500);

  const [realTimeEnergy, setRealTimeEnergy]       = useState(0);
  const [realTimeMaterials, setRealTimeMaterials] = useState(0);
  const [realTimeWaste, setRealTimeWaste]         = useState(0);
  const [realTimeTransport, setRealTimeTransport] = useState(0);
  const [realTimeTotal, setRealTimeTotal]         = useState(0);
  const [hasWarning, setHasWarning]               = useState(false);

  const [history, setHistory]             = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [successMsg, setSuccessMsg]       = useState('');
  const [materialsError, setMaterialsError] = useState('');

  useEffect(() => {
    const energy    = energyConsumed * 0.92;
    const waste     = totalWaste * 0.2;
    const transport = transportation * 0.05;
    let materials = 0;
    if (rawMaterials > 0) { materials = rawMaterials * 1.5; setMaterialsError(''); }
    else if (rawMaterials !== 0) setMaterialsError('Enter a valid material usage.');
    const total = energy + materials + waste + transport;
    setRealTimeEnergy(energy); setRealTimeMaterials(materials);
    setRealTimeWaste(waste);   setRealTimeTransport(transport);
    setRealTimeTotal(Math.round(total * 100) / 100);
    setHasWarning(total > INDUSTRY_BENCHMARK);
  }, [rawMaterials, energyConsumed, totalWaste, transportation]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/emissions/history');
      setHistory(res.data);
    } catch (err) { console.error('Failed to retrieve history logs', err); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleLogEmissions = async () => {
    if (rawMaterials <= 0 || isNaN(Number(rawMaterials))) { setMaterialsError('Please enter a valid raw material usage.'); return; }
    setIsSubmitting(true); setSuccessMsg('');
    try {
      await axios.post('http://localhost:5000/api/emissions/industry', {
        month, processType,
        energyConsumedKwh: energyConsumed, rawMaterialUsedTons: Number(rawMaterials),
        totalWasteProducedTons: totalWaste, transportationDistanceKm: transportation,
      });
      setSuccessMsg('Industry footprint recorded successfully.');
      fetchHistory();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  const chartData = [
    { name: 'Energy',    value: Number(realTimeEnergy.toFixed(2)) },
    { name: 'Materials', value: Number(realTimeMaterials.toFixed(2)) },
    { name: 'Waste',     value: Number(realTimeWaste.toFixed(2)) },
    { name: 'Transport', value: Number(realTimeTransport.toFixed(2)) },
  ];

  const benchmarkData = [
    { name: 'Current Process', value: realTimeTotal },
    { name: 'Industry Avg',    value: INDUSTRY_BENCHMARK },
  ];

  const tableColumns = [
    { key: 'createdAt',  label: 'Date',    render: (r: any) => new Date(r.createdAt).toLocaleDateString() },
    { key: 'month',      label: 'Month' },
    { key: 'processType', label: 'Process', render: (r: any) => <span className="badge-blue">{r.processType}</span> },
    { key: 'energyConsumedKwh',       label: 'Energy',    render: (r: any) => `${r.energyConsumedKwh.toLocaleString()} kWh` },
    { key: 'rawMaterialUsedTons',     label: 'Materials', render: (r: any) => `${r.rawMaterialUsedTons} t` },
    { key: 'totalWasteProducedTons',  label: 'Waste',     render: (r: any) => `${r.totalWasteProducedTons.toLocaleString()} t` },
    { key: 'transportationDistanceKm', label: 'Transport', render: (r: any) => `${r.transportationDistanceKm.toLocaleString()} km` },
    {
      key: 'totalEmissionsKg', label: 'Total CO₂', align: 'right' as const,
      render: (r: any) => (
        <span className={`font-bold ${r.totalEmissionsKg > INDUSTRY_BENCHMARK ? 'text-rose-400' : 'text-accent-glow'}`}>
          {r.totalEmissionsKg.toLocaleString()} kg
        </span>
      ),
    },
  ];

  return (
    <AppShell>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-50">Industrial Emissions Console</h1>
        <p className="text-slate-500 text-sm mt-1">Enterprise account: <span className="text-accent-glow font-semibold">{user?.name}</span>. Measure and log process emissions.</p>
      </div>

      {/* Warning Banner */}
      <AnimatePresence>
        {hasWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="mb-6 bg-rose-500/10 border-2 border-rose-500/30 p-5 rounded-2xl flex items-center gap-4 shadow-lg"
          >
            <ShieldAlert className="w-10 h-10 text-rose-400 shrink-0 animate-bounce" />
            <div>
              <h3 className="font-bold text-rose-400 text-base">High Footprint Warning</h3>
              <p className="text-sm text-slate-300 mt-0.5">
                Current total <strong className="text-rose-300">{realTimeTotal.toLocaleString()} kg</strong> exceeds the industry benchmark of <strong>45,000 kg</strong>. Review energy and material efficiency.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Total Process CO₂"  value={realTimeTotal.toLocaleString()} unit="kg" icon={<Leaf className="w-5 h-5" />}     color={hasWarning ? 'red' : 'green'} delay={0}    />
        <KpiCard label="Energy Emissions"   value={realTimeEnergy.toLocaleString()} unit="kg" icon={<Zap className="w-5 h-5" />}      color="cyan"   delay={0.05} />
        <KpiCard label="Materials CO₂"      value={realTimeMaterials.toFixed(1)} unit="kg"    icon={<Settings className="w-5 h-5" />}  color="violet" delay={0.1}  />
        <KpiCard label="Waste + Transport"  value={(realTimeWaste + realTimeTransport).toFixed(1)} unit="kg" icon={<Trash2 className="w-5 h-5" />} color="amber" delay={0.15} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Input Panel */}
        <section className="lg:col-span-7 glass-card p-6">
          <div className="section-heading">
            <div className="section-heading-icon"><Settings className="w-4 h-4" /></div>
            <span>Production Parameters</span>
          </div>

          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              {/* Month */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Month</label>
                <select value={month} onChange={e => setMonth(e.target.value)} className="glass-input">
                  {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              {/* Process Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Info className="w-3.5 h-3.5" />Process</label>
                <select value={processType} onChange={e => setProcessType(e.target.value)} className="glass-input">
                  <option>Manufacturing</option><option>Processing</option><option>Assembly</option><option>Other</option>
                </select>
              </div>
            </div>

            <CustomSlider label="Energy Consumption" min={10000} max={100000} value={energyConsumed} onChange={setEnergyConsumed} icon={<Zap className="w-5 h-5" />} suffix="kWh" />

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Raw Material Usage (tons)</label>
                {materialsError && <span className="text-rose-400 text-xs font-semibold">{materialsError}</span>}
              </div>
              <input
                type="number" step="0.1"
                value={rawMaterials || ''}
                onChange={e => setRawMaterials(Number(e.target.value))}
                placeholder="5.5"
                className={`glass-input ${materialsError ? 'glass-input-error' : ''}`}
              />
            </div>

            <CustomSlider label="Total Waste Produced"   min={1000}  max={10000} value={totalWaste}     onChange={setTotalWaste}     icon={<Trash2 className="w-5 h-5" />}   suffix="tons" />
            <CustomSlider label="Transportation Distance" min={1000}  max={3000}  value={transportation}  onChange={setTransportation}  icon={<TrendingUp className="w-5 h-5" />} suffix="km" />

            <div className="mt-2 flex flex-col gap-3">
              <button onClick={handleLogEmissions} disabled={isSubmitting} className="btn-primary w-full py-3">
                {isSubmitting
                  ? <div className="w-5 h-5 border-2 border-carbon-950 border-t-transparent rounded-full animate-spin" />
                  : <><CheckCircle2 className="w-5 h-5" /><span>Log Emissions Report</span></>
                }
              </button>
              <AnimatePresence>
                {successMsg && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="badge-green px-4 py-3 rounded-xl text-sm font-medium text-center"
                  >{successMsg}</motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Right Panel */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-card p-6">
            <div className="text-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Real-Time Estimate</span>
              <div className={`text-5xl font-black mt-3 transition-colors duration-300 ${hasWarning ? 'text-rose-400' : 'text-accent-glow'}`}>
                {realTimeTotal.toLocaleString()}
              </div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">kg CO₂ / Month</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { label: 'Energy',    value: realTimeEnergy },
                { label: 'Materials', value: realTimeMaterials },
                { label: 'Waste',     value: realTimeWaste },
                { label: 'Transport', value: realTimeTransport },
              ].map(item => (
                <div key={item.label} className="bg-white/3 rounded-xl p-3 border border-white/5">
                  <span className="text-xs text-slate-500 font-bold block">{item.label}</span>
                  <span className="font-bold text-slate-100 text-sm">{item.value.toLocaleString()} kg</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="section-heading">
              <div className="section-heading-icon"><BarChart2 className="w-4 h-4" /></div>
              <span>Category Allocation</span>
            </div>
            <CategoryBreakdown data={chartData} />
          </div>
        </section>
      </div>

      {/* Benchmark Chart */}
      <div className="glass-card p-6 mb-6">
        <div className="section-heading">
          <div className="section-heading-icon"><BarChart2 className="w-4 h-4" /></div>
          <span>vs. Industry Benchmark (45,000 kg)</span>
        </div>
        <BenchmarkBar
          data={benchmarkData}
          benchmarkValue={INDUSTRY_BENCHMARK}
          benchmarkLabel="Threshold"
          colors={[hasWarning ? '#ef4444' : '#10b981', '#64748b']}
        />
      </div>

      {/* History Table */}
      <div className="glass-card p-6">
        <div className="section-heading">
          <div className="section-heading-icon"><History className="w-4 h-4" /></div>
          <span>Industrial Calculation Logs</span>
        </div>
        <DataTable columns={tableColumns} data={history} pageSize={6} emptyMessage="No calculations logged yet." />
      </div>
    </AppShell>
  );
};

export default IndustryDashboard;
