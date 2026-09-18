"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { markHydrated, useIsHydrated } from "@/lib/use-is-hydrated";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme") as Theme | null;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return stored ?? (prefersDark ? "dark" : "light");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(resolveInitialTheme);

  useEffect(() => {
    markHydrated();
  }, []);

  // Keep the <html> class and stored preference in sync with state.
  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const setThemeDirect = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeDirect }}>
      <div className="contents">{children}</div>
    </ThemeContext.Provider>
  );
}

const defaultThemeContext: ThemeContextType = {
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
};

export function useTheme() {
  const context = useContext(ThemeContext);
  return context ?? defaultThemeContext;
}