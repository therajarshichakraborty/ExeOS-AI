/**
 * Accent tones. The palette is deliberately restrained: graphite surfaces with
 * a single jade accent, so every key still resolves to the same calm style.
 * Kept as a map so call sites stay readable and the look can be tuned here.
 */
const NEUTRAL = {
  tile: "bg-muted text-foreground ring-1 ring-border",
  solid: "bg-foreground text-background",
  text: "text-muted-foreground",
  ring: "hover:border-foreground/20",
  glow: "bg-brand/10",
  hoverTile:
    "group-hover:bg-foreground group-hover:text-background group-hover:ring-foreground group-hover/spot:bg-foreground group-hover/spot:text-background group-hover/spot:ring-foreground",
} as const;

const ACCENT = {
  tile: "bg-brand/10 text-brand ring-1 ring-brand/15",
  solid: "bg-brand text-brand-foreground",
  text: "text-brand",
  ring: "hover:border-brand/30",
  glow: "bg-brand/15",
  hoverTile:
    "group-hover:bg-brand group-hover:text-brand-foreground group-hover/spot:bg-brand group-hover/spot:text-brand-foreground",
} as const;

export const TONES = {
  emerald: ACCENT,
  violet: NEUTRAL,
  amber: NEUTRAL,
  sky: NEUTRAL,
  rose: NEUTRAL,
  teal: NEUTRAL,
} as const;

export type Tone = keyof typeof TONES;

export const TONE_CYCLE: Tone[] = ["violet", "sky", "amber", "teal", "rose", "emerald"];
