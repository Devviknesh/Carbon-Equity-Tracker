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
import { API_BASE_URL } from '../config/api';
import {
  Leaf, Settings, Calendar, Info, CheckCircle2,
  History, ShieldAlert, TrendingUp, Trash2, BarChart2, Zap,
} from 'lucide-react';

const INDUSTRY_BENCHMARK = 45000;

export const IndustryDashboard: React.FC = () => {
  const { user } = useAuth();

  const [month, setMonth]               = useState('January');
  const [processType, setProcessType]   = useState('Manufacturing');
  const [rawMaterials, setRawMaterials] = useState(5.5);
  const [energyConsumed, setEnergyConsumed]     = useState(25000);
  const [totalWaste, setTotalWaste]             = useState(3000);
  const [transportation, setTransportation]     = useState(1500);

  const [realTimeEnergy, setRealTimeEnergy]         = useState(0);
  const [realTimeMaterials, setRealTimeMaterials]   = useState(0);
  const [realTimeWaste, setRealTimeWaste]           = useState(0);
  const [realTimeTransport, setRealTimeTransport]   = useState(0);
  const [realTimeTotal, setRealTimeTotal]           = useState(0);
  const [hasWarning, setHasWarning]                 = useState(false);

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
      const res = await axios.get(`${API_BASE_URL}/emissions/history`);
      setHistory(res.data);
    } catch (err) { console.error('Failed to retrieve history logs', err); }
  };
  useEffect(() => { fetchHistory(); }, []);

  const handleLogEmissions = async () => {
    if (rawMaterials <= 0 || isNaN(Number(rawMaterials))) { setMaterialsError('Please enter a valid raw material usage.'); return; }
    setIsSubmitting(true); setSuccessMsg('');
    try {
      await axios.post(`${API_BASE_URL}/emissions/industry`, {
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
    { key: 'createdAt',   label: 'Date',    render: (r: any) => new Date(r.createdAt).toLocaleDateString() },
    { key: 'month',       label: 'Month' },
    { key: 'processType', label: 'Process', render: (r: any) => <span className="badge-muted">{r.processType}</span> },
    { key: 'energyConsumedKwh',        label: 'Energy',    render: (r: any) => `${r.energyConsumedKwh.toLocaleString()} kWh` },
    { key: 'rawMaterialUsedTons',      label: 'Materials', render: (r: any) => `${r.rawMaterialUsedTons} t` },
    { key: 'totalWasteProducedTons',   label: 'Waste',     render: (r: any) => `${r.totalWasteProducedTons.toLocaleString()} t` },
    { key: 'transportationDistanceKm', label: 'Transport', render: (r: any) => `${r.transportationDistanceKm.toLocaleString()} km` },
    {
      key: 'totalEmissionsKg', label: 'Total CO₂', align: 'right' as const,
      render: (r: any) => (
        <span className={`font-bold ${r.totalEmissionsKg > INDUSTRY_BENCHMARK ? 'text-red-400' : 'text-accent-primary'}`}>
          {r.totalEmissionsKg.toLocaleString()} kg
        </span>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ink-primary">Industrial Emissions Console</h1>
        <p className="text-ink-muted text-sm mt-0.5">
          Enterprise: <span className="text-accent-primary font-semibold">{user?.name}</span>. Measure and log process emissions.
        </p>
      </div>

      {/* Warning Banner */}
      <AnimatePresence>
        {hasWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
            className="mb-5 bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-center gap-4"
          >
            <ShieldAlert className="w-8 h-8 text-red-400 shrink-0" />
            <div>
              <h3 className="font-semibold text-red-400 text-sm">High Footprint Warning</h3>
              <p className="text-xs text-ink-secondary mt-0.5">
                Current total <strong className="text-red-300">{realTimeTotal.toLocaleString()} kg</strong> exceeds the industry benchmark of <strong>45,000 kg</strong>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KpiCard label="Total Process CO₂" value={realTimeTotal.toLocaleString()} unit="kg" icon={<Leaf className="w-4 h-4" />}     color={hasWarning ? 'red' : 'orange'} delay={0}    />
        <KpiCard label="Energy"             value={realTimeEnergy.toLocaleString()} unit="kg" icon={<Zap className="w-4 h-4" />}      color="neutral" delay={0.05} />
        <KpiCard label="Materials CO₂"      value={realTimeMaterials.toFixed(1)} unit="kg"    icon={<Settings className="w-4 h-4" />}  color="neutral" delay={0.1}  />
        <KpiCard label="Waste + Transport"  value={(realTimeWaste + realTimeTransport).toFixed(1)} unit="kg" icon={<Trash2 className="w-4 h-4" />} color="warm" delay={0.15} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Input Panel */}
        <section className="lg:col-span-7 dark-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
              <Settings className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-sm font-semibold text-ink-primary">Production Parameters</h2>
          </div>

          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3 h-3" />Month</label>
                <select value={month} onChange={e => setMonth(e.target.value)} className="dark-input">
                  {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider flex items-center gap-1.5"><Info className="w-3 h-3" />Process</label>
                <select value={processType} onChange={e => setProcessType(e.target.value)} className="dark-input">
                  <option>Manufacturing</option><option>Processing</option><option>Assembly</option><option>Other</option>
                </select>
              </div>
            </div>

            <CustomSlider label="Energy Consumption" min={10000} max={100000} value={energyConsumed} onChange={setEnergyConsumed} icon={<Zap className="w-5 h-5" />} suffix="kWh" />

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">Raw Material Usage (tons)</label>
                {materialsError && <span className="text-red-400 text-xs">{materialsError}</span>}
              </div>
              <input type="number" step="0.1" value={rawMaterials || ''} onChange={e => setRawMaterials(Number(e.target.value))} placeholder="5.5" className={`dark-input ${materialsError ? 'border-red-500/50' : ''}`} />
            </div>

            <CustomSlider label="Total Waste Produced"   min={1000} max={10000} value={totalWaste}    onChange={setTotalWaste}    icon={<Trash2 className="w-5 h-5" />}   suffix="tons" />
            <CustomSlider label="Transportation Distance" min={1000} max={3000}  value={transportation} onChange={setTransportation} icon={<TrendingUp className="w-5 h-5" />} suffix="km"  />

            <div className="mt-1 flex flex-col gap-3">
              <button onClick={handleLogEmissions} disabled={isSubmitting} className="btn-orange w-full justify-center py-2.5">
                {isSubmitting
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><CheckCircle2 className="w-4 h-4" /><span>Log Emissions Report</span></>
                }
              </button>
              <AnimatePresence>
                {successMsg && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="badge-orange px-4 py-2.5 rounded-xl text-sm font-medium text-center"
                  >{successMsg}</motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Right Panel */}
        <section className="lg:col-span-5 flex flex-col gap-4">
          <div className="dark-card p-5">
            <div className="text-center mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Real-Time Estimate</span>
              <div className={`text-5xl font-bold mt-2 transition-colors duration-300 ${hasWarning ? 'text-red-400' : 'text-accent-primary'}`}>
                {realTimeTotal.toLocaleString()}
              </div>
              <span className="text-[10px] text-ink-muted font-semibold uppercase tracking-widest">kg CO₂ / Month</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mt-3 pt-4 border-t border-border">
              {[
                { label: 'Energy',    value: realTimeEnergy },
                { label: 'Materials', value: realTimeMaterials },
                { label: 'Waste',     value: realTimeWaste },
                { label: 'Transport', value: realTimeTransport },
              ].map(item => (
                <div key={item.label} className="bg-bg-elevated rounded-xl p-3 border border-border">
                  <span className="text-[10px] text-ink-muted font-semibold block uppercase tracking-wider">{item.label}</span>
                  <span className="font-bold text-ink-primary text-sm">{item.value.toLocaleString()} kg</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dark-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                <BarChart2 className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-sm font-semibold text-ink-primary">Category Allocation</h2>
            </div>
            <CategoryBreakdown data={chartData} />
          </div>
        </section>
      </div>

      {/* Benchmark Chart */}
      <div className="dark-card p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
            <BarChart2 className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-semibold text-ink-primary">vs. Industry Benchmark (45,000 kg)</h2>
        </div>
        <BenchmarkBar
          data={benchmarkData}
          benchmarkValue={INDUSTRY_BENCHMARK}
          benchmarkLabel="Threshold"
          colors={[hasWarning ? '#ef4444' : '#E87542', '#57534E']}
        />
      </div>

      {/* History Table */}
      <div className="dark-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
            <History className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-semibold text-ink-primary">Industrial Calculation Logs</h2>
        </div>
        <DataTable columns={tableColumns} data={history} pageSize={6} emptyMessage="No calculations logged yet." />
      </div>
    </AppShell>
  );
};

export default IndustryDashboard;
