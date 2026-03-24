'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Download } from 'lucide-react';
import { ChartTitleFlagBadge } from './ChartTitleFlagBadge';

// ── هيكل البيانات ──
interface RowData {
    id: string;
    name: string;
    level: 0 | 1 | 2 | 3; // branch | category | subcat | product
    grossSales: number;
    netSales: number;
    discounts: number;
    voidSales: number;
    invoices: number;
    productVolume: number;
    voidedProducts: number;
    avgPrice: number;
    avgBasket: number;
    atv: number;
    children?: RowData[];
}

// ── بيانات وهمية مفصّلة ──
const tableData: RowData[] = [
    {
        id: 'b1', name: 'سوق المنارة', level: 0,
        grossSales: 329200, netSales: 328505, discounts: 48200, voidSales: 695, invoices: 5420, productVolume: 182400, voidedProducts: 62, avgPrice: 1.80, avgBasket: 6, atv: 60.61,
        children: [
            {
                id: 'b1-c1', name: 'منتجات غذائية', level: 1,
                grossSales: 192100, netSales: 191753, discounts: 28400, voidSales: 347, invoices: 3200, productVolume: 112000, voidedProducts: 38, avgPrice: 1.71, avgBasket: 5, atv: 59.92,
                children: [
                    {
                        id: 'b1-c1-s1', name: 'حبوب', level: 2,
                        grossSales: 45800, netSales: 45443, discounts: 6200, voidSales: 357, invoices: 820, productVolume: 28400, voidedProducts: 10, avgPrice: 1.60, avgBasket: 3, atv: 55.42,
                        children: [
                            { id: 'p1', name: 'أرز مطبوخ ممتاز 1 كجم', level: 3, grossSales: 6100, netSales: 5988, discounts: 920, voidSales: 112, invoices: 185, productVolume: 3400, voidedProducts: 2, avgPrice: 1.76, avgBasket: 1, atv: 32.37 },
                            { id: 'p2', name: 'أرز حبة متوسطة 2 كجم', level: 3, grossSales: 4020, netSales: 3927, discounts: 580, voidSales: 93, invoices: 140, productVolume: 2200, voidedProducts: 1, avgPrice: 1.79, avgBasket: 1, atv: 28.05 },
                            { id: 'p3', name: 'أرز بسمتي ممتاز 5 كجم', level: 3, grossSales: 3820, netSales: 3719, discounts: 510, voidSales: 101, invoices: 112, productVolume: 1800, voidedProducts: 2, avgPrice: 2.07, avgBasket: 1, atv: 33.21 },
                        ],
                    },
                    {
                        id: 'b1-c1-s2', name: 'حليب', level: 2,
                        grossSales: 30200, netSales: 29993, discounts: 4100, voidSales: 207, invoices: 610, productVolume: 19800, voidedProducts: 7, avgPrice: 1.51, avgBasket: 3, atv: 49.17,
                        children: [
                            { id: 'p4', name: 'حليب طازج 1 لتر', level: 3, grossSales: 9200, netSales: 9050, discounts: 1400, voidSales: 150, invoices: 210, productVolume: 7200, voidedProducts: 3, avgPrice: 1.26, avgBasket: 2, atv: 43.10 },
                            { id: 'p5', name: 'حليب كامل الدسم 2 لتر', level: 3, grossSales: 7100, netSales: 6980, discounts: 980, voidSales: 120, invoices: 165, productVolume: 5100, voidedProducts: 2, avgPrice: 1.37, avgBasket: 2, atv: 42.32 },
                        ],
                    },
                ],
            },
            {
                id: 'b1-c2', name: 'العناية الشخصية', level: 1,
                grossSales: 26900, netSales: 26823, discounts: 3800, voidSales: 77, invoices: 890, productVolume: 31200, voidedProducts: 8, avgPrice: 0.86, avgBasket: 5, atv: 30.14,
                children: [
                    { id: 'b1-c2-s1', name: 'عطور', level: 2, grossSales: 8200, netSales: 8140, discounts: 1200, voidSales: 60, invoices: 280, productVolume: 9400, voidedProducts: 2, avgPrice: 0.87, avgBasket: 2, atv: 29.07 },
                    { id: 'b1-c2-s2', name: 'مستحضرات بشرة', level: 2, grossSales: 7100, netSales: 7050, discounts: 1050, voidSales: 50, invoices: 220, productVolume: 8200, voidedProducts: 2, avgPrice: 0.86, avgBasket: 2, atv: 32.05 },
                ],
            },
            {
                id: 'b1-c3', name: 'مستلزمات منزلية', level: 1,
                grossSales: 27500, netSales: 27232, discounts: 4100, voidSales: 268, invoices: 720, productVolume: 21800, voidedProducts: 9, avgPrice: 1.25, avgBasket: 4, atv: 37.82,
            },
        ],
    },
    {
        id: 'b2', name: 'سوق سطح النجم', level: 0,
        grossSales: 97470, netSales: 97419, discounts: 23596, voidSales: 51, invoices: 2671, productVolume: 91656, voidedProducts: 30, avgPrice: 1.57, avgBasket: 2, atv: 26.54,
        children: [
            {
                id: 'b2-c1', name: 'أجهزة وإلكترونيات', level: 1,
                grossSales: 121, netSales: 120, discounts: 43, voidSales: 1, invoices: 52, productVolume: 63, voidedProducts: 1, avgPrice: 1.92, avgBasket: 1, atv: 2.28,
                children: [
                    {
                        id: 'b2-c1-s1', name: 'بطاريات', level: 2,
                        grossSales: 121, netSales: 120, discounts: 43, voidSales: 1, invoices: 52, productVolume: 63, voidedProducts: 1, avgPrice: 1.92, avgBasket: 1, atv: 2.28,
                        children: [
                            { id: 'p10', name: 'بطاريات الكشافات كبير مالكس فاريا 2+1', level: 3, grossSales: 5, netSales: 5, discounts: 0.34, voidSales: 0, invoices: 5, productVolume: 5, voidedProducts: 0, avgPrice: 1.00, avgBasket: 1, atv: 1.00 },
                            { id: 'p11', name: 'بطاريات الكشافات كبير جاف مالكس فاريا 2+1', level: 3, grossSales: 6, netSales: 6, discounts: 0.14, voidSales: 0, invoices: 2, productVolume: 2, voidedProducts: 0, avgPrice: 3.00, avgBasket: 1, atv: 3.00 },
                            { id: 'p12', name: 'AA بطاريات جاف بير لجو الصو بطاريات مالكس 8', level: 3, grossSales: 9, netSales: 9, discounts: 6.05, voidSales: 0, invoices: 9, productVolume: 9, voidedProducts: 0, avgPrice: 1.00, avgBasket: 1, atv: 1.00 },
                            { id: 'p13', name: 'AAA بطاريات جاف كفاتي ارجامي رجومي مالكس 2+4', level: 3, grossSales: 16, netSales: 16, discounts: 0, voidSales: 0, invoices: 5, productVolume: 5, voidedProducts: 0, avgPrice: 3.20, avgBasket: 1, atv: 3.20 },
                            { id: 'p14', name: 'مجاني +1=5 CIT+4بطاريات الكشافات', level: 3, grossSales: 22, netSales: 22, discounts: 5.82, voidSales: 0, invoices: 7, productVolume: 7, voidedProducts: 0, avgPrice: 3.14, avgBasket: 1, atv: 3.14 },
                        ],
                    },
                ],
            },
            {
                id: 'b2-c2', name: 'العناية الشخصية', level: 1,
                grossSales: 12491, netSales: 12486, discounts: 3015, voidSales: 5, invoices: 2193, productVolume: 10875, voidedProducts: 1, avgPrice: 1.40, avgBasket: 2, atv: 5.22,
                children: [
                    { id: 'b2-c2-s1', name: 'جل مقطر', level: 2, grossSales: 363, netSales: 363, discounts: 109, voidSales: 0, invoices: 133, productVolume: 154, voidedProducts: 0, avgPrice: 2.51, avgBasket: 1, atv: 2.73 },
                    { id: 'b2-c2-s2', name: 'شامو', level: 2, grossSales: 1837, netSales: 1837, discounts: 453, voidSales: 0, invoices: 519, productVolume: 679, voidedProducts: 0, avgPrice: 2.75, avgBasket: 1, atv: 3.60 },
                    { id: 'b2-c2-s3', name: 'عناص', level: 2, grossSales: 2171, netSales: 2171, discounts: 597, voidSales: 0, invoices: 877, productVolume: 2127, voidedProducts: 0, avgPrice: 1.14, avgBasket: 1, atv: 2.48 },
                    { id: 'b2-c2-s4', name: 'فرشاة أسنان', level: 2, grossSales: 226, netSales: 226, discounts: 124, voidSales: 0, invoices: 124, productVolume: 203, voidedProducts: 0, avgPrice: 1.23, avgBasket: 1, atv: 1.82 },
                ],
            },
        ],
    },
];

