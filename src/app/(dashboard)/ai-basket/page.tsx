'use client';

import '@/lib/echarts/register-bar-line-pie';
import '@/lib/echarts/register-graph';
import dynamic from 'next/dynamic';
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBasket, Link2, Zap, TrendingUp, Hash } from 'lucide-react';

const ChartCard = dynamic(() => import('@/components/ui/ChartCard'), {
    ssr: false,
    loading: () => <div style={{ height: 320 }}>Loading chart...</div>,
});
import AIBadge from '@/components/ui/AIBadge';
import { useResolvedAnalyticsPalette } from '@/hooks/useResolvedAnalyticsPalette';

// ── أسماء المنتجات ──
const products = [
    'أرز عنبر', 'جبنة كرافت', 'حليب طازج', 'زيت نباتي', 'سكر أبيض',
    'شاي ليبتون', 'عصير', 'خبز أبيض', 'بيض بلدي', 'تونة',
    'دجاج طازج', 'شامبو', 'معجون أسنان', 'مناديل', 'صابون',
    'مكرونة', 'طحينة', 'لبنة', 'زبدة', 'كاتشب',
];
const colors = [
    '#e11d48', '#dc2626', '#f59e0b', '#3b82f6', '#8b5cf6',
    '#06b6d4', '#10b981', '#f97316', '#22c55e', '#14b8a6',
    '#2563eb', '#6366f1', '#ec4899', '#0ea5e9', '#84cc16',
    '#a855f7', '#ef4444', '#d97706', '#0891b2', '#7c3aed',
];

// ── بيانات جدول قواعد الارتباط ──
const rules = [
    { basket: 'جبنة → عصير', support: 0.371, confA: 22.65, confB: 22.79, lift: 8.88 },
    { basket: 'حليب → عصير', support: 0.335, confA: 18.35, confB: 19.30, lift: 2.29 },
    { basket: 'جبنة → حليب', support: 0.312, confA: 15.42, confB: 16.80, lift: 2.11 },
    { basket: 'عصير → شامبو', support: 0.228, confA: 8.62, confB: 8.37, lift: 1.88 },
    { basket: 'أرز → زيت نباتي', support: 0.222, confA: 6.54, confB: 6.36, lift: 1.88 },
    { basket: 'سكر → عصير', support: 0.225, confA: 6.55, confB: 6.55, lift: 1.87 },
    { basket: 'خبز → حليب', support: 0.223, confA: 6.34, confB: 6.57, lift: 1.87 },
    { basket: 'عصير → بيض', support: 0.217, confA: 6.39, confB: 6.30, lift: 1.86 },
    { basket: 'أرز → دجاج', support: 0.221, confA: 6.30, confB: 6.53, lift: 1.86 },
    { basket: 'تونة → أرز', support: 0.219, confA: 6.20, confB: 6.48, lift: 1.85 },
    { basket: 'مكرونة → كاتشب', support: 0.221, confA: 6.22, confB: 6.52, lift: 1.85 },
    { basket: 'طحينة → لبنة', support: 0.221, confA: 8.24, confB: 6.52, lift: 1.84 },
    { basket: 'زبدة → خبز', support: 0.220, confA: 6.48, confB: 6.23, lift: 1.84 },
    { basket: 'صابون → شامبو', support: 0.218, confA: 6.22, confB: 6.48, lift: 1.83 },
];

