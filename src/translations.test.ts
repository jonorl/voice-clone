import { describe, it, expect } from "@jest/globals";
import { translations } from "./translations";

// Nested sections (features, technicalDetails) and lists (loadingMessages) are flattened to dotted paths.
const flatten = (value: unknown, path = ""): Record<string, unknown> =>
  value !== null && typeof value === "object"
    ? Object.entries(value).reduce(
        (all, [key, child]) => ({ ...all, ...flatten(child, path ? `${path}.${key}` : key) }),
        {},
      )
    : { [path]: value };

describe("translations", () => {
  it("has the same keys in every language", () => {
    expect(Object.keys(flatten(translations.es)).sort()).toEqual(Object.keys(flatten(translations.en)).sort());
  });

  it("has no empty strings", () => {
    for (const strings of Object.values(translations)) {
      for (const value of Object.values(flatten(strings))) expect(String(value).trim()).not.toBe("");
    }
  });
});
