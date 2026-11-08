import { describe, expect, it } from "vitest";
import { insertBeside, leaf, leaves, nearestSide, removeLeaf, type SplitNode } from "./layout";

describe("insertBeside", () => {
  it("puts the piece after the target on the right / below", () => {
    const t = insertBeside(leaf("a"), "a", leaf("b"), "right", "s1");
    expect(t).toMatchObject({ kind: "split", direction: "row", ratio: 0.5 });
    expect(leaves(t)).toEqual(["a", "b"]);
    expect(leaves(insertBeside(leaf("a"), "a", leaf("b"), "down", "s1"))).toEqual(["a", "b"]);
  });
  it("puts the piece before the target on the left / above", () => {
    const t = insertBeside(leaf("a"), "a", leaf("b"), "left", "s1");
    expect(leaves(t)).toEqual(["b", "a"]);
    expect(t).toMatchObject({ direction: "row" });
    expect(insertBeside(leaf("a"), "a", leaf("b"), "up", "s1")).toMatchObject({
      direction: "column",
    });
  });
  it("works deep in a tree and takes whole sub-trees", () => {
    const tree: SplitNode = {
      kind: "split",
      id: "r",
      direction: "row",
      ratio: 0.5,
      first: leaf("a"),
      second: leaf("b"),
    };
    const sub = insertBeside(leaf("c"), "c", leaf("d"), "right", "s2");
    expect(leaves(insertBeside(tree, "b", sub, "down", "s3"))).toEqual(["a", "b", "c", "d"]);
  });
  it("leaves the tree alone when the target is missing", () => {
    const t = leaf("a");
    expect(insertBeside(t, "zzz", leaf("b"), "left", "s")).toBe(t);
  });
  it("round-trips with removeLeaf", () => {
    const t = insertBeside(leaf("a"), "a", leaf("b"), "right", "s");
    expect(removeLeaf(t, "b")).toEqual(leaf("a"));
  });
});

describe("nearestSide", () => {
  it("picks the closest edge", () => {
    expect(nearestSide(0.05, 0.5)).toBe("left");
    expect(nearestSide(0.95, 0.5)).toBe("right");
    expect(nearestSide(0.5, 0.1)).toBe("up");
    expect(nearestSide(0.5, 0.9)).toBe("down");
  });
});
