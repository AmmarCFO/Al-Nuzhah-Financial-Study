
import React, { useState } from 'react';
import { SCENARIOS } from './constants';
import Header_ar from './components/Header_ar';
import { Section } from './components/DashboardComponents';
import { FadeInUp } from './components/AnimatedWrappers';
import { motion, AnimatePresence } from 'framer-motion';
import { BanknotesIcon } from './components/Icons';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';

const formatCurrency = (value: number) => {
    return `${value.toLocaleString('ar-SA')} ريال`;
};

type CaseType = 'worst' | 'base' | 'best';

// --- Apple-Style Segmented Control with Variants (RTL) ---
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
        <div className={`p-1 sm:p-1.5 rounded-full flex relative flex-row-reverse w-full sm:w-auto overflow-hidden ${containerClass}`}>
            {options.map((option) => {
                const isActive = selected === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`relative z-10 flex-1 px-3 sm:px-6 py-2.5 sm:py-2 text-[13px] sm:text-sm font-bold transition-colors duration-200 rounded-full font-cairo whitespace-nowrap ${
                            isActive ? activeTextClass : inactiveTextClass
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId={variant === 'black' ? "activeSegmentBlackAr" : (dark ? "activeSegmentDarkAr" : "activeSegmentLightAr")}
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
            <div className="flex justify-between items-end border-b border-white/10 pb-3 flex-row-reverse">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5 block">إجمالي التدفقات</span>
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-tight tabular-nums">{formatCurrency(revenue)}</span>
                </div>
                <div className="text-left">
                    <span className="text-[10px] font-medium text-white/40 bg-white/5 px-1.5 py-0.5 rounded">الإيرادات الإجمالية</span>
                </div>
            </div>
            <div className="space-y-3">
                {items.map((item, idx) => {
                    const percent = revenue > 0 ? Math.round((item.amount / revenue) * 100) : 0;
                    return (
                        <div key={idx} className="group">
                            <div className="flex justify-between items-center mb-1.5 flex-row-reverse">
                                <div className="flex items-center gap-2 flex-row-reverse">
                                    <div className={`w-2 h-2 rounded-full ring-1 ring-white/10 ${item.color || 'bg-white'}`}></div>
                                    <span className="text-xs font-medium text-white/90 tracking-wide">{item.category}</span>
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm font-bold text-white tabular-nums">{formatCurrency(item.amount)}</span>
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm dir-rtl">
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
        { name: 'الإيرادات', Coliving: SCENARIOS[0].financials[activeCase].revenue, Private: SCENARIOS[1].financials[activeCase].revenue },
        { name: 'صافي الدخل', Coliving: SCENARIOS[0].financials[activeCase].netIncome, Private: SCENARIOS[1].financials[activeCase].netIncome },
    ];

    return (
        <div className="h-56 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barGap={16} margin={{ top: 10 }}>
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 700, fontFamily: 'Cairo' }} 
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
                            fontFamily: 'Cairo',
                            direction: 'rtl',
                            textAlign: 'right'
                        }}
                        formatter={(value: number) => [formatCurrency(value), '']}
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

const App_ar: React.FC<{ onToggleLanguage: () => void }> = ({ onToggleLanguage }) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [activeCase, setActiveCase] = useState<CaseType>('base');

  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];
  const currentFinancials = activeScenario.financials[activeCase];

  const translateScenarioName = (id: string) => id === 'coliving' ? 'سكن مشترك' : 'سكن مستقل';
  const translateScenarioDesc = (id: string) => id === 'coliving' 
    ? 'نموذج عالي العائد يحول الوحدات إلى ٦٨ غرفة فردية مع مرافق مشتركة، مما يعظم العائد لكل متر مربع.' 
    : 'نموذج سكني تقليدي يؤجر ٢٨ شقة خاصة، يوفر الاستقرار ويقلل التعقيد التشغيلي.';
  
  const translateUnitLabel = (id: string) => id === 'coliving' ? 'غرفة' : 'شقة';
  const translateDuration = (label: string) => label === '10 Months Occupancy' ? 'إشغال لمدة ١٠ شهور' : label;

  const caseLabels: { value: CaseType; label: string }[] = [
      { value: 'worst', label: 'متحفظ' },
      { value: 'base', label: 'واقعي' },
      { value: 'best', label: 'متفائل' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-cairo overflow-x-hidden selection:bg-[#4A2C5A] selection:text-white">
      <Header_ar onToggleLanguage={onToggleLanguage} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        
        <FadeInUp>
          <div className="text-center py-10 sm:py-16">
             <div className="inline-block mb-4 sm:mb-6 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white border border-gray-200 shadow-sm">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-gray-500">دراسة جدوى استراتيجية</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black text-[#1D1D1F] tracking-tighter mb-4 sm:mb-6 leading-[0.9]">
              مشروع النزهة<span className="text-[#4A2C5A]">.</span>
            </h1>
            <p className="text-lg sm:text-2xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight px-4">
                تقييم الاستخدام الأمثل والأفضل: <span className="text-[#4A2C5A]">سكن مشترك للسيدات</span> مقابل <span className="text-[#4A2C5A]">سكن مستقل</span>.
            </p>
          </div>
        </FadeInUp>

        <Section title="النتيجة النهائية" className="!mt-0" titleColor="text-[#1D1D1F]">
            
            {/* Global Case Toggle - BLACK VARIANT */}
            <div className="flex justify-center mb-10 overflow-x-auto px-4">
                <SegmentedControl 
                    variant="black"
                    selected={activeCase} 
                    onChange={(val) => setActiveCase(val)}
                    options={caseLabels}
                />
            </div>

            <FadeInUp>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 text-right">
                    
                     {/* Winner Card */}
                     <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-[1.5rem] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-shadow duration-500">
                        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-[#8A6E99]/20 to-transparent rounded-full blur-[100px] -ml-32 -mt-32 opacity-60"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-end gap-2.5 mb-2 sm:mb-4">
                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#8A6E99]">أعلى عائد</span>
                                <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#8A6E99]"></span>
                            </div>
                            <h3 className="text-3xl sm:text-5xl font-bold text-[#1D1D1F] tracking-tight mb-1 sm:mb-2">السكن المشترك</h3>
                            <p className="text-gray-500 font-medium text-base sm:text-lg">يتفوق على السكن المستقل</p>
                        </div>

                        <div className="mt-8 relative z-10">
                            <motion.span 
                                key={currentFinancials.roi}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl sm:text-7xl font-black text-[#8A6E99] tracking-tighter block"
                                dir="ltr"
                            >
                                {SCENARIOS[0].financials[activeCase].roi}%
                            </motion.span>
                            <span className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">العائد على الاستثمار ({activeCase})</span>
                        </div>
                    </div>

                    {/* Chart & Secondary Stats */}
                    <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-[1.5rem] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between">
                        <div className="flex flex-col sm:flex-row-reverse justify-between items-start sm:items-start gap-4 mb-4 sm:mb-8">
                             <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight">التوقعات المالية</h3>
                                <p className="text-xs sm:text-sm font-medium text-gray-400 mt-1 uppercase tracking-wide">سيناريو {activeCase}</p>
                             </div>
                             <div className="flex gap-4 sm:gap-6 self-start">
                                 <div className="flex items-center gap-1.5 sm:gap-2 flex-row-reverse">
                                     <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#8A6E99]"></div>
                                     <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">مشترك</span>
                                 </div>
                                 <div className="flex items-center gap-1.5 sm:gap-2 flex-row-reverse">
                                     <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#2A5B64]"></div>
                                     <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">مستقل</span>
                                 </div>
                             </div>
                        </div>
                        <div className="flex-1 -mx-2 sm:mx-0">
                            <ComparisonChart activeCase={activeCase} />
                        </div>
                    </div>

                </div>
            </FadeInUp>
        </Section>

        {/* Section 2: Interactive Deep Dive */}
        <Section title="تحليل تفاعلي" className="!mt-12" titleColor="text-[#1D1D1F]">
            
            <div className="bg-[#000000] text-white rounded-3xl sm:rounded-[2rem] shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                
                <div className="bg-white/5 backdrop-blur-xl border-b border-white/5 p-4 sm:p-6 flex flex-col items-center justify-between gap-4 sticky top-0 z-20">
                     <div className="w-full sm:w-auto">
                        <SegmentedControl 
                            selected={activeScenarioId} 
                            onChange={(val) => setActiveScenarioId(val)}
                            dark={true}
                            options={SCENARIOS.map(s => ({ value: s.id, label: translateScenarioName(s.id) }))}
                        />
                     </div>

                    <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
                        <div className="min-w-max">
                            <SegmentedControl 
                                selected={activeCase} 
                                onChange={(val) => setActiveCase(val)}
                                dark={true}
                                options={caseLabels}
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
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 text-right"
                    >
                        {/* RIGHT COLUMN (Financials - RTL) */}
                        <div className="lg:col-span-7 space-y-6 lg:order-2">
                            
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">الإيرادات السنوية المتوقعة</p>
                                <div className="flex items-baseline justify-end gap-4 sm:gap-6">
                                    <h2 className="text-5xl sm:text-7xl font-black tracking-tighter text-white tabular-nums">
                                        {formatCurrency(currentFinancials.revenue)}
                                    </h2>
                                </div>
                                <div className="inline-flex items-center justify-end gap-2 mt-4 px-2 py-1 rounded bg-white/10 border border-white/5">
                                    <span className="text-[10px] font-bold text-white/70 tracking-wide uppercase">{translateDuration(activeScenario.occupancyDurationLabel)} ({activeCase})</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                                <h4 className="text-base sm:text-lg font-bold mb-6 sm:mb-8 flex items-center justify-end gap-3 text-white">
                                    التحليل المالي
                                    <div className="p-1.5 bg-white/10 rounded-lg">
                                        <BanknotesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
                                    </div>
                                </h4>
                                <DigitalLedger 
                                    revenue={currentFinancials.revenue} 
                                    items={[
                                        { category: 'حصة مثوى (٢٠٪)', amount: currentFinancials.mathwaaShare, color: 'bg-purple-400' },
                                        { category: 'صافي الدخل (المالك)', amount: currentFinancials.netIncome, color: 'bg-emerald-400' }
                                    ]} 
                                />
                            </div>

                            <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10">
                                <h4 className="text-base sm:text-lg font-bold mb-6 text-white/90">تكوين المخزون</h4>
                                <div className="space-y-3">
                                    {activeScenario.unitMix.map((unit, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 flex-row-reverse">
                                            <div className="flex items-center gap-3 flex-row-reverse">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
                                                    {unit.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">{unit.name}</p>
                                                    <p className="text-[9px] text-white/40 uppercase tracking-wider">متوسط {formatCurrency(unit.avgPrice)}</p>
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <span className="block text-lg font-bold text-white">{unit.count}</span>
                                                <span className="text-[9px] text-white/40 uppercase tracking-wider">{translateUnitLabel(activeScenario.id)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* LEFT COLUMN (Context - RTL) */}
                        <div className="lg:col-span-5 space-y-6 lg:order-1">
                            
                            <div className="bg-gradient-to-bl from-[#1c1c1e] to-[#000000] p-6 sm:p-8 rounded-2xl sm:rounded-[1.5rem] border border-white/10 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-yellow-500/20 rounded-full blur-[60px] sm:blur-[80px] group-hover:bg-yellow-500/30 transition-all duration-700"></div>
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/40 mb-2">العائد على الاستثمار</p>
                                <p className="text-5xl sm:text-7xl font-black text-yellow-400 tracking-tighter tabular-nums" dir="ltr">{currentFinancials.roi}%</p>
                                <p className="text-xs sm:text-sm font-medium text-white/30 mt-4 border-t border-white/5 pt-4">محسوبة بناءً على تقييم ٢٠ مليون</p>
                            </div>

                             <div className="bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-[1.5rem] border border-white/10">
                                 <h4 className="text-white font-bold text-base sm:text-lg mb-2">الاستراتيجية</h4>
                                 <p className="text-sm text-white/60 leading-relaxed font-light">
                                     {translateScenarioDesc(activeScenario.id)}
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

export default App_ar;
