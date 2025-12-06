
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
        <div className={`p-1 rounded-full flex relative w-full sm:w-auto overflow-hidden ${containerClass}`}>
            {options.map((option) => {
                const isActive = selected === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`relative z-10 flex-1 px-4 py-1.5 text-xs sm:text-sm font-bold transition-colors duration-200 rounded-full whitespace-nowrap ${
                            isActive ? activeTextClass : inactiveTextClass
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
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
        <div className="w-full space-y-4">
            <div className="flex justify-between items-end border-b border-white/10 pb-3">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5 block">Total Inflow</span>
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight tabular-nums">{formatCurrency(revenue)}</span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-medium text-white/40 bg-white/5 px-1.5 py-0.5 rounded">Gross Revenue</span>
                </div>
            </div>
            <div className="space-y-3">
                {items.map((item, idx) => {
                    const percent = revenue > 0 ? Math.round((item.amount / revenue) * 100) : 0;
                    return (
                        <div key={idx} className="group">
                            <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ring-1 ring-white/10 ${item.color || 'bg-white'}`}></div>
                                    <span className="text-xs font-medium text-white/90 tracking-wide">{item.category}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-sm font-bold text-white tabular-nums">{formatCurrency(item.amount)}</span>
                                </div>
                            </div>
                            {/* Apple Health Style Bar */}
                            <div className="w-full h-1.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 1.2, ease: "circOut" }}
                                    className={`h-full rounded-full ${item.color || 'bg-white'} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
                                />
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
        <div className="h-56 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barGap={8} margin={{ top: 10 }}>
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }} 
                        dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                        cursor={{fill: '#F3F4F6', radius: 6}} 
                        contentStyle={{ 
                            borderRadius: '8px', 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            backgroundColor: '#fff',
                            padding: '8px 12px',
                            fontFamily: 'sans-serif',
                            fontSize: '12px'
                        }}
                        formatter={(value: number) => [formatCurrency(value), '']}
                        labelStyle={{ color: '#9CA3AF', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px' }}
                    />
                    <Bar dataKey="Coliving" radius={[4, 4, 4, 4]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={SCENARIOS[0].color} fillOpacity={0.9} />
                        ))}
                    </Bar>
                    <Bar dataKey="Private" radius={[4, 4, 4, 4]}>
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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        
        {/* Project Header */}
        <FadeInUp>
          <div className="text-center py-10 sm:py-16">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block mb-3 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm"
            >
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Strategic Feasibility Study</span>
            </motion.div>
            <h1 className="text-4xl sm:text-6xl font-black text-[#1D1D1F] tracking-tighter mb-4 leading-none">
              Al Nuzhah<span className="text-[#8A6E99]">.</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight px-4">
                Strategic evaluation between the <span className="text-[#8A6E99]">Co-living</span> vs <span className="text-[#2A5B64]">Private accommodation model</span>.
            </p>
          </div>
        </FadeInUp>

        {/* SECTION 1: THE VERDICT */}
        <Section title="The Verdict" className="!mt-0" titleColor="text-[#1D1D1F]">
            
            {/* Global Case Toggle - Sticky on Mobile */}
            <div className="sticky top-20 z-30 py-2 bg-[#F5F5F7]/95 backdrop-blur-md -mx-4 px-4 sm:static sm:bg-transparent sm:py-0 sm:mx-0 sm:mb-8 flex justify-center">
                <div className="w-full sm:w-auto shadow-sm sm:shadow-none rounded-full">
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
            </div>

            <FadeInUp>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                    
                    {/* Winner Card */}
                    <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-[1.5rem] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#8A6E99]/20 to-transparent rounded-full blur-[80px] -mr-24 -mt-24 opacity-60"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-[#8A6E99]"></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A6E99]">Highest Yield Model</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-tight mb-1">Coliving</h3>
                            <p className="text-gray-500 font-medium text-sm sm:text-base">Consistently outperforms Private model.</p>
                        </div>

                        <div className="mt-8 relative z-10">
                            <motion.span 
                                key={currentFinancials.roi}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl sm:text-7xl font-black text-[#8A6E99] tracking-tighter block"
                            >
                                {SCENARIOS[0].financials[activeCase].roi}<span className="text-2xl sm:text-3xl align-top">%</span>
                            </motion.span>
                            <span className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Return on Investment ({activeCase})</span>
                        </div>
                    </div>

                    {/* Chart Card */}
                    <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-[1.5rem] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between">
                        <div className="flex flex-row justify-between items-start gap-4 mb-2">
                             <div>
                                <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">Financial Projection</h3>
                                <p className="text-[10px] sm:text-xs font-medium text-gray-400 mt-0.5 uppercase tracking-wide">{activeCase} Case</p>
                             </div>
                             <div className="flex gap-3 self-start">
                                 <div className="flex items-center gap-1.5">
                                     <div className="w-2 h-2 rounded-full bg-[#8A6E99]"></div>
                                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Coliving</span>
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                     <div className="w-2 h-2 rounded-full bg-[#2A5B64]"></div>
                                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Private</span>
                                 </div>
                             </div>
                        </div>
                        <div className="flex-1 -mx-2">
                            <ComparisonChart activeCase={activeCase} />
                        </div>
                    </div>

                </div>
            </FadeInUp>
        </Section>

        {/* SECTION 2: INTERACTIVE DEEP DIVE (Dark Mode) */}
        <Section title="Interactive Analysis" className="!mt-12" titleColor="text-[#1D1D1F]">
            
            {/* The Cockpit */}
            <div className="bg-[#000000] text-white rounded-3xl sm:rounded-[2rem] shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                {/* Noise Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                
                {/* Control Bar - Mobile Optimized */}
                <div className="bg-white/5 backdrop-blur-xl border-b border-white/5 p-4 flex flex-col items-center justify-between gap-3 sticky top-0 z-20">
                     {/* Model Selector */}
                     <div className="w-full sm:w-auto">
                        <SegmentedControl 
                            selected={activeScenarioId} 
                            onChange={(val) => setActiveScenarioId(val)}
                            dark={true}
                            options={SCENARIOS.map(s => ({ value: s.id, label: s.name }))}
                        />
                     </div>

                    {/* Sensitivity Selector (Synced) - VISIBLE ON MOBILE NOW */}
                    <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                        <div className="min-w-max">
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
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeScenario.id}-${activeCase}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                        className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10"
                    >
                        {/* LEFT COLUMN: The Engine */}
                        <div className="lg:col-span-7 space-y-6">
                            
                            {/* Hero Revenue */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Projected Annual Revenue</p>
                                <div className="flex items-baseline gap-4">
                                    <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white tabular-nums">
                                        {formatCurrency(currentFinancials.revenue)}
                                    </h2>
                                </div>
                                <div className="inline-flex items-center gap-2 mt-3 px-2 py-1 rounded bg-white/10 border border-white/5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-white/70 tracking-wide uppercase">{activeScenario.occupancyDurationLabel} ({activeCase})</span>
                                </div>
                            </div>

                            {/* Digital Ledger */}
                            <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                                <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
                                    <div className="p-1.5 bg-white/10 rounded-md">
                                        <BanknotesIcon className="w-4 h-4 text-white/90" />
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

                            {/* Unit Mix - Horizontal Scroll on Mobile */}
                            <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                                <h4 className="text-sm font-bold mb-4 text-white/90">Inventory Composition</h4>
                                <div className="space-y-3">
                                    {activeScenario.unitMix.map((unit, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
                                                    {unit.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">{unit.name}</p>
                                                    <p className="text-[9px] text-white/40 uppercase tracking-wider">Avg. {formatCurrency(unit.avgPrice)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-lg font-bold text-white">{unit.count}</span>
                                                <span className="text-[9px] text-white/40 uppercase tracking-wider">{activeScenario.unitLabel}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Context */}
                        <div className="lg:col-span-5 space-y-6">
                            
                            {/* ROI Card (Dark Mode) */}
                            <div className="bg-gradient-to-br from-[#1c1c1e] to-[#000000] p-6 sm:p-8 rounded-2xl sm:rounded-[1.5rem] border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-[60px] group-hover:bg-yellow-500/30 transition-all duration-700"></div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Return on Investment</p>
                                <p className="text-5xl sm:text-6xl font-black text-yellow-400 tracking-tighter tabular-nums">{currentFinancials.roi}%</p>
                                <p className="text-[10px] font-medium text-white/30 mt-3 border-t border-white/5 pt-3">Calculated based on {formatCurrency(activeScenario.propertyValue)} property valuation.</p>
                            </div>

                             {/* Strategy Text */}
                             <div className="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-[1.5rem] border border-white/10">
                                 <h4 className="text-white font-bold text-base sm:text-lg mb-2">Model Strategy</h4>
                                 <p className="text-sm text-white/60 leading-relaxed font-light">
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
