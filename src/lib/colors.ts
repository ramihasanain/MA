// Core color palette for the analytics system
// Centralize all brand and chart colors here so they can be reused consistently.

// Primary accent colors
export const PRIMARY_GREEN = '#22c55e'; // success / positive
export const PRIMARY_CYAN = '#0ea5e9';  // cyan accent
export const PRIMARY_INDIGO = '#6366f1'; // indigo / tertiary accent
export const PRIMARY_AMBER = '#f59e0b';  // warning / highlight
export const PRIMARY_SLATE = '#94a3b8';  // neutral / muted
export const PRIMARY_BLUE = '#3b82f6';   // brand blue for series / bars
export const PRIMARY_RED = '#ef4444';    // error / negative
export const PRIMARY_PURPLE = '#a855f7'; // complementary accent

// Label / axis / lines color
export const LABEL_COLOR = '#334155';

// Green ramp for sequential data (light → dark)
export const GREEN_SCALE = [
  '#bbf7d0',
  '#86efac',
  '#4ade80',
  '#22c55e',
  '#16a34a',
  '#166534',
] as const;

export type PrimaryColor =
  | 'primaryGreen'
  | 'primaryCyan'
  | 'primaryIndigo'
  | 'primaryAmber'
  | 'primarySlate'
  | 'primaryBlue'
  | 'primaryRed'
  | 'primaryPurple';

export const COLORS: Record<PrimaryColor, string> = {
  primaryGreen: PRIMARY_GREEN,
  primaryCyan: PRIMARY_CYAN,
  primaryIndigo: PRIMARY_INDIGO,
  primaryAmber: PRIMARY_AMBER,
  primarySlate: PRIMARY_SLATE,
  primaryBlue: PRIMARY_BLUE,
  primaryRed: PRIMARY_RED,
  primaryPurple: PRIMARY_PURPLE,
};

