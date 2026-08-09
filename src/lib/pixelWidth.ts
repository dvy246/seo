// Pixel-width measurement for accurate Google SERP truncation.
// Google truncates titles at ~580px and descriptions at ~920px (desktop)
// using a 20px / 16px Roboto-like sans-serif. We measure via canvas.

let canvasCtx: CanvasRenderingContext2D | null = null;

function getCtx(fontSize: number, fontFamily = 'Arial, Helvetica, sans-serif'): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null;
  if (!canvasCtx) {
    const canvas = document.createElement('canvas');
    canvasCtx = canvas.getContext('2d');
  }
  if (canvasCtx) {
    canvasCtx.font = `${fontSize}px ${fontFamily}`;
  }
  return canvasCtx;
}

export function measureTextWidth(text: string, fontSize: number): number {
  const ctx = getCtx(fontSize);
  if (!ctx) return text.length * fontSize * 0.5; // fallback
  return ctx.measureText(text).width;
}

// Google desktop: title max ~580px at 20px font, description max ~920px at 16px font
export const TITLE_MAX_PX = 580;
export const DESC_MAX_PX = 920;
const TITLE_FONT = 20;
const DESC_FONT = 16;

export interface TruncationResult {
  text: string;
  truncated: boolean;
  width: number;
  maxPx: number;
}

export function truncateToPixelWidth(text: string, maxPx: number, fontSize: number): TruncationResult {
  const trimmed = text.trim();
  if (!trimmed) return { text: '', truncated: false, width: 0, maxPx };

  const fullWidth = measureTextWidth(trimmed, fontSize);
  if (fullWidth <= maxPx) {
    return { text: trimmed, truncated: false, width: fullWidth, maxPx };
  }

  // Binary search for the truncation point — account for the ellipsis width
  const ellipsis = '…';
  const ellipsisWidth = measureTextWidth(ellipsis, fontSize);
  const targetWidth = maxPx - ellipsisWidth;

  let lo = 0;
  let hi = trimmed.length;
  let bestSlice = '';

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const slice = trimmed.slice(0, mid);
    const w = measureTextWidth(slice, fontSize);
    if (w <= targetWidth) {
      bestSlice = slice;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  // Try to break at a word boundary near the truncation point
  let result = bestSlice;
  if (result.length < trimmed.length) {
    const lastSpace = result.lastIndexOf(' ');
    if (lastSpace > result.length * 0.6) {
      result = result.slice(0, lastSpace);
    }
    result = result + ellipsis;
  }

  return {
    text: result,
    truncated: true,
    width: measureTextWidth(result, fontSize),
    maxPx,
  };
}

export function truncateTitle(title: string): TruncationResult {
  return truncateToPixelWidth(title, TITLE_MAX_PX, TITLE_FONT);
}

export function truncateDescription(desc: string): TruncationResult {
  return truncateToPixelWidth(desc, DESC_MAX_PX, DESC_FONT);
}
