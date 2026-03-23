'use client';

import '@/lib/echarts/register-bar-line-pie';
import '@/lib/echarts/register-scatter';
import '@/lib/echarts/register-gauge';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, ShoppingCart, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

const ChartCard = dynamic(() => import('@/components/ui/ChartCard'), {
    ssr: false,
    loading: () => <div style={{ height: 320 }}>Loading chart...</div>,
});
import { PRIMARY_GREEN, PRIMARY_CYAN, PRIMARY_BLUE, PRIMARY_AMBER, PRIMARY_RED, PRIMARY_PURPLE, PRIMARY_SLATE } from '@/lib/colors';

// ── بيانات الكاشيرات ──
const cashiers = [
    { name: 'محمد سالم المساعيد', short: 'المساعيد', transactions: 47442, sales: 118613, atv: 17.35, voidRate: 0.08, score: 66.25, trend: [60, 72, 68, 85, 80, 95, 88, 102, 98, 110, 112, 119] },
    { name: 'محمد العطامات', short: 'العطامات', transactions: 16954, sales: 42605, atv: 3.80, voidRate: 0.01, score: 65.60, trend: [22, 28, 25, 34, 31, 38, 35, 40, 38, 42, 41, 43] },
    { name: 'حسين الشرفات', short: 'الشرفات', transactions: 26255, sales: 67033, atv: 16.83, voidRate: 0.05, score: 63.44, trend: [28, 36, 33, 44, 40, 52, 48, 58, 54, 62, 64, 67] },
    { name: 'شادي السماعة', short: 'السماعة', transactions: 11955, sales: 25240, atv: 12.22, voidRate: 0.00, score: 62.94, trend: [12, 16, 14, 19, 17, 22, 20, 24, 22, 25, 24, 25] },
    { name: 'عبدالله المناصير', short: 'المناصير', transactions: 22450, sales: 47856, atv: 14.60, voidRate: 0.00, score: 62.94, trend: [22, 28, 26, 34, 31, 38, 35, 42, 40, 46, 46, 48] },
    { name: 'محمد علي', short: 'محمد علي', transactions: 11613, sales: 24374, atv: 14.23, voidRate: 0.00, score: 62.94, trend: [12, 16, 14, 18, 16, 21, 19, 23, 21, 24, 23, 24] },
    { name: 'حسن الشبيب', short: 'الشبيب', transactions: 11570, sales: 29199, atv: 12.22, voidRate: 0.00, score: 62.94, trend: [10, 14, 12, 18, 16, 22, 20, 26, 24, 28, 22, 29] },
    { name: 'أنور غازي', short: 'أنور غازي', transactions: 13190, sales: 34315, atv: 16.49, voidRate: 0.05, score: 51.62, trend: [16, 21, 19, 27, 24, 31, 28, 34, 31, 34, 33, 34] },
    { name: 'حلود نواش', short: 'حلود نواش', transactions: 14290, sales: 37125, atv: 15.44, voidRate: 0.08, score: 42.52, trend: [18, 23, 20, 28, 25, 32, 29, 35, 32, 36, 36, 37] },
];

const totalTrans = cashiers.reduce((a, c) => a + c.transactions, 0);
const totalSales = cashiers.reduce((a, c) => a + c.sales, 0);
const avgAtv = totalSales / totalTrans;
const avgVoidRate = cashiers.reduce((a, c) => a + c.voidRate, 0) / cashiers.length;
const avgScore = cashiers.reduce((a, c) => a + c.score, 0) / cashiers.length;

