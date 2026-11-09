import { describe, expect, it } from "vitest";
import { stepIndex } from "./keyboardNav";

describe("stepIndex", () => {
  it("moves down and up one row", () => {
    expect(stepIndex(0, 3, 1)).toBe(1);
    expect(stepIndex(2, 3, -1)).toBe(1);
  });
  it("wraps around at both ends", () => {
    expect(stepIndex(2, 3, 1)).toBe(0);
    expect(stepIndex(0, 3, -1)).toBe(2);
  });
  it("starts from the first row on Down and the last on Up when nothing is highlighted", () => {
    expect(stepIndex(-1, 4, 1)).toBe(0);
    expect(stepIndex(-1, 4, -1)).toBe(3);
  });
  it("has nothing to pick in an empty list", () => {
    expect(stepIndex(-1, 0, 1)).toBe(-1);
    expect(stepIndex(0, 0, -1)).toBe(-1);
  });
});
