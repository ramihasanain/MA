'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Palette, RotateCcw } from 'lucide-react';
import {
    DEFAULT_ANALYTICS_PALETTE,
    mergeAnalyticsPalette,
    ANALYTICS_PRIMARY_FIELD_META,
    GREEN_SCALE_STEP_LABELS_AR,
} from '@/lib/colors';
import { useAnalyticsPaletteStore } from '@/store/analyticsPaletteStore';

function normalizeHexInput(raw: string): string {
    const t = raw.trim();
    if (!t) return '';
    const withHash = t.startsWith('#') ? t : `#${t}`;
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(withHash) ? withHash : t;
}

export default function ChartColorsPage() {
    const overrides = useAnalyticsPaletteStore((s) => s.overrides);
    const setField = useAnalyticsPaletteStore((s) => s.setField);
    const setGreenScaleStep = useAnalyticsPaletteStore((s) => s.setGreenScaleStep);
    const reset = useAnalyticsPaletteStore((s) => s.reset);

    const merged = useMemo(() => mergeAnalyticsPalette(overrides), [overrides]);

    const previewPrimaries = useMemo(
        () =>
            [
                merged.primaryGreen,
                merged.primaryCyan,
                merged.primaryIndigo,
                merged.primaryAmber,
                merged.primarySlate,
                merged.primaryBlue,
                merged.primaryRed,
                merged.primaryPurple,
            ],
        [merged],
    );

    return (
        <div className="space-y-6 pb-10">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-3 mb-1">
                    <Palette size={24} style={{ color: 'var(--accent-green)' }} />
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>ألوان الرسوم والتحليلات</h1>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    تخصيص ألوان المخططات (ECharts) على الجهاز الحالي. تُحفظ تلقائياً في المتصفح.
                </p>
            </motion.div>

            <div className="glass-panel p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>معاينة سريعة</h2>
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                        style={{
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                        }}
                    >
                        <RotateCcw size={14} />
                        استعادة الافتراضي
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {previewPrimaries.map((c, i) => (
                        <div
                            key={i}
                            title={c}
                            className="rounded-md border shrink-0"
                            style={{
                                width: 36,
                                height: 36,
                                background: c,
                                borderColor: 'var(--border-default)',
                            }}
                        />
                    ))}
                </div>
                <div className="flex flex-wrap gap-1">
                    {merged.greenScale.map((c, i) => (
                        <div
                            key={i}
                            title={c}
                            className="h-8 flex-1 min-w-[40px] max-w-[72px] rounded border"
                            style={{ background: c, borderColor: 'var(--border-subtle)' }}
                        />
                    ))}
                </div>
            </div>

            <div className="glass-panel p-5 space-y-6">
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>الألوان الأساسية</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {ANALYTICS_PRIMARY_FIELD_META.map(({ key, labelAr }) => {
                        const value = merged[key];
                        const def = DEFAULT_ANALYTICS_PALETTE[key];
                        return (
                            <div key={key} className="space-y-2">
                                <label className="block text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    {labelAr}
                                </label>
                                <div className="flex flex-wrap items-center gap-2" dir="ltr">
                                    <input
                                        type="color"
                                        value={value.length === 7 ? value : def}
                                        onChange={(e) => setField(key, e.target.value)}
                                        className="h-9 w-14 cursor-pointer rounded border p-0.5"
                                        style={{ borderColor: 'var(--border-default)', background: 'var(--bg-input)' }}
                                        aria-label={labelAr}
                                    />
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => setField(key, normalizeHexInput(e.target.value))}
                                        className="flex-1 min-w-[120px] px-2 py-1.5 rounded-md text-xs font-mono"
                                        style={{
                                            background: 'var(--bg-input)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)',
                                        }}
                                        spellCheck={false}
                                    />
                                    <span className="text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>
                                        افتراضي: {def}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="glass-panel p-5 space-y-5">
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>تدرج الأخضر (خريطة حرارية ومتسلسلات)</h2>
                <div className="space-y-4">
                    {GREEN_SCALE_STEP_LABELS_AR.map((labelAr, i) => {
                        const value = merged.greenScale[i] ?? DEFAULT_ANALYTICS_PALETTE.greenScale[i];
                        const def = DEFAULT_ANALYTICS_PALETTE.greenScale[i];
                        return (
                            <div key={i} className="space-y-2">
                                <label className="block text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    {labelAr}
                                </label>
                                <div className="flex flex-wrap items-center gap-2" dir="ltr">
                                    <input
                                        type="color"
                                        value={value.length === 7 ? value : def}
                                        onChange={(e) => setGreenScaleStep(i, e.target.value)}
                                        className="h-9 w-14 cursor-pointer rounded border p-0.5"
                                        style={{ borderColor: 'var(--border-default)', background: 'var(--bg-input)' }}
                                        aria-label={labelAr}
                                    />
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => setGreenScaleStep(i, normalizeHexInput(e.target.value))}
                                        className="flex-1 min-w-[120px] px-2 py-1.5 rounded-md text-xs font-mono"
                                        style={{
                                            background: 'var(--bg-input)',
                                            border: '1px solid var(--border-subtle)',
                                            color: 'var(--text-primary)',
                                        }}
                                        spellCheck={false}
                                    />
                                    <span className="text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>
                                        افتراضي: {def}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
