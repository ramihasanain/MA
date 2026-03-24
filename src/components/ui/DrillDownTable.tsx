'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { ChartTitleFlagBadge } from './ChartTitleFlagBadge';

// ── Deterministic seeded random ──
let _s = 77;
const sr = () => { _s = (_s * 16807) % 2147483647; return (_s & 0x7fffffff) / 2147483647; };

// ── Types ──
interface RowData {
    name: string;
    grossSales: number;
    netSales: number;
    nonDiscNetSales: number;
    discNetSales: number;
    voidSales: number;
    productVolume: number;
    nonDiscVolume: number;
    discVolume: number;
    avgPrice: number;
    avgDiscRate: number;
    children?: RowData[];
}

// ── Generate data ──
const PRODUCTS = [
    'أرز بسمتي ممتاز', 'أرز حبة متوسطة', 'زيت زيتون بكر', 'زيت عباد شمس',
    'حليب طازج كامل', 'لبن زبادي', 'سكر أبيض 1كغ', 'شاي أسود سيلاني',
    'معكرونة سباغيتي', 'تونة معلبة', 'فول مدمس', 'حمص بالطحينة',
    'دجاج مجمد', 'صدور دجاج', 'لحمة مفرومة', 'خبز عربي',
    'صابون غسيل', 'منظف أرضيات', 'شامبو ضد القشرة', 'حفاضات أطفال',
    'مياه معدنية', 'عصير برتقال', 'مشروب غازي', 'بسكويت شوكولاتة',
    'شيبس مملح', 'مكسرات مشكلة', 'بطاريات AA', 'مناديل ورقية',
];

const CATEGORIES = [
    'منتجات غذائية', 'مستلزمات منزلية', 'العناية الشخصية', 'مشروبات',
    'لحوم ودواجن', 'حلويات وسناكات', 'مستلزمات الأطفال', 'منتجات ورقية',
];

const BRANCHES = ['سوق المنارة', 'سوق سلاح الجو', 'فرع عمّان الغربي', 'فرع إربد', 'فرع الزرقاء'];

function mkRow(name: string, base: number): Omit<RowData, 'children'> {
    const gross = Math.round(base + sr() * base * 0.3);
    const net = Math.round(gross * (0.95 + sr() * 0.04));
    const discNet = Math.round(net * (0.15 + sr() * 0.1));
    const nonDiscNet = net - discNet;
    const voidSales = Math.round(gross * (0.001 + sr() * 0.003));
    const vol = Math.round(gross / (1.5 + sr() * 3));
    const discVol = Math.round(vol * (0.15 + sr() * 0.15));
    const nonDiscVol = vol - discVol;
    const avgPrice = Number((gross / vol).toFixed(2));
    const avgDiscRate = Number((discNet / net * 100).toFixed(2));
    return { name, grossSales: gross, netSales: net, nonDiscNetSales: nonDiscNet, discNetSales: discNet, voidSales, productVolume: vol, nonDiscVolume: nonDiscVol, discVolume: discVol, avgPrice, avgDiscRate };
}

/** Aggregate metrics from child rows (سوق → مجموعات → مادة). */
function buildParent(name: string, children: RowData[]): RowData {
    const grossSales = children.reduce((s, r) => s + r.grossSales, 0);
    const netSales = children.reduce((s, r) => s + r.netSales, 0);
    const nonDiscNetSales = children.reduce((s, r) => s + r.nonDiscNetSales, 0);
    const discNetSales = children.reduce((s, r) => s + r.discNetSales, 0);
    const voidSales = children.reduce((s, r) => s + r.voidSales, 0);
    const productVolume = children.reduce((s, r) => s + r.productVolume, 0);
    const nonDiscVolume = children.reduce((s, r) => s + r.nonDiscVolume, 0);
    const discVolume = children.reduce((s, r) => s + r.discVolume, 0);
    const avgPrice = productVolume > 0 ? Number((grossSales / productVolume).toFixed(2)) : 0;
    const avgDiscRate = netSales > 0 ? Number((discNetSales / netSales * 100).toFixed(2)) : 0;
    return {
        name,
        grossSales,
        netSales,
        nonDiscNetSales,
        discNetSales,
        voidSales,
        productVolume,
        nonDiscVolume,
        discVolume,
        avgPrice,
        avgDiscRate,
        children,
    };
}

