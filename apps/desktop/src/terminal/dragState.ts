// What the user is dragging between tabs and panes right now. HTML5 drag events
// cannot read `dataTransfer` data while hovering, so drop targets (tabs, pane
// overlays) consult this instead.

import { createStore, useStore } from "@/lib/store";
import type { Uuid } from "@/ipc/types";

export type SessionDrag = { kind: "tab"; id: string } | { kind: "pane"; id: Uuid };

export const dragStore = createStore<{ drag: SessionDrag | null }>({ drag: null });

export const useSessionDrag = () => useStore(dragStore, (s) => s.drag);

export function setSessionDrag(drag: SessionDrag | null) {
  dragStore.set({ drag });
}

// A drop can unmount the element that started the drag, so `dragend` may never
// reach it; clear the state at the window instead (after the target's own handler).
if (typeof window !== "undefined") {
  window.addEventListener("dragend", () => setSessionDrag(null));
  window.addEventListener("drop", () => setSessionDrag(null));
}
