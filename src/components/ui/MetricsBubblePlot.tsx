'use client';

import React, { useId, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export type MetricsBubblePoint = {
    key: string;
    label: string;
    depth: 0 | 1 | 2;
    xValue: number;
    yValue: number;
    hasChildren: boolean;
    open?: boolean;
    onClick?: () => void;
    vol: number;
    price: number;
    basket: number;
    atv: number;
};

function fk(v: number) {
    return v >= 1000 ? `${(v / 1000).toFixed(1)}K` : `${v}`;
}

function normalizeAxis(values: number[], pad: number) {
    const mn = Math.min(...values);
    const mx = Math.max(...values);
    if (mx === mn) {
        return {
            min: mn,
            max: mx,
            toXPct: () => 50,
            toYPct: () => 50,
        };
    }
    const norm = (v: number) => (v - mn) / (mx - mn);
    return {
        min: mn,
        max: mx,
        toXPct: (v: number) => pad + norm(v) * (100 - 2 * pad),
        toYPct: (v: number) => pad + (1 - norm(v)) * (100 - 2 * pad),
    };
}

function depthColor(depth: 0 | 1 | 2, variant: 'blue' | 'green') {
    if (variant === 'blue') {
        if (depth === 0) return '#2563eb';
        if (depth === 1) return '#3b82f6';
        return '#60a5fa';
    }
    if (depth === 0) return '#00e5a0';
    if (depth === 1) return '#34d399';
    return '#6ee7b7';
}

function baseSize(depth: 0 | 1 | 2) {
    if (depth === 0) return 18;
    if (depth === 1) return 14;
    return 10;
}

const Y_TICK_COUNT = 5;

function yTickValues(min: number, max: number): number[] {
    if (min === max) return [min];
    return Array.from({ length: Y_TICK_COUNT }, (_, i) => min + ((max - min) * i) / (Y_TICK_COUNT - 1));
}

/** Tick text: K for large volumes, else compact decimal (matches bar-chart style labels). */
function formatYTick(v: number) {
    const a = Math.abs(v);
    if (a >= 1000) return fk(v);
    if (a >= 100) return Math.round(v).toLocaleString('en-US');
    return Number.isInteger(v) ? `${v}` : v.toFixed(1);
}

export type MetricsBubblePlotProps = {
    points: MetricsBubblePoint[];
    xLabel: string;
    yLabel: string;
    /** Dot / accent palette */
    variant: 'blue' | 'green';
    plotHeight?: number;
};

export default function MetricsBubblePlot({ points, xLabel, yLabel, variant, plotHeight = 400 }: MetricsBubblePlotProps) {
    const uid = useId().replace(/:/g, '');
    const gridId = `mbp-grid-${uid}`;
    const [selected, setSelected] = useState<MetricsBubblePoint | null>(null);
    const [hovered, setHovered] = useState<string | null>(null);

    const { positioned, xAxisMeta, yAxisMeta, yScale } = useMemo(() => {
        if (points.length === 0) {
            return {
                positioned: [] as (MetricsBubblePoint & { leftPct: number; topPct: number })[],
                xAxisMeta: { min: 0, max: 0 },
                yAxisMeta: { min: 0, max: 0 },
                yScale: normalizeAxis([0, 0], 12),
            };
        }
        const xs = points.map((p) => p.xValue);
        const ys = points.map((p) => p.yValue);
        const xAxis = normalizeAxis(xs, 10);
        const yAxis = normalizeAxis(ys, 12);
        const xAxisMeta = { min: Math.min(...xs), max: Math.max(...xs) };
        const yAxisMeta = { min: Math.min(...ys), max: Math.max(...ys) };
        return {
            positioned: points.map((p) => ({
                ...p,
                leftPct: xAxis.toXPct(p.xValue),
                topPct: yAxis.toYPct(p.yValue),
            })),
            xAxisMeta,
            yAxisMeta,
            yScale: yAxis,
        };
    }, [points]);

    const yTicks = useMemo(() => yTickValues(yAxisMeta.min, yAxisMeta.max), [yAxisMeta.min, yAxisMeta.max]);

    const handlePointClick = (p: MetricsBubblePoint) => {
        if (p.hasChildren && p.onClick) p.onClick();
        setSelected(p);
    };

    return (
        <div className="flex flex-col overflow-hidden">
            <div className="relative flex flex-col xl:flex-row" style={{ minHeight: plotHeight }}>
            <div
                className="relative flex-1 overflow-hidden flex"
                style={{ height: plotHeight }}
                dir="ltr"
            >
                {/* Y axis title — LTR row so axis stays on the physical left under page RTL */}
                <div
                    className="shrink-0 flex items-center justify-center pointer-events-none z-5"
                    style={{ width: 22, color: 'var(--text-muted)' }}
                >
                    <span
                        className="text-[9px] font-semibold whitespace-nowrap"
                        style={{ transform: 'rotate(-90deg)' }}
                    >
                        {yLabel}
                    </span>
                </div>

                <div
                    className="flex flex-1 min-w-0 min-h-0"
                    style={{ paddingTop: 8, paddingBottom: 28, paddingRight: 8 }}
                >
                    {/* Y-axis tick column (same vertical scale as plot) */}
                    <div className="relative shrink-0 w-9 self-stretch">
                        {yTicks.map((t) => {
                            const yPct = yScale.toYPct(t);
                            return (
                                <div
                                    key={`yl-${t}`}
                                    className="absolute text-[8px] font-medium tabular-nums pointer-events-none left-0 right-0 pr-0.5"
                                    style={{
                                        color: 'var(--text-muted)',
                                        top: `${yPct}%`,
                                        transform: 'translateY(-50%)',
                                        textAlign: 'right',
                                        lineHeight: 1,
                                    }}
                                    dir="ltr"
                                >
                                    {formatYTick(t)}
                                </div>
                            );
                        })}
                    </div>

                    {/* Plot area: grid, horizontal layers, bubbles */}
                    <div
                        className="relative flex-1 min-w-0 min-h-0"
                        style={{
                            background: 'radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.03) 0%, transparent 70%)',
                        }}
                    >
                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.07, zIndex: 0 }}>
                        <defs>
                            <pattern id={gridId} width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
                    </svg>

                    <svg
                        width="100%"
                        height="100%"
                        style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }}
                        preserveAspectRatio="none"
                    >
                        {yTicks.map((t) => {
                            const yPct = yScale.toYPct(t);
                            return (
                                <line
                                    key={`y-${t}`}
                                    x1="0%"
                                    y1={`${yPct}%`}
                                    x2="100%"
                                    y2={`${yPct}%`}
                                    stroke="var(--border-subtle)"
                                    strokeWidth={1}
                                    strokeOpacity={0.85}
                                    vectorEffect="non-scaling-stroke"
                                />
                            );
                        })}
                    </svg>

                    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.05, zIndex: 0, pointerEvents: 'none' }}>
                        {[50, 100, 150].map((r) => (
                            <circle key={r} cx="50%" cy="50%" r={r} fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="4 4" />
                        ))}
                    </svg>

                    {positioned.map((p) => {
                        const isSel = selected?.key === p.key;
                        const isHov = hovered === p.key;
                        const color = depthColor(p.depth, variant);
                        const sz = baseSize(p.depth) + (isSel ? 4 : 0) + (isHov ? 2 : 0);

                        return (
                            <div
                                key={p.key}
                                style={{
                                    position: 'absolute',
                                    left: `${p.leftPct}%`,
                                    top: `${p.topPct}%`,
                                    transform: 'translate(-50%, -50%)',
                                    cursor: p.hasChildren ? 'pointer' : 'pointer',
                                    zIndex: isSel ? 30 : isHov ? 20 : 15,
                                }}
                                onClick={() => handlePointClick(p)}
                                onMouseEnter={() => setHovered(p.key)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                {(isSel || isHov) && (
                                    <motion.div
                                        animate={{ scale: [1, 1.8, 1], opacity: [0.45, 0, 0.45] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        style={{
                                            position: 'absolute',
                                            width: sz,
                                            height: sz,
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%,-50%)',
                                            borderRadius: '50%',
                                            background: color,
                                        }}
                                    />
                                )}

                                <motion.div
                                    animate={{ width: sz, height: sz }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    style={{
                                        width: sz,
                                        height: sz,
                                        borderRadius: '50%',
                                        background: color,
                                        border: isSel ? '3px solid white' : p.open ? `2px dashed rgba(255,255,255,0.85)` : `2px solid ${color}`,
                                        boxShadow: `0 0 ${isSel ? 14 : 6}px ${color}55`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    {isSel && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'white' }} />}
                                </motion.div>

                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        marginTop: 4,
                                        maxWidth: 120,
                                        textAlign: 'center',
                                        fontSize: 8,
                                        fontWeight: 600,
                                        color: isSel ? color : 'var(--text-muted)',
                                        background: 'var(--bg-surface)',
                                        padding: '1px 4px',
                                        borderRadius: 3,
                                        border: isSel ? `1px solid ${color}44` : 'none',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {p.label.length > 18 ? `${p.label.slice(0, 16)}…` : p.label}
                                </div>
                            </div>
                        );
                    })}
                    </div>
                </div>

                {/* X axis label + range (aligned under plot area only) */}
                <div
                    className="absolute bottom-1 flex justify-center items-center gap-3 text-[9px] px-2"
                    style={{ left: 22 + 36, right: 8, color: 'var(--text-muted)' }}
                    dir="ltr"
                >
                    <span>{formatYTick(xAxisMeta.min)}</span>
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        {xLabel}
                    </span>
                    <span>{formatYTick(xAxisMeta.max)}</span>
                </div>
            </div>

            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0, x: 24, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: 232 }}
                        exit={{ opacity: 0, x: 24, width: 0 }}
                        className="shrink-0 border-t xl:border-t-0 xl:border-s overflow-hidden"
                        style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)' }}
                    >
                        <div style={{ width: 232, minHeight: 200 }} className="flex flex-col">
                            <div className="flex items-start justify-between gap-2 px-3 py-2.5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                                        {selected.label}
                                    </p>
                                    <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                        {selected.depth === 0 ? 'فرع' : selected.depth === 1 ? 'فئة' : 'منتج'}
                                    </p>
                                </div>
                                <button type="button" onClick={() => setSelected(null)} className="shrink-0 p-0.5" style={{ color: 'var(--text-muted)' }}>
                                    <X size={14} />
                                </button>
                            </div>
                            <div className="px-3 py-2 space-y-2 text-[11px]">
                                <div className="flex justify-between gap-2">
                                    <span style={{ color: 'var(--text-muted)' }}>الحجم</span>
                                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }} dir="ltr">
                                        {fk(selected.vol)}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span style={{ color: 'var(--text-muted)' }}>م. السعر</span>
                                    <span className="font-semibold" style={{ color: 'var(--accent-blue)' }} dir="ltr">
                                        {selected.price.toFixed(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span style={{ color: 'var(--text-muted)' }}>السلة</span>
                                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }} dir="ltr">
                                        {selected.basket.toFixed(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span style={{ color: 'var(--text-muted)' }}>ATV</span>
                                    <span className="font-semibold" style={{ color: 'var(--accent-green)' }} dir="ltr">
                                        {selected.atv.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                            {selected.hasChildren && (
                                <p className="px-3 pb-2 text-[9px]" style={{ color: 'var(--text-muted)' }}>
                                    انقر على الدائرة لتوسيع أو طي المستوى
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>

            <div
                className="flex flex-wrap items-center gap-3 px-4 py-2 border-t text-[9px]"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
            >
                <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    المستوى:
                </span>
                {(
                    [
                        { label: 'فرع', d: 0 as const },
                        { label: 'فئة', d: 1 as const },
                        { label: 'منتج', d: 2 as const },
                    ] as const
                ).map(({ label, d }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <div
                            style={{
                                width: 8 + d * 2,
                                height: 8 + d * 2,
                                borderRadius: '50%',
                                background: depthColor(d, variant),
                            }}
                        />
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