export default function AIBasketPage() {
    const palette = useResolvedAnalyticsPalette();
    // ── شبكة ارتباط المنتجات (الرئيسية) ──
    const networkOption = {
        tooltip: {
            trigger: 'item' as const,
            formatter: (p: any) => {
                if (p.dataType === 'edge') return `${p.data.source} ↔ ${p.data.target}<br/>قوة: ${p.data.value}%`;
                return `<b>${p.name}</b>`;
            },
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut' as const,
        series: [{
            type: 'graph' as const,
            layout: 'force' as const,
            roam: true,
            draggable: true,
            label: { show: true, fontSize: 9, color: 'var(--text-primary)' },
            edgeLabel: { show: false },
            lineStyle: { color: '#94a3b8', curveness: 0.2, width: 1, opacity: 0.6 },
            emphasis: { focus: 'adjacency' as const, lineStyle: { width: 4, opacity: 1 } },
            force: { repulsion: 260, edgeLength: [80, 200], gravity: 0.08, friction: 0.6 },
            data: [
                { name: 'سلة', symbolSize: 65, itemStyle: { color: '#1e293b' }, label: { fontSize: 13, fontWeight: 'bold' } },
                ...products.map((p, i) => ({
                    name: p,
                    symbolSize: 16 + Math.floor(Math.random() * 20),
                    itemStyle: { color: colors[i] },
                })),
            ],
            links: [
                ...products.map(p => ({ source: 'سلة', target: p, value: 30 + Math.floor(Math.random() * 60), lineStyle: { width: 0.8, opacity: 0.4 } })),
                { source: 'جبنة كرافت', target: 'عصير', value: 85, lineStyle: { width: 2.5, opacity: 0.9 } },
                { source: 'حليب طازج', target: 'عصير', value: 80, lineStyle: { width: 2, opacity: 0.8 } },
                { source: 'أرز عنبر', target: 'زيت نباتي', value: 82, lineStyle: { width: 2.5, opacity: 0.9 } },
                { source: 'أرز عنبر', target: 'سكر أبيض', value: 72, lineStyle: { width: 2, opacity: 0.8 } },
                { source: 'أرز عنبر', target: 'دجاج طازج', value: 68, lineStyle: { width: 1.8, opacity: 0.7 } },
                { source: 'حليب طازج', target: 'خبز أبيض', value: 78, lineStyle: { width: 2, opacity: 0.8 } },
                { source: 'حليب طازج', target: 'بيض بلدي', value: 70, lineStyle: { width: 1.8, opacity: 0.7 } },
                { source: 'خبز أبيض', target: 'بيض بلدي', value: 60, lineStyle: { width: 1.5, opacity: 0.6 } },
                { source: 'دجاج طازج', target: 'أرز عنبر', value: 75, lineStyle: { width: 2, opacity: 0.8 } },
                { source: 'زيت نباتي', target: 'تونة', value: 42, lineStyle: { width: 1.2, opacity: 0.5 } },
                { source: 'شامبو', target: 'صابون', value: 65, lineStyle: { width: 1.8, opacity: 0.7 } },
                { source: 'شامبو', target: 'معجون أسنان', value: 58, lineStyle: { width: 1.5, opacity: 0.6 } },
                { source: 'مكرونة', target: 'كاتشب', value: 55, lineStyle: { width: 1.4, opacity: 0.6 } },
                { source: 'طحينة', target: 'لبنة', value: 62, lineStyle: { width: 1.6, opacity: 0.7 } },
                { source: 'زبدة', target: 'خبز أبيض', value: 50, lineStyle: { width: 1.3, opacity: 0.5 } },
                { source: 'جبنة كرافت', target: 'لبنة', value: 48, lineStyle: { width: 1.2, opacity: 0.5 } },
            ],
        }],
    };

    // ── الدعم والرفع حسب السلة (Scatter) ──
    const scatterColors = ['#ef4444', '#f97316', '#f59e0b', '#3b82f6', '#a855f7', '#06b6d4', '#10b981', '#ec4899', '#14b8a6', '#8b5cf6'];
    const scatterOption = {
        tooltip: {
            trigger: 'item' as const,
            formatter: (p: any) => `<b>${p.seriesName}</b><br/>الدعم: ${p.value[0].toFixed(2)}%<br/>الرفع: ${p.value[1].toFixed(2)}`,
        },
        legend: {
            data: rules.slice(0, 8).map(r => r.basket),
            top: 4, left: 'center', textStyle: { fontSize: 7 }, itemWidth: 8, itemHeight: 8, itemGap: 4,
        },
        grid: { left: '12%', right: '6%', top: '22%', bottom: '14%' },
        xAxis: {
            type: 'value' as const, name: 'الدعم (Support)', nameLocation: 'middle' as const, nameGap: 28,
            nameTextStyle: { fontSize: 10, fontWeight: 'bold' as const },
            axisLabel: { fontSize: 9 },
            splitLine: { lineStyle: { type: 'dashed' as const, color: 'var(--border-subtle)' } },
        },
        yAxis: {
            type: 'value' as const, name: 'الرفع (Lift)', nameLocation: 'middle' as const, nameGap: 34,
            nameTextStyle: { fontSize: 10, fontWeight: 'bold' as const },
            axisLabel: { fontSize: 9 },
            splitLine: { lineStyle: { type: 'dashed' as const, color: 'var(--border-subtle)' } },
        },
        series: rules.slice(0, 8).map((r, i) => ({
            name: r.basket,
            type: 'scatter' as const,
            data: [[r.support * 100, r.lift]],
            symbolSize: 16 + r.lift * 3,
            itemStyle: { color: scatterColors[i], opacity: 0.85 },
        })),
    };

    // ── شبكة ارتباط ثانية (أصغر) ──
    const network2Option = {
        tooltip: { trigger: 'item' as const },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut' as const,
        series: [{
            type: 'graph' as const,
            layout: 'force' as const,
            roam: true,
            draggable: true,
            label: { show: true, fontSize: 8 },
            lineStyle: { color: '#64748b', curveness: 0.15, width: 0.8, opacity: 0.5 },
            emphasis: { focus: 'adjacency' as const },
            force: { repulsion: 140, edgeLength: [50, 150], gravity: 0.1, friction: 0.6 },
            data: [
                { name: 'حليب', symbolSize: 24, itemStyle: { color: '#3b82f6' } },
                { name: 'خبز', symbolSize: 22, itemStyle: { color: '#10b981' } },
                { name: 'شامبو', symbolSize: 18, itemStyle: { color: '#ef4444' } },
                { name: 'دجاج', symbolSize: 20, itemStyle: { color: '#f97316' } },
                { name: 'زيت', symbolSize: 19, itemStyle: { color: '#8b5cf6' } },
                { name: 'أرز', symbolSize: 23, itemStyle: { color: '#06b6d4' } },
                { name: 'بيض', symbolSize: 17, itemStyle: { color: palette.primaryGreen } },
                { name: 'صابون', symbolSize: 15, itemStyle: { color: '#ec4899' } },
                { name: 'تونة', symbolSize: 16, itemStyle: { color: '#a855f7' } },
                { name: 'سكر', symbolSize: 14, itemStyle: { color: '#14b8a6' } },
                { name: 'مكرونة', symbolSize: 16, itemStyle: { color: '#f59e0b' } },
                { name: 'معجون', symbolSize: 14, itemStyle: { color: '#dc2626' } },
                { name: 'مناديل', symbolSize: 13, itemStyle: { color: '#6366f1' } },
                { name: 'طحينة', symbolSize: 17, itemStyle: { color: '#84cc16' } },
                { name: 'كاتشب', symbolSize: 15, itemStyle: { color: '#0ea5e9' } },
            ],
            links: [
                { source: 'حليب', target: 'خبز' }, { source: 'حليب', target: 'بيض' },
                { source: 'خبز', target: 'زيت' }, { source: 'شامبو', target: 'صابون' },
                { source: 'أرز', target: 'زيت' }, { source: 'أرز', target: 'دجاج' },
                { source: 'دجاج', target: 'أرز' }, { source: 'سكر', target: 'شامبو' },
                { source: 'مكرونة', target: 'كاتشب' }, { source: 'تونة', target: 'أرز' },
                { source: 'طحينة', target: 'خبز' }, { source: 'بيض', target: 'خبز' },
                { source: 'معجون', target: 'شامبو' }, { source: 'مناديل', target: 'صابون' },
            ],
        }],
    };

    const kpis = [
        { icon: Link2, label: 'ارتباطات مكتشفة', value: '1,247', color: 'var(--accent-green)' },
        { icon: TrendingUp, label: 'أعلى رفع (Lift)', value: '8.88', color: 'var(--accent-cyan)' },
        { icon: Hash, label: 'قواعد ارتباط', value: '342', color: 'var(--accent-blue)' },
        { icon: Zap, label: 'رفع البيع المتقاطع', value: '+18.2%', color: 'var(--accent-amber)' },
    ];

    const maxSupport = Math.max(...rules.map(r => r.support));
    const maxLift = Math.max(...rules.map(r => r.lift));

    return (
        <div className="space-y-6">
            {/* الرأس */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 rounded-lg" style={{ background: 'var(--accent-cyan-dim)', border: '1px solid rgba(8,145,178,0.2)' }}>
                            <ShoppingBasket size={20} style={{ color: 'var(--accent-cyan)' }} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>تحليل سلة السوق</h1>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>شبكة ارتباط المنتجات وقواعد الترابط — Market Basket Analysis</p>
                        </div>
                    </div>
                </div>
                <AIBadge label="Apriori + FP-Growth" size="md" confidence={91} />
            </motion.div>

            {/* مؤشرات */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {kpis.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-panel ai-module p-4">
                        <div className="flex items-center gap-2 mb-2"><s.icon size={14} style={{ color: s.color }} /><span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{s.label}</span></div>
                        <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* الشبكة + السكاتر */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <ChartCard title="شبكة ارتباط المنتجات" subtitle="Basket Analysis Network" option={networkOption} height="420px" aiPowered delay={1} />
                <ChartCard title="الدعم والرفع حسب السلة" subtitle="Support Basket and Lift by Basket" option={scatterOption} height="420px" aiPowered delay={2} />
            </div>

            {/* الشبكة الثانية + جدول القواعد */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <ChartCard title="شبكة تحليل السلة" subtitle="Basket Analysis Network" option={network2Option} height="400px" aiPowered delay={3} />

                {/* جدول قواعد الارتباط */}
                <div className="glass-panel ai-module overflow-hidden">
                    <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>قواعد الارتباط</h3>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>الدعم، الثقة، الرفع — Association Rules</p>
                    </div>
                    <div className="overflow-x-auto" style={{ maxHeight: 360, overflowY: 'auto' }}>
                        <table dir="rtl" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', position: 'sticky' as const, top: 0, zIndex: 2 }}>
                                    {['السلة', 'الدعم', 'ثقة المنتج الأول', 'ثقة المنتج الثاني', 'الرفع'].map((h, i) => (
                                        <th key={i} style={{ padding: '8px 10px', textAlign: i === 0 ? 'right' : 'center', fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap', background: 'var(--bg-elevated)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rules.map((rule) => (
                                    <tr key={rule.basket} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                        <td style={{ padding: '6px 10px', fontSize: 10, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{rule.basket}</td>
                                        <td style={{ padding: '6px 10px', textAlign: 'center', position: 'relative' as const }}>
                                            <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', width: `${(rule.support / maxSupport) * 80}%`, height: 14, background: '#3b82f6', opacity: 0.25, borderRadius: 2 }} />
                                            <span style={{ position: 'relative', fontSize: 9.5, fontWeight: 600, color: 'var(--text-secondary)' }} dir="ltr">{(rule.support * 100).toFixed(2)}%</span>
                                        </td>
                                        <td style={{ padding: '6px 10px', textAlign: 'center', position: 'relative' as const }}>
                                            <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', width: `${(rule.confA / 25) * 80}%`, height: 14, background: '#3b82f6', opacity: 0.25, borderRadius: 2 }} />
                                            <span style={{ position: 'relative', fontSize: 9.5, fontWeight: 600, color: 'var(--text-secondary)' }} dir="ltr">{rule.confA.toFixed(2)}</span>
                                        </td>
                                        <td style={{ padding: '6px 10px', textAlign: 'center', position: 'relative' as const }}>
                                            <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', width: `${(rule.confB / 25) * 80}%`, height: 14, background: '#3b82f6', opacity: 0.25, borderRadius: 2 }} />
                                            <span style={{ position: 'relative', fontSize: 9.5, fontWeight: 600, color: 'var(--text-secondary)' }} dir="ltr">{rule.confB.toFixed(2)}</span>
                                        </td>
                                        <td style={{ padding: '6px 10px', textAlign: 'center', position: 'relative' as const }}>
                    <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', width: `${(rule.lift / maxLift) * 80}%`, height: 14, background: palette.primaryGreen, opacity: 0.25, borderRadius: 2 }} />
                                            <span style={{ position: 'relative', fontSize: 9.5, fontWeight: 700, color: 'var(--accent-green)' }} dir="ltr">{rule.lift.toFixed(2)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
