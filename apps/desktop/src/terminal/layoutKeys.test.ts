import { describe, expect, it } from "vitest";
import { layoutIndependentInput } from "./layoutKeys";

const ev = (o: Partial<KeyboardEvent>) =>
  ({
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    isComposing: false,
    key: "",
    code: "",
    ...o,
  }) as KeyboardEvent;

describe("layoutIndependentInput", () => {
  it("maps Ctrl+C on a Cyrillic layout to ETX", () => {
    expect(layoutIndependentInput(ev({ ctrlKey: true, key: "с", code: "KeyC" }))).toBe("\x03");
  });
  it("maps Ctrl+D / Ctrl+R on a Persian layout", () => {
    expect(layoutIndependentInput(ev({ ctrlKey: true, key: "ی", code: "KeyD" }))).toBe("\x04");
    expect(layoutIndependentInput(ev({ ctrlKey: true, key: "ق", code: "KeyR" }))).toBe("\x12");
  });
  it("leaves Latin layouts to xterm", () => {
    expect(layoutIndependentInput(ev({ ctrlKey: true, key: "c", code: "KeyC" }))).toBeNull();
  });
  it("maps Alt+letter to ESC-prefixed", () => {
    expect(layoutIndependentInput(ev({ altKey: true, key: "и", code: "KeyB" }))).toBe("\x1bb");
    expect(
      layoutIndependentInput(ev({ altKey: true, shiftKey: true, key: "И", code: "KeyB" })),
    ).toBe("\x1bB");
  });
  it("ignores Alt-Gr, dead keys, composition and Ctrl+Shift", () => {
    expect(
      layoutIndependentInput(ev({ ctrlKey: true, altKey: true, key: "с", code: "KeyC" })),
    ).toBeNull();
    expect(layoutIndependentInput(ev({ ctrlKey: true, key: "Dead", code: "KeyC" }))).toBeNull();
    expect(
      layoutIndependentInput(ev({ ctrlKey: true, key: "с", code: "KeyC", isComposing: true })),
    ).toBeNull();
    expect(
      layoutIndependentInput(ev({ ctrlKey: true, shiftKey: true, key: "С", code: "KeyC" })),
    ).toBeNull();
  });
});
