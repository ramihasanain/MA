'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

// ── هيكل بيانات العميل ──
interface Customer {
    name: string;
    totalSales: number;
    totalTransactions: number;
    atv: number;
    avgBasket: number;
    avgLifespan: number;
    clv: number;
    clvSegment: 'High' | 'Medium' | 'Low';
    segment: string;
}

// ── بيانات وهمية مأخوذة من السكرشوت + مزيد ──
const customers: Customer[] = [
    { name: 'عبدالعزيز العدامات', totalSales: 27, totalTransactions: 11, atv: 2.45, avgBasket: 1, avgLifespan: 0, clv: 0.0, clvSegment: 'Low', segment: 'Low Recency, High Frequency' },
    { name: 'عبدالحميد الشرفات', totalSales: 8, totalTransactions: 5, atv: 1.60, avgBasket: 1, avgLifespan: 0, clv: 0.0, clvSegment: 'Low', segment: 'Low Recency, High Frequency' },
    { name: 'عبدالله البعيدة', totalSales: 198, totalTransactions: 90, atv: 2.20, avgBasket: 2, avgLifespan: 14, clv: 2772.0, clvSegment: 'High', segment: 'High Recency, High Frequency' },
    { name: 'عبدالله الرفاعي', totalSales: 34, totalTransactions: 4, atv: 8.50, avgBasket: 1, avgLifespan: 1, clv: 34.0, clvSegment: 'Low', segment: 'High Recency, Low Frequency' },
    { name: 'عبدالله العلانزة', totalSales: 19, totalTransactions: 5, atv: 3.80, avgBasket: 1, avgLifespan: 14, clv: 266.0, clvSegment: 'Medium', segment: 'Low Recency, High Frequency' },
    { name: 'عبدالله البنيان', totalSales: 13, totalTransactions: 4, atv: 3.25, avgBasket: 2, avgLifespan: 0, clv: 0.0, clvSegment: 'Low', segment: 'Low Recency, Low Frequency' },
    { name: 'عبدالله المساعيد', totalSales: 62, totalTransactions: 16, atv: 3.88, avgBasket: 1, avgLifespan: 12, clv: 744.0, clvSegment: 'High', segment: 'High Recency, High Frequency' },
    { name: 'عبدالله المسارحة', totalSales: 69, totalTransactions: 22, atv: 3.14, avgBasket: 2, avgLifespan: 13, clv: 897.0, clvSegment: 'High', segment: 'High Recency, Low Frequency' },
    { name: 'عبدالله النمر', totalSales: 3, totalTransactions: 1, atv: 3.00, avgBasket: 1, avgLifespan: 0, clv: 0.0, clvSegment: 'Low', segment: 'Low Recency, Low Frequency' },
    { name: 'عبدالله العمري', totalSales: 310, totalTransactions: 115, atv: 2.70, avgBasket: 2, avgLifespan: 12, clv: 3720.0, clvSegment: 'High', segment: 'High Recency, High Frequency' },
    { name: 'عبدالله الرمثان', totalSales: 17, totalTransactions: 11, atv: 1.55, avgBasket: 1, avgLifespan: 0, clv: 0.0, clvSegment: 'Low', segment: 'High Recency, High Frequency' },
    { name: 'عبدالله الشرفات', totalSales: 1195, totalTransactions: 446, atv: 2.68, avgBasket: 2, avgLifespan: 14, clv: 3346.0, clvSegment: 'High', segment: 'High Recency, High Frequency' },
    { name: 'أحمد العواودة', totalSales: 540, totalTransactions: 210, atv: 2.57, avgBasket: 3, avgLifespan: 13, clv: 7020.0, clvSegment: 'High', segment: 'High Recency, High Frequency' },
    { name: 'سامي الخليل', totalSales: 85, totalTransactions: 30, atv: 2.83, avgBasket: 1, avgLifespan: 8, clv: 680.0, clvSegment: 'Medium', segment: 'High Recency, Low Frequency' },
    { name: 'رنا المومني', totalSales: 420, totalTransactions: 160, atv: 2.63, avgBasket: 2, avgLifespan: 14, clv: 5880.0, clvSegment: 'High', segment: 'High Recency, High Frequency' },
    { name: 'خالد الزعبي', totalSales: 22, totalTransactions: 8, atv: 2.75, avgBasket: 1, avgLifespan: 2, clv: 44.0, clvSegment: 'Low', segment: 'Low Recency, Low Frequency' },
    { name: 'نور السلطي', totalSales: 148, totalTransactions: 55, atv: 2.69, avgBasket: 2, avgLifespan: 11, clv: 1628.0, clvSegment: 'High', segment: 'High Recency, High Frequency' },
    { name: 'ليلى حداد', totalSales: 55, totalTransactions: 20, atv: 2.75, avgBasket: 1, avgLifespan: 5, clv: 275.0, clvSegment: 'Medium', segment: 'Low Recency, High Frequency' },
    { name: 'محمود الطراونة', totalSales: 780, totalTransactions: 290, atv: 2.69, avgBasket: 3, avgLifespan: 14, clv: 10920.0, clvSegment: 'High', segment: 'High Recency, High Frequency' },
    { name: 'دينا العزام', totalSales: 11, totalTransactions: 4, atv: 2.75, avgBasket: 1, avgLifespan: 0, clv: 0.0, clvSegment: 'Low', segment: 'Low Recency, Low Frequency' },
];