_s = 77;
/** التسلسل الهرمي: سوق → المجموعة الاولى → المجموعة الثانية → المجموعة الثالثة → المادة */
const tableData: RowData[] = BRANCHES.map(branch => {
    const bBase = 40000 + sr() * 160000;
    const g1List: RowData[] = [];
    for (let g1 = 0; g1 < 2; g1++) {
        const g1Base = (bBase / 2) * (0.45 + sr() * 0.15);
        const g1Name = `المجموعة الاولى — ${CATEGORIES[(g1 * 3) % CATEGORIES.length]}`;
        const g2List: RowData[] = [];
        for (let g2 = 0; g2 < 2; g2++) {
            const g2Base = (g1Base / 2) * (0.45 + sr() * 0.15);
            const g2Name = `المجموعة الثانية — ${CATEGORIES[(g1 + g2 * 2) % CATEGORIES.length]}`;
            const g3List: RowData[] = [];
            for (let g3 = 0; g3 < 2; g3++) {
                const g3Base = (g2Base / 2) * (0.45 + sr() * 0.15);
                const g3Name = `المجموعة الثالثة — ${CATEGORIES[(g1 + g2 + g3) % CATEGORIES.length]}`;
                const prods: RowData[] = [];
                const pCount = 2 + Math.round(sr() * 3);
                for (let p = 0; p < pCount; p++) {
                    prods.push(
                        mkRow(
                            PRODUCTS[Math.round(sr() * 1000) % PRODUCTS.length],
                            (g3Base / pCount) * (0.4 + sr() * 0.3),
                        ),
                    );
                }
                g3List.push(buildParent(g3Name, prods));
            }
            g2List.push(buildParent(g2Name, g3List));
        }
        g1List.push(buildParent(g1Name, g2List));
    }
    return buildParent(branch, g1List);
});

/** Keys of this row and every nested row (same pattern as `root-0-1-…` in render). */
function collectDescendantRowKeys(row: RowData, rowKey: string): string[] {
    const keys: string[] = [];
    if (!row.children?.length) return keys;
    row.children.forEach((child, ci) => {
        const childKey = `${rowKey}-${ci}`;
        keys.push(childKey, ...collectDescendantRowKeys(child, childKey));
    });
    return keys;
}

// ── Columns definition ──
const COLUMNS = [
    { key: 'grossSales', label: 'إجمالي المبيعات', labelEn: 'Gross Sales' },
    { key: 'netSales', label: 'صافي المبيعات', labelEn: 'Net Sales' },
    { key: 'nonDiscNetSales', label: 'مبيعات بدون خصم', labelEn: 'Non Disc. Net Sales' },
    { key: 'discNetSales', label: 'مبيعات مخصومة', labelEn: 'Discount Net Sales' },
    { key: 'voidSales', label: 'مبيعات ملغاة', labelEn: 'Void Sales' },
    { key: 'productVolume', label: 'حجم المنتجات', labelEn: 'Product Volume' },
    { key: 'nonDiscVolume', label: 'حجم غير مخصوم', labelEn: 'Non Disc. Volume' },
    { key: 'discVolume', label: 'حجم مخصوم', labelEn: 'Disc. Volume' },
    { key: 'avgPrice', label: 'متوسط السعر', labelEn: 'Avg. Price' },
    { key: 'avgDiscRate', label: 'متوسط الخصم %', labelEn: 'Avg. Disc. Rate' },
];

// ── MiniBar component ──
function MiniBar({ value, max, color = 'var(--accent-blue)' }: { value: number; max: number; color?: string }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div style={{ display: 'inline-block', width: '50px', height: '6px', borderRadius: '3px', background: 'var(--bg-elevated)', verticalAlign: 'middle', marginRight: '6px' }}>
            <div style={{ width: `${pct}%`, height: '100%', borderRadius: '3px', background: color, transition: 'width 0.3s' }} />
        </div>
    );
}

