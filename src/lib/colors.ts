// Core color palette for the analytics system
// Centralize all brand and chart colors here so they can be reused consistently.
// Runtime customization: use useResolvedAnalyticsPalette() + analyticsPaletteStore (persisted).

const GREEN_SCALE_DEFAULT = [
    '#bbf7d0',
    '#86efac',
    '#4ade80',
    '#22c55e',
    '#16a34a',
    '#166534',
] as const;

/** Full merged palette (camelCase) for charts and hooks */
export type AnalyticsPalette = {
    primaryGreen: string;
    primaryCyan: string;
    primaryIndigo: string;
    primaryAmber: string;
    primarySlate: string;
    primaryBlue: string;
    primaryRed: string;
    primaryPurple: string;
    labelColor: string;
    greenScale: readonly string[];
};

/** Shape of user overrides (same keys, partial) */
export type AnalyticsPaletteOverrides = Partial<
    Omit<AnalyticsPalette, 'greenScale'> & { greenScale?: Partial<Record<number, string>> | string[] }
>;

export const DEFAULT_ANALYTICS_PALETTE: AnalyticsPalette = {
    primaryGreen: '#22c55e',
    primaryCyan: '#0ea5e9',
    primaryIndigo: '#6366f1',
    primaryAmber: '#f59e0b',
    primarySlate: '#94a3b8',
    primaryBlue: '#3b82f6',
    primaryRed: '#ef4444',
    primaryPurple: '#a855f7',
    labelColor: '#334155',
    greenScale: [...GREEN_SCALE_DEFAULT],
};

/** UI labels for the chart palette settings page (Arabic) */
export const ANALYTICS_PRIMARY_FIELD_META: {
    key: keyof Omit<AnalyticsPalette, 'greenScale'>;
    labelAr: string;
}[] = [
    { key: 'primaryGreen', labelAr: 'أخضر أساسي — نجاح / إيجابي' },
    { key: 'primaryCyan', labelAr: 'سماوي — تمييز ثانوي' },
    { key: 'primaryIndigo', labelAr: 'نيلي — سلسلة ثالثة' },
    { key: 'primaryAmber', labelAr: 'كهرماني — تحذير / تمييز' },
    { key: 'primarySlate', labelAr: 'رمادي محايد — مقارنات' },
    { key: 'primaryBlue', labelAr: 'أزرق — أعمدة / معلومات' },
    { key: 'primaryRed', labelAr: 'أحمر — سلبي / خطأ' },
    { key: 'primaryPurple', labelAr: 'بنفسجي — تمييز إضافي' },
    { key: 'labelColor', labelAr: 'لون المحاور والنصوص المساعدة' },
];

export const GREEN_SCALE_STEP_LABELS_AR = [
    'تدرج أخضر ١ (الأفتح)',
    'تدرج أخضر ٢',
    'تدرج أخضر ٣',
    'تدرج أخضر ٤',
    'تدرج أخضر ٥',
    'تدرج أخضر ٦ (الأدكن)',
] as const;

function isValidHexColor(s: string): boolean {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(s.trim());
}

function mergeGreenScale(
    defaults: readonly string[],
    override?: Partial<Record<number, string>> | string[],
): string[] {
    const out = [...defaults];
    if (!override) return out;
    if (Array.isArray(override)) {
        for (let i = 0; i < out.length; i++) {
            const v = override[i];
            if (v && isValidHexColor(v)) out[i] = v.trim();
        }
        return out;
    }
    for (let i = 0; i < out.length; i++) {
        const v = override[i];
        if (v && isValidHexColor(v)) out[i] = v.trim();
    }
    return out;
}

/** Merge persisted overrides with defaults; invalid hex falls back to default */
export function mergeAnalyticsPalette(overrides: AnalyticsPaletteOverrides | null | undefined): AnalyticsPalette {
    const d = DEFAULT_ANALYTICS_PALETTE;
    const o = overrides ?? {};
    const pick = (key: keyof Omit<AnalyticsPalette, 'greenScale'>, def: string) => {
        const v = o[key];
        return typeof v === 'string' && isValidHexColor(v) ? v.trim() : def;
    };
    return {
        primaryGreen: pick('primaryGreen', d.primaryGreen),
        primaryCyan: pick('primaryCyan', d.primaryCyan),
        primaryIndigo: pick('primaryIndigo', d.primaryIndigo),
        primaryAmber: pick('primaryAmber', d.primaryAmber),
        primarySlate: pick('primarySlate', d.primarySlate),
        primaryBlue: pick('primaryBlue', d.primaryBlue),
        primaryRed: pick('primaryRed', d.primaryRed),
        primaryPurple: pick('primaryPurple', d.primaryPurple),
        labelColor: pick('labelColor', d.labelColor),
        greenScale: mergeGreenScale(d.greenScale, o.greenScale as Partial<Record<number, string>> | string[] | undefined),
    };
}

export function paletteToCOLORS(p: AnalyticsPalette): Record<PrimaryColor, string> {
    return {
        primaryGreen: p.primaryGreen,
        primaryCyan: p.primaryCyan,
        primaryIndigo: p.primaryIndigo,
        primaryAmber: p.primaryAmber,
        primarySlate: p.primarySlate,
        primaryBlue: p.primaryBlue,
        primaryRed: p.primaryRed,
        primaryPurple: p.primaryPurple,
    };
}

// ── Default exports (same as DEFAULT_ANALYTICS_PALETTE) for static imports / SSR ──

export const PRIMARY_GREEN = DEFAULT_ANALYTICS_PALETTE.primaryGreen;
export const PRIMARY_CYAN = DEFAULT_ANALYTICS_PALETTE.primaryCyan;
export const PRIMARY_INDIGO = DEFAULT_ANALYTICS_PALETTE.primaryIndigo;
export const PRIMARY_AMBER = DEFAULT_ANALYTICS_PALETTE.primaryAmber;
export const PRIMARY_SLATE = DEFAULT_ANALYTICS_PALETTE.primarySlate;
export const PRIMARY_BLUE = DEFAULT_ANALYTICS_PALETTE.primaryBlue;
export const PRIMARY_RED = DEFAULT_ANALYTICS_PALETTE.primaryRed;
export const PRIMARY_PURPLE = DEFAULT_ANALYTICS_PALETTE.primaryPurple;

export const LABEL_COLOR = DEFAULT_ANALYTICS_PALETTE.labelColor;

export const GREEN_SCALE = [...DEFAULT_ANALYTICS_PALETTE.greenScale] as readonly string[];

export type PrimaryColor =
    | 'primaryGreen'
    | 'primaryCyan'
    | 'primaryIndigo'
    | 'primaryAmber'
    | 'primarySlate'
    | 'primaryBlue'
    | 'primaryRed'
    | 'primaryPurple';

export const COLORS: Record<PrimaryColor, string> = paletteToCOLORS(DEFAULT_ANALYTICS_PALETTE);