const maxSales = Math.max(...customers.map(c => c.totalSales));
const maxTrans = Math.max(...customers.map(c => c.totalTransactions));
const maxLife = Math.max(...customers.map(c => c.avgLifespan));
const maxClv = Math.max(...customers.map(c => c.clv));

const fmt2 = (n: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
const fmtN = (n: number) => new Intl.NumberFormat('en-US').format(n);

function clvColor(seg: Customer['clvSegment']) {
    if (seg === 'High') return { text: 'var(--accent-green)', bg: 'var(--accent-green-dim)' };
    if (seg === 'Medium') return { text: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.1)' };
    return { text: 'var(--text-muted)', bg: 'var(--bg-elevated)' };
}

function segmentColor(seg: string) {
    const high = seg.includes('High Recency');
    const freq = seg.includes('High Frequency');
    if (high && freq) return 'var(--accent-green)';
    if (high && !freq) return 'var(--accent-cyan)';
    if (!high && freq) return 'var(--accent-amber)';
    return 'var(--text-muted)';
}

type SortKey = 'name' | 'totalSales' | 'totalTransactions' | 'atv' | 'avgLifespan' | 'clv';

export default function CustomerInsightsTable() {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('totalSales');
    const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return [...customers]
            .filter(c => c.name.includes(q) || c.segment.toLowerCase().includes(q))
            .sort((a, b) => {
                const av = a[sortKey], bv = b[sortKey];
                if (typeof av === 'string' && typeof bv === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
                return sortDir === 'desc' ? (bv as number) - (av as number) : (av as number) - (bv as number);
            });
    }, [search, sortKey, sortDir]);

    const pageData = filtered.slice(page * pageSize, (page + 1) * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    const toggleSort = (k: SortKey) => { if (sortKey === k) setSortDir(d => d === 'desc' ? 'asc' : 'desc'); else { setSortKey(k); setSortDir('desc'); } setPage(0); };

    const SortIcon = ({ k }: { k: SortKey }) => sortKey === k
        ? (sortDir === 'desc' ? <ChevronDown size={10} /> : <ChevronUp size={10} />)
        : <ChevronDown size={10} style={{ opacity: 0.25 }} />;

    const Th = ({ k, label, align = 'right' }: { k?: SortKey; label: string; align?: 'right' | 'center' | 'left' }) => (
        <th onClick={() => k && toggleSort(k)} style={{ padding: '9px 10px', textAlign: align, fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap', cursor: k ? 'pointer' : 'default', userSelect: 'none', background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}
            className={k ? 'hover:bg-white/5 transition-colors' : ''}>
            <div className="flex items-center gap-0.5" style={{ justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}>
                {label}{k && <SortIcon k={k} />}
            </div>
        </th>
    );

    const InlineBar = ({ value, max, color }: { value: number; max: number; color: string }) => (
        <div className="flex items-center gap-1.5">
            <div style={{ width: 44, height: 5, borderRadius: 3, background: 'var(--bg-elevated)', flexShrink: 0, overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(2, (value / max) * 100)}%`, height: '100%', background: color, borderRadius: 3 }} />
            </div>
        </div>
    );

    return (
        <div className="glass-panel overflow-hidden">
            {/* رأس ومحرك البحث */}
            <div className="px-5 py-4 border-b flex items-center justify-between flex-wrap gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
                <div>
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>مصفوفة تحليل العملاء</h3>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Customer Insights — {filtered.length} عميل</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', minWidth: 220 }}>
                    <Search size={13} style={{ color: 'var(--text-muted)' }} />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(0); }}
                        placeholder="بحث باسم العميل..."
                        className="bg-transparent outline-none text-xs w-full"
                        style={{ color: 'var(--text-primary)' }}
                    />
                </div>
            </div>

            {/* الجدول */}
            <div className="overflow-x-auto">
                <table dir="rtl" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <Th label="اسم العميل" k="name" align="right" />
                            <Th label="إجمالي المبيعات" k="totalSales" align="center" />
                            <Th label="عدد المعاملات" k="totalTransactions" align="center" />
                            <Th label="متوسط ATV" k="atv" align="center" />
                            <Th label="متوسط حجم السلة" align="center" />
                            <Th label="متوسط عمر العميل" k="avgLifespan" align="center" />
                            <Th label="قيمة عمر العميل (CLV)" k="clv" align="center" />
                            <Th label="شريحة CLV" align="center" />
                            <Th label="شريحة العميل" align="center" />
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.map((c, i) => {
                            const clvStyle = clvColor(c.clvSegment);
                            return (
                                <motion.tr key={c.name} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                                    className="hover:bg-white/[0.015] transition-colors"
                                    style={{ borderBottom: '1px solid var(--border-subtle)' }}>

                                    {/* الاسم */}
                                    <td style={{ padding: '7px 10px', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{c.name}</td>

                                    {/* المبيعات + شريط */}
                                    <td style={{ padding: '7px 10px' }}>
                                        <div className="flex items-center gap-2 justify-center">
                                            <InlineBar value={c.totalSales} max={maxSales} color="var(--accent-cyan)" />
                                            <span style={{ fontSize: 10, color: 'var(--accent-cyan)', minWidth: 32, textAlign: 'right' }} dir="ltr">{fmtN(c.totalSales)}</span>
                                        </div>
                                    </td>

                                    {/* المعاملات + شريط */}
                                    <td style={{ padding: '7px 10px' }}>
                                        <div className="flex items-center gap-2 justify-center">
                                            <InlineBar value={c.totalTransactions} max={maxTrans} color="var(--accent-blue)" />
                                            <span style={{ fontSize: 10, color: 'var(--accent-blue)', minWidth: 32, textAlign: 'right' }} dir="ltr">{fmtN(c.totalTransactions)}</span>
                                        </div>
                                    </td>

                                    {/* ATV */}
                                    <td style={{ padding: '7px 10px', textAlign: 'center', fontSize: 11, color: 'var(--text-secondary)' }} dir="ltr">{fmt2(c.atv)}</td>

                                    {/* السلة */}
                                    <td style={{ padding: '7px 10px', textAlign: 'center', fontSize: 11, color: 'var(--text-secondary)' }} dir="ltr">{c.avgBasket}</td>

                                    {/* عمر العميل + شريط */}
                                    <td style={{ padding: '7px 10px' }}>
                                        <div className="flex items-center gap-2 justify-center">
                                            <InlineBar value={c.avgLifespan} max={maxLife} color="var(--accent-green)" />
                                            <span style={{ fontSize: 10, color: 'var(--accent-green)', minWidth: 16, textAlign: 'right' }} dir="ltr">{c.avgLifespan}</span>
                                        </div>
                                    </td>

                                    {/* CLV + شريط */}
                                    <td style={{ padding: '7px 10px' }}>
                                        <div className="flex items-center gap-2 justify-center">
                                            {c.clv > 0 && <InlineBar value={c.clv} max={maxClv} color={c.clvSegment === 'High' ? 'var(--accent-green)' : c.clvSegment === 'Medium' ? 'var(--accent-amber)' : 'var(--text-muted)'} />}
                                            <span style={{ fontSize: 10, fontWeight: 600, color: c.clv > 0 ? (c.clvSegment === 'High' ? 'var(--accent-green)' : 'var(--accent-amber)') : 'var(--text-muted)', minWidth: 44, textAlign: 'right' }} dir="ltr">{fmt2(c.clv)}</span>
                                        </div>
                                    </td>

                                    {/* شريحة CLV */}
                                    <td style={{ padding: '7px 10px', textAlign: 'center' }}>
                                        <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: clvStyle.bg, color: clvStyle.text }}>{c.clvSegment}</span>
                                    </td>

                                    {/* شريحة العميل */}
                                    <td style={{ padding: '7px 10px', textAlign: 'center', fontSize: 10, color: segmentColor(c.segment), whiteSpace: 'nowrap' }}>
                                        {c.segment}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)} من {filtered.length} عميل
                </span>
                <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, pi) => (
                        <button key={pi} onClick={() => setPage(pi)}
                            className="w-6 h-6 rounded text-[10px] font-semibold transition-all"
                            style={{ background: pi === page ? 'var(--accent-green-dim)' : 'var(--bg-elevated)', color: pi === page ? 'var(--accent-green)' : 'var(--text-muted)', border: '1px solid', borderColor: pi === page ? 'rgba(0,229,160,0.25)' : 'var(--border-subtle)' }}>
                            {pi + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
