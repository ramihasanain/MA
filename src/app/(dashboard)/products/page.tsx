'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, TrendingDown, DollarSign, ShoppingCart, BarChart3, Percent, Layers } from 'lucide-react';
import ChartCard from '@/components/ui/ChartCard';
import EnterpriseTable from '@/components/ui/EnterpriseTable';
import type { TableColumn } from '@/components/ui/EnterpriseTable';
import { getProductData, type ProductData } from '@/lib/mockData';

// ── ألوان الفئات ──
const CAT_COLORS = ['#00e5a0', '#00d4ff', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#0891b2', '#047857'];

const categories = [
    { name: 'منتجات غذائية', netSales: 248170, volume: 150240, margin: 38.2 },
    { name: 'العناية الشخصية', netSales: 55880, volume: 64300, margin: 42.1 },
    { name: 'غير مصنف', netSales: 46000, volume: 38000, margin: 30.5 },
    { name: 'فرفاشية', netSales: 240, volume: 480, margin: 25.0 },
    { name: 'مستلزمات الأطفال', netSales: 35010, volume: 22800, margin: 44.8 },
    { name: 'مستلزمات منزلية', netSales: 10080, volume: 8900, margin: 35.6 },
    { name: 'منتجات ورقية', netSales: 22220, volume: 18400, margin: 26.3 },
    { name: 'مسطحات', netSales: 8340, volume: 5980, margin: 48.5 },
];

const top10 = [
    { name: 'أرز مطبوخ ممتاز سطح الطرمة 4.5 كجم', profit: 8420, trend: [12, 18, 15, 22, 19, 28, 24, 34, 30, 38, 36, 42] },
    { name: 'الفراولة تايم تشكيلة ألبو سيرياكس كبير', profit: 7680, trend: [10, 15, 13, 19, 16, 24, 20, 28, 25, 32, 30, 36] },
    { name: 'معجون بودي ناعم بطاقة 45 غم', profit: 6540, trend: [9, 12, 11, 16, 14, 18, 16, 22, 19, 24, 22, 26] },
    { name: 'طحينة طعم الأصل 1000 ملل', profit: 5890, trend: [8, 11, 10, 14, 12, 16, 14, 19, 17, 21, 20, 23] },
    { name: 'شوكولاته توبي مولد كلشيء بلاستيك 30', profit: 5240, trend: [7, 10, 8, 13, 11, 15, 13, 17, 15, 19, 18, 21] },
    { name: 'شوكولاته ندى تحت الجرب خضراء كار 30', profit: 4780, trend: [6, 9, 8, 11, 10, 13, 11, 15, 14, 17, 16, 20] },
    { name: 'قرص ويفر 250ملل كيمر بلاستيك', profit: 4320, trend: [5, 8, 7, 10, 9, 12, 10, 14, 12, 15, 14, 18] },
    { name: 'جبن هروة جاج 18 غم غامق 100 غم', profit: 3960, trend: [5, 7, 6, 9, 8, 11, 9, 12, 11, 14, 13, 16] },
    { name: 'جبل طيبي 1 كيل طيبي 250 غم', profit: 3580, trend: [4, 6, 5, 8, 7, 9, 8, 11, 10, 12, 11, 14] },
    { name: 'مكارونة كلاسيك ألبين 15 كجم', profit: 3240, trend: [4, 6, 5, 7, 6, 9, 7, 10, 9, 11, 10, 13] },
];

const bottom10 = [
    { name: 'سبانخ معلبة هيلو 28 غم', profit: 18 },
    { name: 'أوكال كوباية لبن كيس 15', profit: 22 },
    { name: 'معمول بودرة نقاطة 43 غم', profit: 24 },
    { name: 'طحينة طعم بخل الأصل 1000ملل', profit: 31 },
    { name: 'شوكولاته توبي ربيع بلاستيك 30', profit: 38 },
    { name: 'ندى خضراء تحت الشرقي كار باكت', profit: 42 },
    { name: 'قرص ويفر 250ملل كيمر', profit: 47 },
    { name: 'مامون كبير 550ملل بلاستيك', profit: 51 },
    { name: 'فول مطبوخ كامل القمر 500 ملل', profit: 56 },
    { name: 'محدون اكسل مساسكا 300 مل ستاكس', profit: 61 },
];

const contrib = [
    { name: 'دجاج محمد باريال', vol: 2.08, profit: 7.31 },
    { name: 'دجاج سنحه نعمه', vol: 3.26, profit: 9.12 },
    { name: 'أرز مضغوط نعم', vol: 2.54, profit: 6.84 },
    { name: 'أرز هياتي من', vol: 3.02, profit: 8.25 },
    { name: 'الفراولة شبكية حلو', vol: 1.59, profit: 5.20 },
    { name: 'سامي حلانه شبكي', vol: 1.42, profit: 4.80 },
    { name: 'دجاج حلانه', vol: 1.28, profit: 4.10 },
    { name: 'صاج التصليح مصمح', vol: 1.15, profit: 3.90 },
    { name: 'ريت بناء 12 ق', vol: 1.08, profit: 3.62 },
    { name: 'الفراولة شعلي أسر', vol: 0.98, profit: 3.40 },
];

const totalNetSales = categories.reduce((a, c) => a + c.netSales, 0);
const totalProfitValue = Math.round(totalNetSales * 0.365);
const totalCostValue = totalNetSales - totalProfitValue;
const totalVolume = categories.reduce((a, c) => a + c.volume, 0);
const maxBottom = Math.max(...bottom10.map(p => p.profit));

const fmtK = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(2)}K` : String(n);

export default function ProductsPage() {
    const products = useMemo(() => getProductData(), []);
    const [activeKpi, setActiveKpi] = useState<number | null>(null);

    // ── مخطط صافي المبيعات حسب الفئة ──
    const salesByCatOption = {
        tooltip: { trigger: 'axis' as const, backgroundColor: '#1a2035', borderColor: '#1e293b', textStyle: { color: '#e2e8f0', fontSize: 11 } },
        grid: { bottom: '24%', top: '12%', left: '3%', right: '2%', containLabel: true },
        xAxis: { type: 'category' as const, data: categories.map(c => c.name), axisLabel: { rotate: 28, fontSize: 9, color: '#64748b' }, axisLine: { lineStyle: { color: '#334155' } }, splitLine: { show: false } },
        yAxis: { type: 'value' as const, axisLabel: { formatter: (v: number) => `${(v / 1000).toFixed(0)}K`, fontSize: 9, color: '#64748b' }, splitLine: { lineStyle: { color: '#1e293b' } } },
        series: [{
            type: 'bar', barMaxWidth: 44,
            data: categories.map((c, i) => ({
                value: c.netSales,
                itemStyle: {
                    color: { type: 'linear' as const, x: 0, y: 1, x2: 0, y2: 0, colorStops: [{ offset: 0, color: `${CAT_COLORS[i]}22` }, { offset: 1, color: CAT_COLORS[i] }] },
                    borderRadius: [6, 6, 0, 0],
                },
                label: { show: true, position: 'top' as const, fontSize: 9, fontWeight: 'bold', color: CAT_COLORS[i], formatter: (p: { value: number }) => `${(p.value / 1000).toFixed(1)}K` },
            })),
        }],
    };

    // ── Scatter: حجم المبيعات مقابل هامش الربح ──
    const scatterOption = {
        tooltip: { trigger: 'item' as const, backgroundColor: '#1a2035', borderColor: '#1e293b', textStyle: { color: '#e2e8f0', fontSize: 11 }, formatter: (p: { data: [number, number, string] }) => `<b style="color:#00e5a0">${p.data[2]}</b><br/>الحجم: ${fmtK(p.data[0])}<br/>الهامش: ${p.data[1]}%` },
        xAxis: {
            name: 'حجم المبيعات',
            type: 'value' as const,
            nameLocation: 'middle' as const,
            nameGap: 32,
            nameTextStyle: { color: '#64748b', fontSize: 9 },
            axisLabel: { formatter: (v: number) => fmtK(v), fontSize: 9, color: '#64748b' },
            splitLine: { lineStyle: { color: '#1e293b' } },
        },
        yAxis: {
            name: 'هامش الربح %',
            type: 'value' as const,
            nameLocation: 'middle' as const,
            nameGap: 40,
            nameTextStyle: { color: '#64748b', fontSize: 9 },
            axisLabel: { formatter: '{value}%', fontSize: 9, color: '#64748b' },
            splitLine: { lineStyle: { color: '#1e293b' } },
        },
        series: [{
            type: 'scatter',
            symbolSize: (d: number[]) => Math.max(14, Math.sqrt(d[0] / 600)),
            data: categories.map(c => [c.volume, c.margin, c.name]),
            itemStyle: { color: (p: { dataIndex: number }) => CAT_COLORS[p.dataIndex % CAT_COLORS.length], opacity: 0.85, borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1 },
            label: { show: false },
            emphasis: {
                label: {
                    show: true,
                    formatter: (p: { data: (number | string)[] }) => String(p.data[2]).split(/[ ،]/)[0],
                    fontSize: 9,
                    color: '#e2e8f0',
                    position: 'top' as const,
                },
            },
        }],
        grid: { bottom: '18%', top: '14%', left: '16%', right: '5%' },
    };

    // ── مخطط أفضل 10 (أشرطة أفقية تدرج) ──
    const top10Option = {
        tooltip: {
            trigger: 'axis' as const,
            backgroundColor: '#1a2035', borderColor: '#1e293b',
            textStyle: { color: '#e2e8f0', fontSize: 11 },
        },
        grid: { left: '40%', right: '14%', top: '2%', bottom: '2%' },
        xAxis: {
            type: 'value' as const,
            axisLabel: { fontSize: 9, color: '#64748b' },
            splitLine: { lineStyle: { color: '#1e293b' } },
        },
        yAxis: {
            type: 'category' as const,
            data: [...top10].reverse().map(p => p.name.length > 30 ? p.name.substring(0, 30) + '…' : p.name),
            axisLabel: { fontSize: 9.5, color: '#94a3b8', width: 190, overflow: 'truncate' as const },
            axisLine: { show: false },
            axisTick: { show: false },
        },
        series: [{
            type: 'bar' as const,
            barMaxWidth: 22,
            data: [...top10].reverse().map((p, i) => ({
                value: p.profit,
                itemStyle: {
                    color: {
                        type: 'linear' as const, x: 0, y: 0, x2: 1, y2: 0,
                        colorStops: [
                            { offset: 0, color: `${CAT_COLORS[(top10.length - 1 - i) % CAT_COLORS.length]}33` },
                            { offset: 1, color: CAT_COLORS[(top10.length - 1 - i) % CAT_COLORS.length] },
                        ],
                    },
                    borderRadius: [0, 6, 6, 0],
                },
                label: {
                    show: true, position: 'right' as const,
                    fontSize: 10, fontWeight: 'bold',
                    color: CAT_COLORS[(top10.length - 1 - i) % CAT_COLORS.length],
                    formatter: (lp: { value: number }) => lp.value.toLocaleString(),
                },
            })),
        }],
    };


    // ── مساهمة الأرباح والحجم ──
    const contribOption = {
        tooltip: { trigger: 'axis' as const, backgroundColor: '#1a2035', borderColor: '#1e293b', textStyle: { color: '#e2e8f0', fontSize: 10 } },
        legend: { data: ['% حجم المبيعات', '% مساهمة الربح'], bottom: 0, textStyle: { color: '#64748b', fontSize: 9 } },
        grid: { left: '28%', right: '10%', top: '4%', bottom: '14%' },
        xAxis: { type: 'value' as const, axisLabel: { formatter: '{value}%', fontSize: 9, color: '#64748b' }, splitLine: { lineStyle: { color: '#1e293b' } } },
        yAxis: { type: 'category' as const, data: contrib.map(p => p.name.substring(0, 14)), axisLabel: { fontSize: 9, color: '#94a3b8' }, axisLine: { show: false }, axisTick: { show: false } },
        series: [
            { name: '% حجم المبيعات', type: 'bar' as const, barGap: '8%', barMaxWidth: 12, data: contrib.map(p => ({ value: p.vol, itemStyle: { color: '#00d4ff', borderRadius: [0, 4, 4, 0] } })), label: { show: true, position: 'right' as const, fontSize: 8, color: '#00d4ff', formatter: (p: { value: number }) => `${p.value.toFixed(2)}%` } },
            { name: '% مساهمة الربح', type: 'bar' as const, barMaxWidth: 12, data: contrib.map(p => ({ value: p.profit, itemStyle: { color: '#00e5a0', borderRadius: [0, 4, 4, 0] } })), label: { show: true, position: 'right' as const, fontSize: 8, color: '#00e5a0', formatter: (p: { value: number }) => `${p.value.toFixed(2)}%` } },
        ],
    };

    // ── شبكة الارتباط ──
    const networkOption = {
        tooltip: { trigger: 'item' as const, backgroundColor: '#1a2035', borderColor: '#1e293b', textStyle: { color: '#e2e8f0' } },
        series: [{
            type: 'graph', layout: 'force' as const, roam: true,
            label: { show: true, color: '#e2e8f0', fontSize: 10, fontWeight: 'bold' },
            lineStyle: { color: '#334155', curveness: 0.2 },
            emphasis: { focus: 'adjacency' as const, lineStyle: { width: 3 } },
            force: { repulsion: 200, edgeLength: [60, 180], gravity: 0.1 },
            data: [
                { name: 'أرز', symbolSize: 50, itemStyle: { color: '#00e5a0', shadowBlur: 15, shadowColor: '#00e5a080' } },
                { name: 'زيت', symbolSize: 42, itemStyle: { color: '#00d4ff', shadowBlur: 12, shadowColor: '#00d4ff80' } },
                { name: 'سكر', symbolSize: 36, itemStyle: { color: '#3b82f6' } },
                { name: 'دجاج', symbolSize: 46, itemStyle: { color: '#f59e0b', shadowBlur: 12, shadowColor: '#f59e0b80' } },
                { name: 'حليب', symbolSize: 40, itemStyle: { color: '#a855f7' } },
                { name: 'تونة', symbolSize: 32, itemStyle: { color: '#0891b2' } },
                { name: 'منظفات', symbolSize: 30, itemStyle: { color: '#ef4444' } },
            ],
            links: [
                { source: 'أرز', target: 'زيت', value: 82, lineStyle: { width: 3, color: '#00e5a050' } },
                { source: 'أرز', target: 'سكر', value: 70, lineStyle: { width: 2, color: '#00d4ff50' } },
                { source: 'دجاج', target: 'أرز', value: 75, lineStyle: { width: 2.5, color: '#f59e0b50' } },
                { source: 'حليب', target: 'سكر', value: 55, lineStyle: { width: 1.5, color: '#a855f750' } },
                { source: 'تونة', target: 'زيت', value: 45, lineStyle: { width: 1.5, color: '#0891b250' } },
                { source: 'دجاج', target: 'زيت', value: 60, lineStyle: { width: 2, color: '#f59e0b50' } },
            ],
        }],
    };

    // ── Treemap ──
    const treemapOption = {
        tooltip: { trigger: 'item' as const, backgroundColor: '#1a2035', borderColor: '#1e293b', textStyle: { color: '#e2e8f0' } },
        series: [{
            type: 'treemap',
            data: [
                { name: 'بقالة', value: 3500000, itemStyle: { color: '#064e3b' }, children: [{ name: 'أرز', value: 1200000 }, { name: 'زيوت', value: 800000 }, { name: 'سكر', value: 500000 }, { name: 'أخرى', value: 1000000 }] },
                { name: 'لحوم', value: 2200000, itemStyle: { color: '#1e3a5f' }, children: [{ name: 'دواجن', value: 1400000 }, { name: 'بقري', value: 500000 }, { name: 'غنم', value: 300000 }] },
                { name: 'ألبان', value: 1500000, itemStyle: { color: '#312e81' } },
                { name: 'مشروبات', value: 1200000, itemStyle: { color: '#1c4532' } },
                { name: 'منزلية', value: 900000, itemStyle: { color: '#1a1f2e' } },
            ],
            label: { show: true, color: '#e2e8f0', fontSize: 11, fontWeight: 'bold' },
            upperLabel: { show: true, height: 24, color: '#e2e8f0', fontSize: 12, fontWeight: 600 as const },
            itemStyle: { borderColor: '#0a0e17', borderWidth: 2, gapWidth: 2 },
            levels: [{ itemStyle: { borderWidth: 3, gapWidth: 3 }, upperLabel: { show: false } }, { colorSaturation: [0.5, 0.85], itemStyle: { borderWidth: 1, gapWidth: 2 } }],
        }],
    };

    // ── جدول المرتجعات (المنتجات) ──
    const returnsOption = {
        tooltip: { trigger: 'axis' as const, backgroundColor: '#1a2035', borderColor: '#1e293b', textStyle: { color: '#e2e8f0' } },
        xAxis: { type: 'category' as const, data: products.slice(0, 8).map(p => p.nameAr.split(' ').slice(0, 2).join(' ')), axisLabel: { rotate: 30, fontSize: 9, color: '#64748b' }, axisLine: { lineStyle: { color: '#334155' } }, splitLine: { show: false } },
        yAxis: [
            { type: 'value' as const, axisLabel: { fontSize: 9, color: '#64748b' }, splitLine: { lineStyle: { color: '#1e293b' } } },
            { type: 'value' as const, axisLabel: { formatter: '{value}%', fontSize: 9, color: '#64748b' } },
        ],
        series: [
            { name: 'المرتجعات', type: 'bar', data: [320, 180, 420, 150, 95, 210, 110, 280].map(v => ({ value: v, itemStyle: { color: '#ef4444', borderRadius: [4, 4, 0, 0] } })), barWidth: 14 },
            { name: '% الإرجاع', type: 'line', yAxisIndex: 1, data: [2.1, 1.5, 4.2, 1.2, 0.8, 3.5, 1.8, 3.8], lineStyle: { color: '#f59e0b', width: 2 }, itemStyle: { color: '#f59e0b' }, smooth: true },
        ],
        legend: { data: ['المرتجعات', '% الإرجاع'], bottom: 0, left: 'center', textStyle: { color: '#64748b', fontSize: 9 } },
        grid: { bottom: '20%', top: '16%', containLabel: true },
    };

    const prodColumns: TableColumn<ProductData>[] = [
        { key: 'nameAr', header: 'المنتج', sortable: true },
        { key: 'categoryAr', header: 'الفئة', sortable: true },
        { key: 'price', header: 'السعر', sortable: true, align: 'right', format: 'currency' },
        { key: 'unitsSold', header: 'الوحدات', sortable: true, align: 'right', format: 'number' },
        { key: 'revenue', header: 'الإيرادات', sortable: true, align: 'right', format: 'currency' },
        { key: 'margin', header: 'الهامش', sortable: true, align: 'right', format: 'percent' },
    ];

    const kpis = [
        { icon: DollarSign, label: 'صافي المبيعات', sub: 'Net Sales', value: fmtK(totalNetSales), color: '#00e5a0', dim: 'rgba(0,229,160,0.1)' },
        { icon: TrendingUp, label: 'قيمة الربح', sub: 'Profit Value', value: fmtK(totalProfitValue), color: '#00d4ff', dim: 'rgba(0,212,255,0.1)' },
        { icon: BarChart3, label: 'قيمة التكلفة', sub: 'Cost Value', value: fmtK(totalCostValue), color: '#3b82f6', dim: 'rgba(59,130,246,0.1)' },
        { icon: ShoppingCart, label: 'متوسط قيمة المعاملة', sub: 'Avg. Transaction Value (ATV)', value: '36.76', color: '#f59e0b', dim: 'rgba(245,158,11,0.1)' },
        { icon: Package, label: 'متوسط حجم السلة', sub: 'Average Basket Size', value: '27', color: '#a855f7', dim: 'rgba(168,85,247,0.1)' },
        { icon: Layers, label: 'حجم مبيعات المنتجات', sub: 'Product Sales Volume', value: fmtK(totalVolume), color: '#0891b2', dim: 'rgba(8,145,178,0.1)' },
        { icon: Percent, label: 'هامش الربح %', sub: '% Profit Margin', value: '36.51%', color: '#00e5a0', dim: 'rgba(0,229,160,0.1)' },
    ];

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-1">
                    <Package size={22} style={{ color: 'var(--accent-green)' }} />
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Product Performance Dashboard</h1>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-green)' }} />
                        <span className="text-[10px]" style={{ color: 'var(--accent-green)' }}>التقرير السادس</span>
                    </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>تحليل شامل: مبيعات الفئات، هوامش الربح، أفضل/أدنى المنتجات، وشبكة الارتباط</p>
            </motion.div>

            {/* ── KPIs ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
                {kpis.map((k, i) => (
                    <motion.div key={k.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        onClick={() => setActiveKpi(activeKpi === i ? null : i)}
                        className="glass-panel p-4 relative overflow-hidden cursor-pointer transition-all"
                        style={{ borderColor: activeKpi === i ? k.color + '55' : 'var(--border-subtle)', boxShadow: activeKpi === i ? `0 0 18px ${k.color}22` : undefined }}>
                        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl" style={{ background: k.color, opacity: 0.12 }} />
                        <div className="relative">
                            <div className="p-1.5 rounded-lg w-fit mb-2" style={{ background: k.dim }}>
                                <k.icon size={12} style={{ color: k.color }} />
                            </div>
                            <p className="text-[15px] font-bold" style={{ color: k.color }} dir="ltr">{k.value}</p>
                            <p className="text-[9px] font-semibold mt-0.5" style={{ color: 'var(--text-muted)' }}>{k.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── صافي المبيعات حسب الفئة + Scatter ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <ChartCard title="صافي المبيعات حسب الفئة" subtitle="Net Sales by Category" option={salesByCatOption} height="320px" delay={1} />
                <ChartCard title="حجم المبيعات مقابل هامش الربح" subtitle="Product Volume & % Profit Margin by Category" option={scatterOption} height="320px" delay={2} />
            </div>

            {/* ── أفضل 10 + أدنى 10 ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* أفضل 10 */}
                <ChartCard
                    title="أفضل 10 منتجات — قيمة الربح"
                    subtitle="Top 10 Products by Profit Value"
                    option={top10Option}
                    height="380px"
                    delay={1}
                />

                {/* أدنى 10 */}
                <div className="glass-panel overflow-hidden">
                    <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="p-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>
                            <TrendingDown size={13} style={{ color: 'var(--accent-red)' }} />
                        </div>
                        <div>
                            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>أدنى 10 منتجات — قيمة الربح</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Lowest 10 Products by Profit Value</p>
                        </div>
                    </div>
                    <div className="px-4 py-3 space-y-3">
                        {bottom10.map((p, i) => (
                            <div key={p.name} className="flex items-center gap-2">
                                <span className="text-[10px] font-bold shrink-0 w-4 text-center" style={{ color: 'var(--accent-red)', opacity: 0.6 + i * 0.04 }}>{i + 1}</span>
                                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                                    <div style={{ width: `${(p.profit / maxBottom) * 100}%`, height: '100%', background: `rgba(239,68,68,${0.35 + i * 0.065})`, borderRadius: 9999 }} />
                                </div>
                                <span className="text-[9px] flex-1 max-w-[160px] truncate" style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
                                <span className="text-[10px] font-bold shrink-0" style={{ color: 'var(--accent-red)' }} dir="ltr">{p.profit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── مساهمة الأرباح + المرتجعات ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <ChartCard title="% مساهمة حجم المبيعات والأرباح" subtitle="% Sales Volume Contribution & % Profit Contribution by Product" option={contribOption} height="320px" delay={1} />
                <ChartCard title="المرتجعات حسب المنتج" subtitle="عدد المرتجعات مع نسبة الإرجاع" option={returnsOption} height="320px" delay={2} />
            </div>

            {/* ── شبكة الارتباط + Treemap ── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <ChartCard title="شبكة ارتباط المنتجات" subtitle="Basket Analysis — التأثير المتبادل بين المنتجات (روتيت وكبر)" option={networkOption} height="360px" delay={1} />
                <ChartCard title="خريطة إيرادات الفئات" subtitle="Treemap — الإيرادات الهرمية حسب الفئة" option={treemapOption} height="360px" delay={2} />
            </div>

            {/* ── كتالوج المنتجات ── */}
            <EnterpriseTable title="كتالوج المنتجات" columns={prodColumns} data={products} pageSize={10} />
        </div>
    );
}
