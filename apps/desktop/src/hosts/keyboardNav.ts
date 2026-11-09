import type { KeyboardEvent } from "react";

/**
 * Next highlighted row for ArrowDown (`step` 1) / ArrowUp (-1) in a list of
 * `count` rows. Wraps around; with nothing highlighted (`active < 0`) Down picks
 * the first row and Up the last.
 */
export function stepIndex(active: number, count: number, step: 1 | -1): number {
  if (count <= 0) return -1;
  if (active < 0) return step > 0 ? 0 : count - 1;
  return (active + step + count) % count;
}

/** Marks a focusable host/group item; arrow keys move between items in document order. */
export const HOST_ITEM_ATTR = "data-host-item";

function items(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(`[${HOST_ITEM_ATTR}]`));
}

/** Focus the first host/group item (ArrowDown from the search field). */
export function focusFirstHostItem(): boolean {
  const first = items()[0];
  if (!first) return false;
  first.focus();
  return true;
}

/**
 * Keyboard handling for one item: Enter/Space open it, arrows move focus to
 * the neighbouring item (Up/Down also Left/Right, so both the grid and the
 * list behave), Home/End jump to the ends. Returns true when handled.
 */
export function hostItemKeyDown(e: KeyboardEvent<HTMLElement>, open: () => void): boolean {
  if (e.target !== e.currentTarget) return false;
  const all = items();
  const i = all.indexOf(e.currentTarget);
  let next: HTMLElement | undefined;
  switch (e.key) {
    case "Enter":
    case " ":
      e.preventDefault();
      open();
      return true;
    case "ArrowDown":
    case "ArrowRight":
      next = all[i + 1];
      break;
    case "ArrowUp":
    case "ArrowLeft":
      next = all[i - 1];
      break;
    case "Home":
      next = all[0];
      break;
    case "End":
      next = all[all.length - 1];
      break;
    default:
      return false;
  }
  e.preventDefault();
  next?.focus();
  return true;
}

/** Visible focus ring for items that are not buttons (table rows, cards). */
export const hostItemFocusSx = {
  "&:focus-visible": {
    outline: "2px solid",
    outlineColor: "primary.main",
    outlineOffset: "-2px",
  },
} as const;
