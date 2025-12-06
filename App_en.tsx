
import React, { useState } from 'react';
import { SCENARIOS } from './constants';
import Header from './components/Header';
import { Section } from './components/DashboardComponents';
import { FadeInUp } from './components/AnimatedWrappers';
import { motion, AnimatePresence } from 'framer-motion';
import { BanknotesIcon, ChartBarIcon } from './components/Icons';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';

const formatCurrency = (value: number) => {
    return `SAR ${value.toLocaleString('en-US')}`;
};

type CaseType = 'worst' | 'base' | 'best';

// --- Apple-Style Segmented Control with Variants ---
const SegmentedControl: React.FC<{
    options: { value: string; label: string }[];
    selected: string;
    onChange: (value: any) => void;
    dark?: boolean;
    variant?: 'default' | 'black';
}> = ({ options, selected, onChange, dark = false, variant = 'default' }) => {
    
    // Determine styles based on variant and dark mode
    let containerClass = dark ? 'bg-white/10' : 'bg-gray-100';
    let activePillClass = 'bg-white shadow-sm';
    let activeTextClass = 'text-black';
    let inactiveTextClass = dark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900';

    // Override for Black Variant (Verdict Section)
    if (variant === 'black') {
        containerClass = 'bg-white border border-gray-200 shadow-sm';
        activePillClass = 'bg-[#1D1D1F] shadow-md';
        activeTextClass = 'text-white';
        inactiveTextClass = 'text-gray-500 hover:text-black';
    }

    return (
        <div className={`p-1.5 rounded-full flex relative ${containerClass}`}>
            {options.map((option) => {
                const isActive = selected === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`relative z-10 flex-1 px-4 sm:px-6 py-2 text-sm font-bold transition-colors duration-200 rounded-full whitespace-nowrap ${
                            isActive ? activeTextClass : inactiveTextClass
                        }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId={variant === 'black' ? "activeSegmentBlack" : (dark ? "activeSegmentDark" : "activeSegmentLight")}
                                className={`absolute inset-0 rounded-full ${activePillClass}`}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{option.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

const DigitalLedger: React.FC<{ 
    revenue: number; 
    items: { category: string; amount: number; color?: string }[] 
}> = ({ revenue, items }) => {
    return (
        <div className="w-full space-y-8">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1 block">Total Inflow</span>
                    <span className="text-3xl font-bold text-white tracking-tight tabular-nums">{formatCurrency(revenue)}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs font-medium text-white/40 bg-white/5 px-2 py-1 rounded">Gross Revenue</span>
                </div>
            </div>
            <div className="space-y-6">
                {items.map((item, idx) => {
                    const percent = revenue > 0 ? Math.round((item.amount / revenue) * 100) : 0;
                    return (
                        <div key={idx} className="group">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ring-2 ring-white/10 ${item.color || 'bg-white'}`}></div>
                                    <span className="text-sm font-medium text-white/90 tracking-wide">{item.category}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-bold text-white tabular-nums">{formatCurrency(item.amount)}</span>
                                </div>
                            </div>
                            {/* Apple Health Style Bar */}
                            <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1.2, ease: "circOut" }}
                                    className={`h-full rounded-full ${item.color || 'bg-white'} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                                />
                            </div>
                            <div className="text-right mt-1.5">
                                <span className="text-[10px] text-white/40 font-mono tracking-wider">{percent}% DISTRIBUTION</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

const ComparisonChart: React.FC<{ activeCase: CaseType }> = ({ activeCase }) => {
    const data = [
        { name: 'Revenue', Coliving: SCENARIOS[0].financials[activeCase].revenue, Private: SCENARIOS[1].financials[activeCase].revenue },
        { name: 'Net Income', Coliving: SCENARIOS[0].financials[activeCase].netIncome, Private: SCENARIOS[1].financials[activeCase].netIncome },
    ];

    return (
        <div className="h-72 w-full mt-8">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barGap={16} margin={{ top: 20 }}>
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }} 
                        dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                        cursor={{fill: '#F3F4F6', radius: 8}} 
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: 'none', 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            backgroundColor: '#fff',
                            padding: '12px 16px',
                            fontFamily: 'sans-serif'
                        }}
                        formatter={(value: number) => [formatCurrency(value), '']}
                        labelStyle={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}
                    />
                    <Bar dataKey="Coliving" radius={[6, 6, 6, 6]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SCENARIOS[0].color} fillOpacity={0.9} />
                        ))}
                    </Bar>
                    <Bar dataKey="Private" radius={[6, 6, 6, 6]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SCENARIOS[1].color} fillOpacity={0.9} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const App_en: React.FC<{ onToggleLanguage: () => void }> = ({ onToggleLanguage }) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [activeCase, setActiveCase] = useState<CaseType>('base');
  
  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];
  const currentFinancials = activeScenario.financials[activeCase];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans overflow-x-hidden selection:bg-[#4A2C5A] selection:text-white">
      <Header onToggleLanguage={onToggleLanguage} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-32">
        
        {/* Project Header */}
        <FadeInUp>
          <div className="text-center py-20 sm:py-28">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm"
            >
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">Strategic Feasibility Study</span>
            </motion.div>
            <h1 className="text-6xl sm:text-8xl font-black text-[#1D1D1F] tracking-tighter mb-8 leading-[0.9]">
              Al Nuzhah<span className="text-[#8A6E99]">.</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight">
                Strategic evaluation between the <span className="text-[#8A6E99]">Co-living</span> vs <span className="text-[#2A5B64]">Private accommodation model</span>.
            </p>
          </div>
        </FadeInUp>

        {/* SECTION 1: THE VERDICT */}
        <Section title="The Verdict" className="!mt-0" titleColor="text-[#1D1D1F]">
            
            {/* Global Case Toggle - BLACK VARIANT */}
            <div className="flex justify-center mb-16 overflow-x-auto px-4">
                <SegmentedControl 
                    variant="black"
                    selected={activeCase} 
                    onChange={(val) => setActiveCase(val)}
                    options={[
                        { value: 'worst', label: 'Conservative' },
                        { value: 'base', label: 'Realistic' },
                        { value: 'best', label: 'Optimistic' },
                    ]}
                />
            </div>

            <FadeInUp>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Winner Card (Bento Box Style) */}
                    <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 sm:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-shadow duration-500">
                        {/* Subtle Gradient Blob */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[#8A6E99]/20 to-transparent rounded-full blur-[100px] -mr-32 -mt-32 opacity-60"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2.5 mb-4">
                                <span className="flex h-2 w-2 rounded-full bg-[#8A6E99]"></span>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#8A6E99]">Highest Yield Model</span>
                            </div>
                            <h3 className="text-4xl sm:text-5xl font-bold text-[#1D1D1F] tracking-tight mb-2">Coliving</h3>
                            <p className="text-gray-500 font-medium text-lg">Consistently outperforms Private model.</p>
                        </div>

                        <div className="mt-16 relative z-10">
                            <motion.span 
                                key={currentFinancials.roi}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-8xl font-black text-[#8A6E99] tracking-tighter block"
                            >
                                {SCENARIOS[0].financials[activeCase].roi}<span className="text-4xl align-top">%</span>
                            </motion.span>
                            <span className="block text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Return on Investment ({activeCase})</span>
                        </div>
                    </div>

                    {/* Chart Card */}
                    <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 sm:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-8">
                             <div>
                                <h3 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Financial Projection</h3>
                                <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-wide">{activeCase} Case Scenario</p>
                             </div>
                             <div className="flex gap-6">
                                 <div className="flex items-center gap-2">
                                     <div className="w-3 h-3 rounded-full bg-[#8A6E99]"></div>
                                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Coliving</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <div className="w-3 h-3 rounded-full bg-[#2A5B64]"></div>
                                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Private</span>
                                 </div>
                             </div>
                        </div>
                        <div className="flex-1">
                            <ComparisonChart activeCase={activeCase} />
                        </div>
                    </div>

                </div>
            </FadeInUp>
        </Section>

        {/* SECTION 2: INTERACTIVE DEEP DIVE (Dark Mode) */}
        <Section title="Interactive Analysis" className="!mt-32" titleColor="text-[#1D1D1F]">
            
            {/* The Cockpit */}
            <div className="bg-[#000000] text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                
                {/* Control Bar */}
                <div className="bg-white/5 backdrop-blur-xl border-b border-white/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-20">
                     {/* Model Selector */}
                     <SegmentedControl 
                        selected={activeScenarioId} 
                        onChange={(val) => setActiveScenarioId(val)}
                        dark={true}
                        options={SCENARIOS.map(s => ({ value: s.id, label: s.name }))}
                     />

                    {/* Sensitivity Selector (Synced) */}
                    <div className="w-full sm:w-auto overflow-x-auto">
                        <SegmentedControl 
                            selected={activeCase} 
                            onChange={(val) => setActiveCase(val)}
                            dark={true}
                            options={[
                                { value: 'worst', label: 'Conservative' },
                                { value: 'base', label: 'Realistic' },
                                { value: 'best', label: 'Optimistic' },
                            ]}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeScenario.id}-${activeCase}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10"
                    >
                        {/* LEFT COLUMN: The Engine */}
                        <div className="lg:col-span-7 space-y-10">
                            
                            {/* Hero Revenue */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Projected Annual Revenue</p>
                                <div className="flex items-baseline gap-6">
                                    <h2 className="text-6xl sm:text-8xl font-black tracking-tighter text-white tabular-nums">
                                        {formatCurrency(currentFinancials.revenue)}
                                    </h2>
                                </div>
                                <div className="inline-flex items-center gap-2 mt-6 px-3 py-1.5 rounded-md bg-white/10 border border-white/5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span className="text-xs font-bold text-white/70 tracking-wide uppercase">{activeScenario.occupancyDurationLabel} ({activeCase})</span>
                                </div>
                            </div>

                            {/* Digital Ledger */}
                            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                                <h4 className="text-lg font-bold mb-8 flex items-center gap-3 text-white">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <BanknotesIcon className="w-5 h-5 text-white/90" />
                                    </div>
                                    Financial Distribution
                                </h4>
                                <DigitalLedger 
                                    revenue={currentFinancials.revenue} 
                                    items={[
                                        { category: 'Mathwaa Share (20%)', amount: currentFinancials.mathwaaShare, color: 'bg-purple-400' },
                                        { category: 'Net Income (Owner)', amount: currentFinancials.netIncome, color: 'bg-emerald-400' }
                                    ]} 
                                />
                            </div>

                            {/* Unit Mix */}
                            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                                <h4 className="text-lg font-bold mb-6 text-white/90">Inventory Composition</h4>
                                <div className="space-y-4">
                                    {activeScenario.unitMix.map((unit, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-sm font-bold text-white/40">
                                                    {unit.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-lg">{unit.name}</p>
                                                    <p className="text-xs text-white/40 uppercase tracking-wider">Avg. {formatCurrency(unit.avgPrice)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-2xl font-bold text-white">{unit.count}</span>
                                                <span className="text-xs text-white/40 uppercase tracking-wider">{activeScenario.unitLabel}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Context */}
                        <div className="lg:col-span-5 space-y-8">
                            
                            {/* ROI Card (Dark Mode) */}
                            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#000000] p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/20 rounded-full blur-[80px] group-hover:bg-yellow-500/30 transition-all duration-700"></div>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Return on Investment</p>
                                <p className="text-7xl font-black text-yellow-400 tracking-tighter tabular-nums">{currentFinancials.roi}%</p>
                                <p className="text-sm font-medium text-white/30 mt-4 border-t border-white/5 pt-4">Calculated based on {formatCurrency(activeScenario.propertyValue)} property valuation.</p>
                            </div>

                             {/* Strategy Text */}
                             <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10">
                                 <h4 className="text-white font-bold text-xl mb-4">Model Strategy</h4>
                                 <p className="text-lg text-white/60 leading-relaxed font-light">
                                     {activeScenario.description}
                                 </p>
                             </div>

                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>
        </Section>

      </main>
    </div>
  );
};

export default App_en;
