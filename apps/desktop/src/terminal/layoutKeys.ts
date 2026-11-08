// xterm.js derives Ctrl+letter / Alt+letter input from `KeyboardEvent.key` /
// `keyCode`, which follow the active layout. With a non-Latin layout (Russian,
// Persian, Arabic, Greek, …) those are not A–Z, so Ctrl+C, Ctrl+D, Ctrl+R,
// Alt+B … silently do nothing. The physical key (`code`) is layout-independent,
// so for those events we build the bytes ourselves.

const LETTER = /^Key([A-Z])$/;

/** A plain Latin letter/digit/punctuation key the layout itself reports. */
const isAsciiKey = (key: string) => key.length === 1 && key.charCodeAt(0) < 0x80;

const CTRL_PUNCT: Record<string, string> = {
  BracketLeft: "\x1b", // Ctrl+[
  Backslash: "\x1c", // Ctrl+\
  BracketRight: "\x1d", // Ctrl+]
};

/**
 * Bytes to send for a Ctrl+key or Alt+key chord typed on a layout whose `key`
 * is not ASCII, or null when xterm already handles the event correctly.
 * `ctrlKey` is the physical Control key (also on macOS, where ⌘ is separate).
 */
export function layoutIndependentInput(ev: KeyboardEvent): string | null {
  if (ev.metaKey || isAsciiKey(ev.key)) return null;
  // Dead keys, IME composition and Alt-Gr (reported as Ctrl+Alt) are text input.
  if (ev.isComposing || ev.key === "Dead" || ev.key === "Process") return null;
  if (ev.ctrlKey && ev.altKey) return null;
  const letter = LETTER.exec(ev.code)?.[1];
  if (ev.ctrlKey && !ev.shiftKey) {
    if (letter) return String.fromCharCode(letter.charCodeAt(0) - 64);
    return CTRL_PUNCT[ev.code] ?? null;
  }
  if (ev.altKey && !ev.ctrlKey && letter) {
    return "\x1b" + (ev.shiftKey ? letter : letter.toLowerCase());
  }
  return null;
}