// ── تنسيق الأرقام ──
const fmt = (n: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const fmtInt = (n: number) => new Intl.NumberFormat('en-US').format(n);

// ── صف واحد ──
function TableRow({ row, depth, expandedIds, onToggle }: {
    row: RowData;
    depth: number;
    expandedIds: Set<string>;
    onToggle: (id: string) => void;
}) {
    const isExpanded = expandedIds.has(row.id);
    const hasChildren = !!(row.children && row.children.length > 0);
    const indent = depth * 16;

    const bgLevel = depth === 0
        ? 'rgba(37,99,235,0.07)'
        : depth === 1
            ? 'rgba(37,99,235,0.03)'
            : depth === 2
                ? 'transparent'
                : 'transparent';

    const fontWeight = depth === 0 ? 700 : depth === 1 ? 600 : depth === 2 ? 500 : 400;
    const fontSize = depth === 0 ? '12px' : depth === 1 ? '11px' : '10px';

    return (
        <>
            <tr
                onClick={() => hasChildren && onToggle(row.id)}
                style={{
                    background: isExpanded ? 'rgba(37,99,235,0.08)' : bgLevel,
                    cursor: hasChildren ? 'pointer' : 'default',
                    transition: 'background 0.2s',
                    borderBottom: '1px solid var(--border-subtle)',
                }}
                className={hasChildren ? 'hover:bg-blue-500/10' : ''}
            >
                {/* اسم الصف */}
                <td style={{ padding: '5px 8px', paddingRight: `${indent + 8}px`, whiteSpace: 'nowrap', minWidth: 200 }}>
                    <div className="flex items-center gap-1.5">
                        {hasChildren && (
                            <motion.span
                                animate={{ rotate: isExpanded ? -90 : 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'inline-flex', color: 'var(--accent-blue)', flexShrink: 0 }}
                            >
                                <ChevronLeft size={12} />
                            </motion.span>
                        )}
                        {!hasChildren && <span style={{ width: 12, display: 'inline-block' }} />}
                        <span style={{ fontSize, fontWeight, color: depth === 0 ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
                            {row.name}
                        </span>
                    </div>
                </td>
                {/* الأعمدة الرقمية */}
                {[
                    { v: fmt(row.grossSales), dim: false },
                    { v: fmt(row.netSales), dim: false },
                    { v: fmt(row.discounts), dim: true },
                    { v: fmt(row.voidSales), dim: true },
                    { v: fmtInt(row.invoices), dim: false },
                    { v: fmtInt(row.productVolume), dim: false },
                    { v: fmtInt(row.voidedProducts), dim: true },
                    { v: fmt(row.avgPrice), dim: false },
                    { v: fmtInt(row.avgBasket), dim: false },
                    { v: fmt(row.atv), dim: false },
                ].map((col, i) => (
                    <td key={i} style={{
                        padding: '5px 10px', textAlign: 'right', fontSize: '11px',
                        color: col.dim ? 'var(--text-muted)' : 'var(--text-secondary)',
                        fontWeight: depth === 0 ? 600 : 400,
                        whiteSpace: 'nowrap',
                    }} dir="ltr">
                        {col.v}
                    </td>
                ))}
            </tr>

            {/* الأبناء */}
            <AnimatePresence initial={false}>
                {isExpanded && hasChildren && row.children!.map(child => (
                    <TableRow key={child.id} row={child} depth={depth + 1} expandedIds={expandedIds} onToggle={onToggle} />
                ))}
            </AnimatePresence>
        </>
    );
}

// ── الأعمدة ──
const columns = [
    { label: 'اسم الفرع / الفئة', align: 'right' as const },
    { label: 'إجمالي المبيعات', align: 'right' as const },
    { label: 'صافي المبيعات', align: 'right' as const },
    { label: 'الخصومات المطبّقة', align: 'right' as const },
    { label: 'مبيعات ملغاة', align: 'right' as const },
    { label: 'عدد الفواتير', align: 'right' as const },
    { label: 'حجم مبيعات المنتجات', align: 'right' as const },
    { label: 'المنتجات الملغاة', align: 'right' as const },
    { label: 'متوسط سعر المنتج', align: 'right' as const },
    { label: 'متوسط السلة', align: 'right' as const },
    { label: 'متوسط قيمة المعاملة', align: 'right' as const },
];

export default function BranchSalesTable() {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['b1', 'b2']));

    const toggle = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const expandAll = () => setExpandedIds(new Set(
        tableData.flatMap(b => [b.id, ...(b.children?.flatMap(c => [c.id, ...(c.children?.map(s => s.id) ?? [])]) ?? [])])
    ));
    const collapseAll = () => setExpandedIds(new Set());

    return (
        <div className="glass-panel overflow-hidden">
            {/* رأس */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ background: 'rgba(37,99,235,0.12)' }}>
                        <Download size={14} style={{ color: 'var(--accent-blue)' }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <ChartTitleFlagBadge flag="green" size="sm" />
                            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                تفاصيل أداء مبيعات الفروع
                            </h3>
                        </div>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            Branch Sales Performance Details
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={expandAll} className="text-[10px] px-3 py-1.5 rounded-md transition-colors font-medium"
                        style={{ background: 'rgba(37,99,235,0.12)', color: 'var(--accent-blue)', border: '1px solid rgba(37,99,235,0.2)' }}>
                        فتح الكل
                    </button>
                    <button onClick={collapseAll} className="text-[10px] px-3 py-1.5 rounded-md transition-colors font-medium"
                        style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                        طي الكل
                    </button>
                </div>
            </div>

            {/* الجدول */}
            <div className="overflow-x-auto">
                <table dir="rtl" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-elevated)', borderBottom: '2px solid var(--border-subtle)' }}>
                            {columns.map((col, i) => (
                                <th key={i} style={{
                                    padding: '8px 10px', textAlign: col.align, fontSize: '10px',
                                    fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap',
                                    minWidth: i === 0 ? 200 : 110,
                                    borderBottom: '1px solid var(--border-subtle)',
                                }}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map(row => (
                            <TableRow
                                key={row.id}
                                row={row}
                                depth={0}
                                expandedIds={expandedIds}
                                onToggle={toggle}
                            />
                        ))}
                    </tbody>
                    {/* إجمالي */}
                    <tfoot>
                        <tr style={{ background: 'rgba(37,99,235,0.1)', borderTop: '2px solid rgba(37,99,235,0.3)' }}>
                            <td style={{ padding: '8px 10px', fontSize: '11px', fontWeight: 700, color: 'var(--accent-blue)' }}>الإجمالي الكلي</td>
                            {[
                                fmt(tableData.reduce((a, b) => a + b.grossSales, 0)),
                                fmt(tableData.reduce((a, b) => a + b.netSales, 0)),
                                fmt(tableData.reduce((a, b) => a + b.discounts, 0)),
                                fmt(tableData.reduce((a, b) => a + b.voidSales, 0)),
                                fmtInt(tableData.reduce((a, b) => a + b.invoices, 0)),
                                fmtInt(tableData.reduce((a, b) => a + b.productVolume, 0)),
                                fmtInt(tableData.reduce((a, b) => a + b.voidedProducts, 0)),
                                '—', '—', '—',
                            ].map((v, i) => (
                                <td key={i} style={{ padding: '8px 10px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: 'var(--accent-blue)', whiteSpace: 'nowrap' }} dir="ltr">
                                    {v}
                                </td>
                            ))}
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
