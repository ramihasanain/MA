/**
 * ECharts: three stacked category x-axes for month drill — months, then 4 quarters
 * (each band aligns with 3 months), then a single year band centered on the full width.
 */
export type BuildMonthQuarterYearXAxesParams = {
    months: string[];
    year: string;
    quarterLabels?: readonly [string, string, string, string];
};

export function buildMonthQuarterYearXAxes(params: BuildMonthQuarterYearXAxesParams): Record<string, unknown>[] {
    const q = params.quarterLabels ?? (['الربع 1', 'الربع 2', 'الربع 3', 'الربع 4'] as const);
    return [
        {
            type: 'category',
            position: 'bottom',
            data: params.months,
            axisLabel: { interval: 0, fontSize: 10 },
            axisTick: { alignWithLabel: true },
        },
        {
            type: 'category',
            position: 'bottom',
            offset: 28,
            data: [...q],
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { interval: 0, fontSize: 10, fontWeight: 500 },
        },
        {
            type: 'category',
            position: 'bottom',
            offset: 52,
            data: [params.year],
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { interval: 0, fontSize: 10, fontWeight: 600 },
        },
    ];
}

/** Same stacking pattern as single-year helper, for 36 months (3×12): 12 quarter bands, 3 year bands. */
export type BuildThreeYearMonthQuarterYearXAxesParams = {
    monthNames: string[];
    /** Exactly three years, oldest first (e.g. ['2023','2024','2025']). */
    years: readonly [string, string, string];
};

export function buildThreeYearMonthQuarterYearXAxes(params: BuildThreeYearMonthQuarterYearXAxesParams): Record<string, unknown>[] {
    const [y0, y1, y2] = params.years;
    const monthRow = [y0, y1, y2].flatMap((y) => params.monthNames.map((m) => `${m} ${y.slice(2)}`));
    const quarterRow = [y0, y1, y2].flatMap((y) => [
        `الربع 1 ${y}`,
        `الربع 2 ${y}`,
        `الربع 3 ${y}`,
        `الربع 4 ${y}`,
    ]);
    return [
        {
            type: 'category',
            position: 'bottom',
            data: monthRow,
            axisLabel: { interval: 0, fontSize: 8, rotate: 40 },
            axisTick: { alignWithLabel: true },
        },
        {
            type: 'category',
            position: 'bottom',
            offset: 40,
            data: quarterRow,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { interval: 0, fontSize: 9, fontWeight: 500 },
        },
        {
            type: 'category',
            position: 'bottom',
            offset: 64,
            data: [y0, y1, y2],
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { interval: 0, fontSize: 10, fontWeight: 600 },
        },
    ];
}
