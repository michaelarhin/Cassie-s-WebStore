import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";

export function isNightTime(date: Date): boolean {
  const hour = date.getHours();
  return hour < 7 || hour >= 19;
}

type ThemeMode = "auto" | "light" | "dark";

interface ThemeContextValue {
  /** The currently applied theme class ("light" | "dark") */
  resolved: "light" | "dark";
  /** Whether the user has overridden auto mode */
  mode: ThemeMode;
  /** Toggle: if auto → force opposite of current resolved; if forced → go back to auto */
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  resolved: "light",
  mode: "auto",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem("theme") as ThemeMode | null) ?? "auto";
  });

  const getAutoResolved = () => (isNightTime(new Date()) ? "dark" : "light");

  const [resolved, setResolved] = useState<"light" | "dark">(() => {
    if (mode === "dark") return "dark";
    if (mode === "light") return "light";
    return getAutoResolved();
  });

  // Apply the class to <html> and keep it in sync
  useLayoutEffect(() => {
    const apply = () => {
      const next: "light" | "dark" =
        mode === "auto" ? getAutoResolved() : mode;
      setResolved(next);
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.style.colorScheme = next;
    };

    apply();

    if (mode !== "auto") return; // no timer needed when manually set

    const timer = window.setInterval(apply, 60_000); // check every minute
    document.addEventListener("visibilitychange", apply);
    window.addEventListener("focus", apply);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", apply);
      window.removeEventListener("focus", apply);
    };
  }, [mode]);

  // Persist manual choice; clear on auto
  useEffect(() => {
    if (mode === "auto") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", mode);
    }
  }, [mode]);

  const toggle = () => {
    setMode((prev) => {
      if (prev === "auto") {
        // Force the opposite of what auto would give right now
        return getAutoResolved() === "dark" ? "light" : "dark";
      }
      // Already forced — go back to auto
      return "auto";
    });
  };

  return (
    <ThemeContext.Provider value={{ resolved, mode, toggle }}>
      {/* Inject Google Fonts once here */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Jost:ital,wght@0,300;0,400;0,500;1,300&display=swap"
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