// ── Main Component ──
export default function DrillDownTable() {
    /** Only `true` means open; missing/`false` = closed (default closed for every row). */
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggle = (rowKey: string, row: RowData) => {
        setExpanded(prev => {
            const isOpen = prev[rowKey] === true;
            if (isOpen) {
                const next: Record<string, boolean> = { ...prev };
                next[rowKey] = false;
                for (const d of collectDescendantRowKeys(row, rowKey)) {
                    delete next[d];
                }
                return next;
            }
            return { ...prev, [rowKey]: true };
        });
    };

    // Compute totals
    const totals = useMemo(() => {
        const t: Record<string, number> = {};
        COLUMNS.forEach(c => { t[c.key] = 0; });
        tableData.forEach(b => {
            COLUMNS.forEach(c => { t[c.key] += (b as any)[c.key]; });
        });
        t.avgPrice = Number((t.grossSales / t.productVolume).toFixed(2));
        t.avgDiscRate = Number((t.discNetSales / t.netSales * 100).toFixed(2));
        return t;
    }, []);

    const maxGross = useMemo(() => Math.max(...tableData.map(b => b.grossSales)), []);

    const fmt = (v: number, key: string) => {
        if (key === 'avgPrice') return v.toFixed(2);
        if (key === 'avgDiscRate') return `${v.toFixed(2)}%`;
        if (key === 'voidSales') return v.toFixed(2);
        return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    /** Zebra striping: even ≈ white/surface, odd ≈ gray (theme-aware). */
    const STRIPE_EVEN = 'var(--bg-surface)';
    const STRIPE_ODD = 'rgba(148, 163, 184, 0.09)';

    const renderRow = (
        row: RowData,
        level: number,
        parentKey: string,
        idx: number,
        stripeCounter: { n: number } = { n: 0 },
    ) => {
        const key = `${parentKey}-${idx}`;
        const hasChildren = row.children && row.children.length > 0;
        const isOpen = expanded[key] === true;
        const indent = level * 24;
        const stripeIndex = stripeCounter.n++;
        const stripeBg = stripeIndex % 2 === 0 ? STRIPE_EVEN : STRIPE_ODD;

        const levelColors = [
            'var(--text-primary)',    // سوق
            'var(--accent-green)',    // المجموعة الاولى
            'var(--accent-cyan)',     // المجموعة الثانية
            'var(--accent-blue)',     // المجموعة الثالثة
            'var(--text-secondary)',  // المادة
        ];
        const chevronOpenBg = [
            'rgba(0,229,160,0.15)',
            'rgba(0,229,160,0.11)',
            'rgba(8,145,178,0.12)',
            'rgba(59,130,246,0.12)',
        ];
        const chevronIconOpen = [
            'var(--accent-green)',
            'var(--accent-green)',
            'var(--accent-cyan)',
            'var(--accent-blue)',
        ];
        const rowHoverBg = [
            'rgba(0,229,160,0.08)',
            'rgba(0,229,160,0.06)',
            'rgba(8,145,178,0.08)',
            'rgba(59,130,246,0.08)',
        ];
        const colorIdx = Math.min(level, levelColors.length - 1);
        const chevronIdx = Math.min(level, chevronOpenBg.length - 1);

        const rows: React.ReactNode[] = [];

        rows.push(
            <tr
                key={key}
                style={{
                    background: stripeBg,
                    cursor: hasChildren ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                }}
                onClick={() => hasChildren && toggle(key, row)}
                onMouseEnter={(e) => {
                    if (hasChildren) {
                        (e.currentTarget as HTMLElement).style.background =
                            rowHoverBg[chevronIdx] ?? 'rgba(148,163,184,0.12)';
                    }
                }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = stripeBg; }}
            >
                {/* Name column */}
                <td style={{ paddingRight: `${indent + 12}px`, whiteSpace: 'nowrap' }}>
                    <div className="flex items-center gap-1.5">
                        {hasChildren ? (
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '4px',
                                    background: isOpen ? chevronOpenBg[chevronIdx] : 'var(--bg-elevated)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {isOpen ? (
                                    <ChevronDown
                                        size={11}
                                        style={{ color: chevronIconOpen[chevronIdx] }}
                                    />
                                ) : (
                                    <ChevronLeft size={11} style={{ color: 'var(--text-muted)' }} />
                                )}
                            </span>
                        ) : (
                            <span style={{ width: '16px', display: 'inline-block' }} />
                        )}
                        <span className="text-xs font-medium" style={{ color: levelColors[colorIdx] }}>
                            {row.name}
                        </span>
                    </div>
                </td>

                {/* Data columns */}
                {COLUMNS.map(col => {
                    const val = (row as any)[col.key] as number;
                    const showBar = level === 0 && (col.key === 'grossSales' || col.key === 'netSales');
                    const isVoid = col.key === 'voidSales';
                    const isDisc = col.key === 'avgDiscRate';

                    return (
                        <td key={col.key} style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <div className="flex items-center gap-1">
                                {showBar && (
                                    <MiniBar
                                        value={val}
                                        max={maxGross}
                                        color={col.key === 'grossSales' ? 'var(--accent-blue)' : 'var(--accent-green)'}
                                    />
                                )}
                                <span
                                    className="text-xs font-medium"
                                    style={{
                                        color:
                                            isVoid && val > 100
                                                ? 'var(--accent-red)'
                                                : isDisc
                                                    ? 'var(--accent-amber)'
                                                    : level === 0
                                                        ? 'var(--text-primary)'
                                                        : 'var(--text-secondary)',
                                    }}
                                    dir="ltr"
                                >
                                    {fmt(val, col.key)}
                                </span>
                            </div>
                        </td>
                    );
                })}
            </tr>
        );

        // Render children
        if (hasChildren && isOpen) {
            row.children!.forEach((child, ci) => {
                rows.push(...renderRow(child, level + 1, key, ci, stripeCounter));
            });
        }

        return rows;
    };

    return (
        <div className="glass-panel overflow-hidden">
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-2">
                    <ChartTitleFlagBadge flag="green" size="sm" />
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        تحليل المبيعات التفصيلي — سوق / مجموعات / مادة
                    </h3>
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    التسلسل الهرمي: سوق — المجموعة الاولى — المجموعة الثانية — المجموعة الثالثة — المادة
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    اضغط على أي صف للتوسع • إجمالي ← صافي ← خصومات ← حجم المنتجات
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="enterprise-table" dir="rtl" style={{ minWidth: '1200px' }}>
                    <thead>
                        <tr>
                            <th style={{ minWidth: '160px', textAlign: 'right' }}>الاسم</th>
                            {COLUMNS.map(col => (
                                <th key={col.key} style={{ textAlign: 'right', minWidth: '110px', fontSize: '10px', lineHeight: '1.3' }}>
                                    <div>{col.label}</div>
                                    <div style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '9px' }}>{col.labelEn}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const stripeCounter = { n: 0 };
                            return tableData.flatMap((branch, bi) => renderRow(branch, 0, 'root', bi, stripeCounter));
                        })()}

                        {/* Total row */}
                        <tr
                            style={{
                                background: 'var(--accent-green-dim)',
                                borderTop: '2px solid rgba(0,229,160,0.3)',
                            }}
                        >
                            <td>
                                <span className="text-xs font-bold" style={{ color: 'var(--accent-green)', paddingRight: '12px' }}>
                                    الإجمالي — Total
                                </span>
                            </td>
                            {COLUMNS.map(col => (
                                <td key={col.key} style={{ textAlign: 'right' }}>
                                    <span className="text-xs font-bold" style={{ color: 'var(--accent-green)' }} dir="ltr">
                                        {fmt(totals[col.key], col.key)}
                                    </span>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
