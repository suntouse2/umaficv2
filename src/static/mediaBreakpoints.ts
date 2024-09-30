const breakpoints = {
  sm: 540,
  md: 668,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoints = typeof breakpoints;

export default function getBreakpoints(withPx: true): { [K in keyof Breakpoints]: string };
export default function getBreakpoints(withPx: false): { [K in keyof Breakpoints]: number };
export default function getBreakpoints(withPx: boolean): { [K in keyof Breakpoints]: string | number } {
  if (withPx) {
    return Object.fromEntries(Object.entries(breakpoints).map(([key, value]) => [key, `${value}px`])) as { [K in keyof Breakpoints]: string };
  } else {
    return breakpoints;
  }
}
