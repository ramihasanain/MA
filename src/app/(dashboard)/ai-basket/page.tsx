'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBasket, Brain, Link2, Zap, Clock, Building2 } from 'lucide-react';
import ChartCard from '@/components/ui/ChartCard';
import AIBadge from '@/components/ui/AIBadge';

export default function AIBasketPage() {
    const networkOption = {
        series: [{
            type: 'graph', layout: 'force' as const, roam: true,
            label: { show: true, color: '#e2e8f0', fontSize: 10 },
            lineStyle: { color: '#334155', curveness: 0.3 },
            emphasis: { focus: 'adjacency' as const, lineStyle: { width: 4 } },
            force: { repulsion: 200, edgeLength: [80, 200] },
            data: [
                { name: 'أرز', symbolSize: 50, itemStyle: { color: '#047857' } },
                { name: 'زيت', symbolSize: 40, itemStyle: { color: '#0891b2' } },
                { name: 'سكر', symbolSize: 35, itemStyle: { color: '#2563eb' } },
                { name: 'دجاج', symbolSize: 45, itemStyle: { color: '#d97706' } },
                { name: 'حليب', symbolSize: 38, itemStyle: { color: '#7c3aed' } },
                { name: 'خبز', symbolSize: 42, itemStyle: { color: '#e11d48' } },
                { name: 'بيض', symbolSize: 36, itemStyle: { color: '#0d9488' } },
                { name: 'جبنة', symbolSize: 30, itemStyle: { color: '#8b5cf6' } },
                { name: 'مياه', symbolSize: 38, itemStyle: { color: '#0284c7' } },
                { name: 'تونة', symbolSize: 32, itemStyle: { color: '#65a30d' } },
            ],
            links: [
                { source: 'أرز', target: 'زيت', value: 85 }, { source: 'أرز', target: 'سكر', value: 72 },
                { source: 'أرز', target: 'دجاج', value: 68 }, { source: 'دجاج', target: 'زيت', value: 65 },
                { source: 'حليب', target: 'خبز', value: 78 }, { source: 'حليب', target: 'بيض', value: 70 },
                { source: 'حليب', target: 'جبنة', value: 62 }, { source: 'خبز', target: 'بيض', value: 60 },
                { source: 'مياه', target: 'خبز', value: 58 }, { source: 'أرز', target: 'تونة', value: 40 },
                { source: 'دجاج', target: 'أرز', value: 75 }, { source: 'زيت', target: 'تونة', value: 42 },
            ],
        }],
    };

    // ── ترابط حسب الزمن (أيام الأسبوع) ──
    const timeCorrelationOption = {
        xAxis: { type: 'category' as const, data: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'] },
        yAxis: { type: 'value' as const, name: 'قوة الترابط' },
        series: [
            { name: 'أرز ← زيت', type: 'line', data: [82, 85, 80, 83, 88, 72, 65], lineStyle: { color: '#047857', width: 2 }, itemStyle: { color: '#047857' } },
            { name: 'حليب ← خبز', type: 'line', data: [75, 78, 80, 77, 82, 90, 85], lineStyle: { color: '#2563eb', width: 2 }, itemStyle: { color: '#2563eb' } },
            { name: 'دجاج ← أرز', type: 'line', data: [70, 72, 68, 75, 85, 60, 55], lineStyle: { color: '#d97706', width: 2 }, itemStyle: { color: '#d97706' } },
        ],
        legend: { data: ['أرز ← زيت', 'حليب ← خبز', 'دجاج ← أرز'], bottom: 0, left: 'center' },
    };

    // ── ترابط حسب الأسواق ──
    const marketCorrelationOption = {
        xAxis: {
            type: 'value' as const,
            name: 'قوة الترابط %',
            nameLocation: 'middle' as const,
            nameGap: 32,
        },
        yAxis: {
            type: 'category' as const,
            data: ['عمّان المركزي', 'إربد', 'الزرقاء', 'العقبة', 'السلط'],
            inverse: true,
        },
        series: [
            { name: 'أرز ← زيت', type: 'bar', data: [88, 82, 85, 78, 80], itemStyle: { color: '#047857' }, barWidth: 10 },
            { name: 'حليب ← خبز', type: 'bar', data: [80, 85, 78, 72, 76], itemStyle: { color: '#2563eb' }, barWidth: 10 },
            { name: 'دجاج ← أرز', type: 'bar', data: [75, 70, 72, 68, 65], itemStyle: { color: '#d97706' }, barWidth: 10 },
        ],
        legend: { data: ['أرز ← زيت', 'حليب ← خبز', 'دجاج ← أرز'], bottom: 0, left: 'center' },
        grid: { left: '22%', right: '8%', top: '12%', bottom: '22%' },
    };

    // ── توقع المبيعات حسب الفرع / الموسم ──
    const branchForecastOption = {
        xAxis: { type: 'category' as const, data: ['عمّان', 'إربد', 'الزرقاء', 'العقبة', 'السلط'] },
        yAxis: { type: 'value' as const, axisLabel: { formatter: (v: number) => `${(v / 1000000).toFixed(1)}M` } },
        series: [
            { name: 'يومي (عادي)', type: 'bar', stack: 'forecast', data: [120000, 85000, 72000, 65000, 48000].map((v) => ({ value: v, itemStyle: { color: '#047857' } })), barWidth: 30 },
            { name: 'موسمي (رمضان)', type: 'bar', stack: 'forecast', data: [180000, 130000, 110000, 95000, 72000].map((v) => ({ value: v, itemStyle: { color: '#d97706' } })), barWidth: 30 },
            { name: 'عروض', type: 'bar', stack: 'forecast', data: [95000, 70000, 60000, 50000, 38000].map((v) => ({ value: v, itemStyle: { color: '#7c3aed', borderRadius: [4, 4, 0, 0] } })), barWidth: 30 },
        ],
        legend: { data: ['يومي (عادي)', 'موسمي (رمضان)', 'عروض'], bottom: 0, left: 'center' },
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 rounded-lg" style={{ background: 'var(--accent-cyan-dim)', border: '1px solid rgba(8,145,178,0.2)' }}>
                            <ShoppingBasket size={20} style={{ color: 'var(--accent-cyan)' }} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>سلة السوق الذكية</h1>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>ترابط المنتجات حسب الزمن والأسواق + توقع الفروع — التقرير الثاني عشر</p>
                        </div>
                    </div>
                </div>
                <AIBadge label="Apriori + FP-Growth" size="md" confidence={91} />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { icon: Link2, label: 'ارتباطات مكتشفة', value: '1,247', color: 'var(--accent-green)' },
                    { icon: Clock, label: 'تحليل زمني', value: '7 أيام', color: 'var(--accent-cyan)' },
                    { icon: Building2, label: 'أسواق محللة', value: '47', color: 'var(--accent-blue)' },
                    { icon: Zap, label: 'رفع البيع المتقاطع', value: '+18.2%', color: 'var(--accent-amber)' },
                ].map((s) => (
                    <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel ai-module p-4">
                        <div className="flex items-center gap-2 mb-2"><s.icon size={14} style={{ color: s.color }} /><span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>{s.label}</span></div>
                        <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <ChartCard title="شبكة ارتباط المنتجات" subtitle="العلاقات المكتشفة بالذكاء الاصطناعي" option={networkOption} height="400px" aiPowered delay={1} />
                <ChartCard title="الترابط حسب الزمن" subtitle="قوة ارتباط المنتجات حسب أيام الأسبوع" option={timeCorrelationOption} height="400px" aiPowered delay={2} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <ChartCard title="الترابط حسب الأسواق" subtitle="قوة ارتباط المنتجات لكل سوق" option={marketCorrelationOption} height="340px" aiPowered delay={3} />
                <ChartCard title="توقع المبيعات حسب الفرع" subtitle="التوقع اليومي + الموسمي + العروض" option={branchForecastOption} height="340px" aiPowered delay={4} />
            </div>
        </div>
    );
}