const fmtN = (n: number) => new Intl.NumberFormat('en-US').format(n);
const fmt2 = (n: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const fmtK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(2)}K` : fmt2(n);

function scoreColor(s: number) {
    if (s >= 63) return PRIMARY_GREEN; // high score
    if (s >= 55) return PRIMARY_AMBER;
    if (s >= 45) return '#f97316';
    return PRIMARY_RED;
}

const maxSales = Math.max(...cashiers.map(c => c.sales));
const maxTrans = Math.max(...cashiers.map(c => c.transactions));
const maxAtv = Math.max(...cashiers.map(c => c.atv));

export default function EmployeesPage() {
    const [sortKey, setSortKey] = useState<'score' | 'sales' | 'transactions'>('score');
    const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

    const sorted = [...cashiers].sort((a, b) => sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);
    const toggleSort = (k: typeof sortKey) => { if (sortKey === k) setSortDir(d => d === 'desc' ? 'asc' : 'desc'); else { setSortKey(k); setSortDir('desc'); } };

    // ── Gauge الأداء الكلي ──
    const gaugeOption = {
        series: [{
            type: 'gauge', startAngle: 200, endAngle: -20,
            min: 0, max: 100, radius: '90%',
            pointer: { show: false },
            progress: {
                show: true,
                roundCap: true,
                width: 16,
                itemStyle: {
                    color: {
                        type: 'linear' as const,
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [
                            { offset: 0, color: PRIMARY_RED },
                            { offset: 0.5, color: PRIMARY_AMBER },
                            { offset: 1, color: PRIMARY_GREEN },
                        ],
                    },
                },
            },
            axisLine: { lineStyle: { width: 16, color: [[1, '#1e293b']] } },
            splitLine: { show: false }, axisTick: { show: false },
            axisLabel: { show: false }, title: { show: false },
            detail: {
                valueAnimation: true, fontSize: 26, fontWeight: 'bold',
                offsetCenter: [0, '15%'], color: scoreColor(avgScore), formatter: '{value}%',
            },
            data: [{ value: +avgScore.toFixed(1) }],
        }],
    };

    // ── ترتيب الكاشيرات (أفقي) ──
    const ranked = [...cashiers].sort((a, b) => b.score - a.score);
    const perfOption = {
        tooltip: {
            trigger: 'item' as const,
            formatter: (p: { name: string; value: number }) =>
                `${p.name}: <b style="color:${PRIMARY_GREEN}">${p.value}%</b>`,
        },
        grid: { left: '26%', right: '14%', top: '3%', bottom: '3%' },
        xAxis: { type: 'value' as const, max: 80, axisLabel: { formatter: '{value}%', fontSize: 9, color: '#64748b' }, splitLine: { lineStyle: { color: '#1e293b' } } },
        yAxis: { type: 'category' as const, data: ranked.map(c => c.short), axisLabel: { fontSize: 10, color: '#94a3b8' }, axisLine: { show: false }, axisTick: { show: false } },
        series: [{
            type: 'bar', barMaxWidth: 20,
            data: ranked.map(c => ({
                name: c.short,
                value: +c.score.toFixed(2),
                itemStyle: {
                    color: { type: 'linear' as const, x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: `${scoreColor(c.score)}33` }, { offset: 1, color: scoreColor(c.score) }] },
                    borderRadius: [0, 6, 6, 0],
                },
                label: { show: true, position: 'right' as const, formatter: `${c.score.toFixed(2)}%`, fontSize: 10, fontWeight: 'bold', color: scoreColor(c.score) },
            })),
        }],
    };

    // ── Scatter: Void Rate vs ATV ──
    const scatterOption = {
        tooltip: {
            trigger: 'item' as const,
            backgroundColor: '#1a2035',
            borderColor: '#1e293b',
            textStyle: { color: '#e2e8f0', fontSize: 11 },
            formatter: (p: { data: [number, number, number, string] }) =>
                `<b style="color:${PRIMARY_GREEN}">${p.data[3]}</b><br/>معدل الإلغاء: ${p.data[0]}%<br/>ATV: ${p.data[1].toFixed(2)}<br/>المعاملات: ${fmtN(p.data[2])}`,
        },
        xAxis: {
            name: 'معدل الإلغاء %',
            type: 'value' as const,
            nameLocation: 'middle' as const,
            nameGap: 32,
            nameTextStyle: { color: PRIMARY_GREEN, fontSize: 9 },
            axisLabel: { formatter: '{value}%', fontSize: 9, color: PRIMARY_GREEN },
            splitLine: { lineStyle: { color: PRIMARY_SLATE } },
        },
        yAxis: {
            name: 'متوسط ATV',
            type: 'value' as const,
            nameLocation: 'middle' as const,
            nameGap: 40,
            nameTextStyle: { color: PRIMARY_GREEN, fontSize: 9 },
            axisLabel: { fontSize: 9, color: PRIMARY_GREEN },
            splitLine: { lineStyle: { color: PRIMARY_SLATE } },
        },
        series: [{
            type: 'scatter',
            symbolSize: (d: number[]) => Math.max(20, Math.sqrt(d[2] / 25)),
            data: cashiers.map(c => [c.voidRate, c.atv, c.transactions, c.short]),
            itemStyle: {
                color: (p: { data: number[] }) => scoreColor(cashiers.find(c => c.transactions === p.data[2])?.score ?? 50),
                opacity: 0.85, borderColor: PRIMARY_SLATE, borderWidth: 1,
            },
            label: { show: false },
            emphasis: {
                label: {
                    show: true,
                    formatter: (p: { data: (number | string)[] }) => String(p.data[3]).split(' ')[0],
                    fontSize: 9,
                    color: PRIMARY_GREEN,
                    position: 'top' as const,
                },
            },
        }],
        grid: { bottom: '18%', top: '14%', left: '16%', right: '6%' },
    };

    // ── اتجاه المبيعات ──
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const trendColors = [
        PRIMARY_GREEN,
        PRIMARY_CYAN,
        PRIMARY_BLUE,
        PRIMARY_PURPLE,
        PRIMARY_AMBER,
        PRIMARY_RED,
        '#0891b2',
        PRIMARY_GREEN,
        '#d97706',
    ];
    const trendOption = {
        tooltip: { trigger: 'axis' as const, backgroundColor: '#1a2035', borderColor: '#1e293b', textStyle: { color: '#e2e8f0', fontSize: 11 } },
        legend: { data: cashiers.map(c => c.short), bottom: 0, textStyle: { color: PRIMARY_GREEN, fontSize: 8 }, type: 'scroll' as const, pageIconColor: PRIMARY_GREEN, pageTextStyle: { color: PRIMARY_GREEN } },
        grid: { bottom: '22%', top: '5%', left: '2%', right: '2%', containLabel: true },
        xAxis: { type: 'category' as const, data: months, axisLabel: { fontSize: 9, color: PRIMARY_GREEN, rotate: 30 }, axisLine: { lineStyle: { color: PRIMARY_SLATE } }, splitLine: { show: false } },
        yAxis: { type: 'value' as const, axisLabel: { formatter: (v: number) => fmtK(v), fontSize: 9, color: '#64748b' }, splitLine: { lineStyle: { color: '#1e293b' } } },
        series: cashiers.map((c, i) => ({
            name: c.short,
            type: 'line' as const,
            smooth: true, showSymbol: false,
            data: c.trend,
            lineStyle: { color: trendColors[i % trendColors.length], width: 1.5 },
            itemStyle: { color: trendColors[i % trendColors.length] },
        })),
    };

    const SortBtn = ({ k, label }: { k: typeof sortKey; label: string }) => {
        const active = sortKey === k;
        return (
            <button
                type="button"
                onClick={() => toggleSort(k)}
                className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                style={{
                    background: active ? PRIMARY_GREEN : 'var(--bg-elevated)',
                    color: active ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid',
                    borderColor: active ? PRIMARY_GREEN : 'var(--border-subtle)',
                }}
            >
                {label}
                {active ? (sortDir === 'desc' ? <ChevronDown size={11} /> : <ChevronUp size={11} />) : <ChevronDown size={11} style={{ opacity: 0.3 }} />}
            </button>
        );
    };

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-1">
                    <Users size={22} style={{ color: 'var(--text-primary)' }} />
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Cashier Insights Dashboard</h1>
                    <div className="flex items-center gap-1.5 mr-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: PRIMARY_GREEN }} />
                        <span className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>بيانات مباشرة</span>
                    </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-primary)' }}>تحليل أداء الكاشيرات — مبيعات، معاملات، نسبة الإلغاء، ودرجة الأداء الكلي</p>
            </motion.div>

            {/* ── KPIs ── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {([
                    { icon: DollarSign, label: 'صافي المبيعات', sub: 'Net Sales', value: fmtK(totalSales), color: 'var(--accent-green)', dimColor: 'var(--accent-green-dim)' },
                    { icon: ShoppingCart, label: 'المعاملات الكلية', sub: 'Total Transactions', value: fmtN(totalTrans), color: 'var(--accent-cyan)', dimColor: 'var(--accent-cyan-dim)' },
                    { icon: Users, label: 'متوسط قيمة المعاملة', sub: 'Avg Transaction Value', value: fmt2(avgAtv), color: 'var(--accent-amber)', dimColor: 'rgba(245,158,11,0.1)' },
                    { icon: AlertCircle, label: 'معدل الإلغاء', sub: 'Void Transaction Rate', value: `${avgVoidRate.toFixed(2)}%`, color: 'var(--accent-red)', dimColor: 'rgba(239,68,68,0.1)' },
                ] as const).map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="glass-panel p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-2xl"
                            style={{ background: s.color, transform: 'translate(30%, -30%)' }} />
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                            <div className="p-1.5 rounded-lg" style={{ background: s.dimColor }}>
                                <s.icon size={13} style={{ color: s.color }} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold" style={{ color: s.color }} dir="ltr">{s.value}</p>
                        <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>{s.sub}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── Row 2: اتجاه المبيعات + Gauge + أفضل 3 ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                    <ChartCard title="اتجاه مبيعات الكاشيرات" subtitle="Sales trend per cashier — 12 months" option={trendOption} height="340px" delay={1} />
                </div>

                <div className="glass-panel overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>متوسط الأداء الكلي</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Overall Cashier Performance Score</p>
                    </div>
                    <div style={{ height: 170, flexShrink: 0 }}>
                        <ChartCard title="" option={gaugeOption} height="170px" />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[9px] py-1.5" style={{ color: 'var(--text-muted)' }}>
                        {[{ l: 'ضعيف', c: PRIMARY_RED }, { l: 'متوسط', c: '#f97316' }, { l: 'جيد', c: PRIMARY_AMBER }, { l: 'ممتاز', c: PRIMARY_GREEN }].map(x => (
                            <div key={x.l} className="flex items-center gap-0.5">
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: x.c }} />
                                <span>{x.l}</span>
                            </div>
                        ))}
                    </div>
                    <div className="px-4 py-3 space-y-2.5 flex-1 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>🏆 أفضل 3 كاشيرات</p>
                        {ranked.slice(0, 3).map((c, i) => (
                            <div key={c.name} className="flex items-center gap-2">
                                <span style={{ fontSize: 10, fontWeight: 800, width: 16, color: ['#f59e0b', '#94a3b8', '#cd7c2f'][i] }}>{i + 1}</span>
                                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                                    <div style={{ width: `${(c.score / 70) * 100}%`, height: '100%', background: scoreColor(c.score), borderRadius: 9999 }} />
                                </div>
                                <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{c.short}</span>
                                <span className="text-[10px] font-bold" style={{ color: scoreColor(c.score) }} dir="ltr">{c.score}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Row 3: Scatter + Perf Bars ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <ChartCard title="نسبة الإلغاء مقابل متوسط قيمة المعاملة" subtitle="Void Rate vs ATV — حجم الفقاعة = عدد المعاملات" option={scatterOption} height="300px" delay={1} />
                <ChartCard title="ترتيب الكاشيرات حسب درجة الأداء" subtitle="Overall Performance Score Ranking" option={perfOption} height="300px" delay={2} />
            </div>

            {/* ── Table ── */}
            <div className="glass-panel overflow-hidden">
                <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div>
                        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>تفاصيل أداء الكاشيرات</h3>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Cashier Performance Details</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>ترتيب حسب:</span>
                        <SortBtn k="score" label="الأداء" />
                        <SortBtn k="sales" label="المبيعات" />
                        <SortBtn k="transactions" label="المعاملات" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                                {['#', 'الكاشير', 'درجة الأداء', 'إجمالي المبيعات', 'عدد المعاملات', 'متوسط ATV', 'معدل الإلغاء'].map((h, i) => (
                                    <th key={i} style={{ padding: '9px 12px', textAlign: i <= 1 ? 'right' : 'center', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((c, i) => {
                                const rank = ranked.findIndex(x => x.name === c.name) + 1;
                                const medalColor = rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : rank === 3 ? '#cd7c2f' : 'var(--text-muted)';
                                return (
                                    <motion.tr key={c.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                        className="hover:bg-white/[0.015] transition-colors"
                                        style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '9px 12px', width: 32 }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: medalColor }} dir="ltr">{rank}</span>
                                        </td>
                                        <td style={{ padding: '9px 12px', whiteSpace: 'nowrap' }}>
                                            <div className="flex items-center gap-2">
                                                <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${scoreColor(c.score)}15`, border: `1.5px solid ${scoreColor(c.score)}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: scoreColor(c.score), flexShrink: 0 }}>
                                                    {c.name.charAt(0)}
                                                </div>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</span>
                                            </div>
                                        </td>
                                        {/* الأداء */}
                                        <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                                            <div className="flex items-center gap-2 justify-center">
                                                <div style={{ width: 60, height: 5, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                                                    <div style={{ width: `${(c.score / 70) * 100}%`, height: '100%', background: scoreColor(c.score), borderRadius: 3 }} />
                                                </div>
                                                <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor(c.score), minWidth: 42 }} dir="ltr">{c.score.toFixed(2)}%</span>
                                            </div>
                                        </td>
                                        {/* المبيعات */}
                                        <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                                            <div className="flex items-center gap-2 justify-center">
                                                <div style={{ width: 52, height: 5, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                                                    <div style={{ width: `${(c.sales / maxSales) * 100}%`, height: '100%', background: 'var(--accent-green)', borderRadius: 3 }} />
                                                </div>
                                                <span style={{ fontSize: 11, color: 'var(--accent-green)', minWidth: 48 }} dir="ltr">{fmtN(c.sales)}</span>
                                            </div>
                                        </td>
                                        {/* المعاملات */}
                                        <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                                            <div className="flex items-center gap-2 justify-center">
                                                <div style={{ width: 52, height: 5, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                                                    <div style={{ width: `${(c.transactions / maxTrans) * 100}%`, height: '100%', background: 'var(--accent-cyan)', borderRadius: 3 }} />
                                                </div>
                                                <span style={{ fontSize: 11, color: 'var(--accent-cyan)', minWidth: 44 }} dir="ltr">{fmtN(c.transactions)}</span>
                                            </div>
                                        </td>
                                        {/* ATV */}
                                        <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                                            <div className="flex items-center gap-2 justify-center">
                                                <div style={{ width: 44, height: 5, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                                                    <div style={{ width: `${(c.atv / maxAtv) * 100}%`, height: '100%', background: 'var(--accent-amber)', borderRadius: 3 }} />
                                                </div>
                                                <span style={{ fontSize: 11, color: 'var(--accent-amber)', minWidth: 32 }} dir="ltr">{c.atv.toFixed(2)}</span>
                                            </div>
                                        </td>
                                        {/* الإلغاء */}
                                        <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                                            <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: c.voidRate === 0 ? 'rgba(100,116,139,0.12)' : c.voidRate <= 0.05 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)', color: c.voidRate === 0 ? 'var(--text-muted)' : c.voidRate <= 0.05 ? 'var(--accent-amber)' : 'var(--accent-red)' }} dir="ltr">
                                                {c.voidRate.toFixed(2)}%
                                            </span>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr style={{ background: 'var(--accent-green-dim)', borderTop: `2px solid rgba(0,229,160,0.2)` }}>
                                <td colSpan={2} style={{ padding: '9px 12px', fontSize: 11, fontWeight: 700, color: 'var(--accent-green)' }}>الإجمالي الكلي</td>
                                <td style={{ padding: '9px 12px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: scoreColor(avgScore) }} dir="ltr">{avgScore.toFixed(2)}%</td>
                                <td style={{ padding: '9px 12px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--accent-green)' }} dir="ltr">{fmtN(totalSales)}</td>
                                <td style={{ padding: '9px 12px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)' }} dir="ltr">{fmtN(totalTrans)}</td>
                                <td style={{ padding: '9px 12px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--accent-amber)' }} dir="ltr">{fmt2(avgAtv)}</td>
                                <td style={{ padding: '9px 12px', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--accent-red)' }} dir="ltr">{avgVoidRate.toFixed(2)}%</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
