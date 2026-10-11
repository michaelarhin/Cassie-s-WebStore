import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AutomaticTheme, { isNightTime } from "@/components/AutomaticTheme";

afterEach(() => {
  vi.useRealTimers();
  document.documentElement.classList.remove("dark");
});

describe("automatic local-time theme", () => {
  it.each([[6, true], [7, false], [12, false], [18, false], [19, true], [23, true]])("uses the correct theme at hour %s", (hour, expected) => {
    expect(isNightTime(new Date(2026, 9, 11, hour))).toBe(expected);
  });

  it("changes at the evening boundary without a reload", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 11, 18, 59, 59));
    const { unmount } = render(<AutomaticTheme />);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    act(() => vi.advanceTimersByTime(1000));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    unmount();
  });
});