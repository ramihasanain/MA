'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, ShoppingBag, Repeat, TrendingUp, Heart, CreditCard, Clock } from 'lucide-react';
import ChartCard from '@/components/ui/ChartCard';
import CustomerInsightsTable from '@/components/ui/CustomerInsightsTable';

export default function CustomersPage() {
    // ── Heatmap أوقات الذروة ──
    const hours = ['6ص', '7ص', '8ص', '9ص', '10ص', '11ص', '12م', '1م', '2م', '3م', '4م', '5م', '6م', '7م', '8م', '9م'];
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const heatmapData: number[][] = [];
    hours.forEach((_, hi) => {
        days.forEach((_, di) => {
            let val = 20 + Math.random() * 30;
            if (hi >= 4 && hi <= 8) val += 40; // 10am-2pm rush
            if (hi >= 11 && hi <= 13) val += 25; // 5pm-7pm rush
            if (di === 4) val -= 15; // Thursday less
            if (di === 5) val *= 0.5; // Friday
            heatmapData.push([hi, di, Math.round(Math.max(5, val))]);
        });
    });

    const heatmapOption = {
        grid: { left: '12%', right: '12%', top: '5%', bottom: '15%' },
        xAxis: { type: 'category' as const, data: hours, splitArea: { show: true }, axisLabel: { fontSize: 10 } },
        yAxis: { type: 'category' as const, data: days, splitArea: { show: true }, axisLabel: { fontSize: 10 } },
        visualMap: {
            min: 5, max: 95, calculable: true, orient: 'horizontal' as const, left: 'center', bottom: '0%',
            inRange: { color: ['#0a2e1a', '#047857', '#d97706', '#dc2626'] },
            textStyle: { color: '#94a3b8' },
        },
        series: [{
            type: 'heatmap',
            data: heatmapData,
            label: { show: true, color: '#e2e8f0', fontSize: 9 },
            emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } },
        }],
    };

    // ── طريقة الدفع ──
    const paymentMethodOption = {
        series: [{
            type: 'pie', radius: ['50%', '75%'],
            data: [
                { name: 'نقدي', value: 45, itemStyle: { color: '#047857' } },
                { name: 'فيزا', value: 25, itemStyle: { color: '#2563eb' } },
                { name: 'محفظة إلكترونية', value: 18, itemStyle: { color: '#7c3aed' } },
                { name: 'دفع لاحق', value: 8, itemStyle: { color: '#d97706' } },
                { name: 'آخر', value: 4, itemStyle: { color: '#64748b' } },
            ],
            label: { color: '#94a3b8', fontSize: 11 }, labelLine: { lineStyle: { color: '#334155' } },
        }],
    };

    // ── استفادة من الخصومات والكوبونات ──
    const discountUsageOption = {
        xAxis: { type: 'category' as const, data: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'] },
        yAxis: [
            { type: 'value' as const, name: 'العملاء', axisLabel: { formatter: (v: number) => `${(v / 1000).toFixed(0)}K` } },
            { type: 'value' as const, name: 'الاستفادة %' },
        ],
        series: [
            { name: 'مستخدمي الخصومات', type: 'bar', data: [12000, 14000, 18000, 15000, 16000, 22000, 20000, 19000, 24000, 21000, 28000, 35000].map((v) => ({ value: v, itemStyle: { color: '#047857', borderRadius: [4, 4, 0, 0] } })), barWidth: 18 },
            { name: 'نسبة الاستفادة', type: 'line', yAxisIndex: 1, data: [13, 15, 19, 16, 17, 24, 22, 21, 26, 23, 30, 38], lineStyle: { color: '#d97706', width: 2 }, itemStyle: { color: '#d97706' } },
        ],
        legend: { data: ['مستخدمي الخصومات', 'نسبة الاستفادة'], bottom: 0, left: 'center' },
    };

    // ── قيمة الفاتورة ──
    const invoiceValueOption = {
        xAxis: { type: 'category' as const, data: ['<20', '20-50', '50-100', '100-200', '200-500', '500+'] },
        yAxis: { type: 'value' as const, name: 'العملاء', axisLabel: { formatter: (v: number) => `${(v / 1000).toFixed(0)}K` } },
        series: [{ type: 'bar', data: [8000, 22000, 32000, 18000, 9000, 3500].map((v, i) => ({ value: v, itemStyle: { color: `hsl(${160 + i * 20}, 55%, ${40 - i * 3}%)`, borderRadius: [4, 4, 0, 0] } })), barWidth: 32 }],
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-1"><UserCircle size={24} style={{ color: 'var(--accent-green)' }} /><h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>سلوك العملاء</h1></div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>تحليل المستهلك: الفاتورة، الذروة، الخصومات، الدفع — التقرير الخامس</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { icon: UserCircle, label: 'إجمالي العملاء', value: '92.5K', color: 'var(--accent-green)' },
                    { icon: ShoppingBag, label: 'متوسط الفاتورة', value: '133 د.أ', color: 'var(--accent-cyan)' },
                    { icon: Clock, label: 'ساعة الذروة', value: '10-12 ص', color: 'var(--accent-amber)' },
                    { icon: Repeat, label: 'معدل العودة', value: '89%', color: 'var(--accent-blue)' },
                    { icon: CreditCard, label: 'الدفع النقدي', value: '45%', color: 'var(--accent-green)' },
                ].map((s) => (
                    <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel p-4 text-center">
                        <s.icon size={18} className="mx-auto mb-2" style={{ color: s.color }} />
                        <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-[10px] font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                    </motion.div>
                ))}
            </div>

            <ChartCard title="خريطة حرارية — أوقات الذروة" subtitle="كثافة العملاء حسب اليوم والساعة (Heatmap)" option={heatmapOption} height="340px" delay={1} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <ChartCard title="طريقة الدفع" subtitle="توزيع طرق الدفع للمستهلكين" option={paymentMethodOption} height="340px" delay={3} />
                <ChartCard title="توزيع قيمة الفاتورة" subtitle="عدد العملاء حسب قيمة الفاتورة (د.أ)" option={invoiceValueOption} height="340px" delay={4} />
            </div>

            <ChartCard title="استفادة من الخصومات والكوبونات" subtitle="عدد المستخدمين ونسبة الاستفادة الشهرية" option={discountUsageOption} height="300px" delay={5} />

            <CustomerInsightsTable />
        </div>
    );
}
