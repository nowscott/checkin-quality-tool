import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "checkin-quality-theme";
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

function storedTheme(): Theme | null {
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

function systemTheme(): Theme {
  return window.matchMedia(DARK_MODE_QUERY).matches ? "dark" : "light";
}

export function initialTheme(): Theme {
  const deviceTheme = systemTheme();
  const savedTheme = storedTheme();
  if (savedTheme === deviceTheme) {
    window.localStorage.removeItem(STORAGE_KEY);
    return deviceTheme;
  }
  return savedTheme || deviceTheme;
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [usesSystemTheme, setUsesSystemTheme] = useState(() => storedTheme() === null);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DARK_MODE_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      const deviceTheme = event.matches ? "dark" : "light";
      if (usesSystemTheme || theme === deviceTheme) {
        window.localStorage.removeItem(STORAGE_KEY);
        setUsesSystemTheme(true);
        setTheme(deviceTheme);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, usesSystemTheme]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const followsDevice = nextTheme === systemTheme();
    if (followsDevice) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    }
    setUsesSystemTheme(followsDevice);
    setTheme(nextTheme);
  }

  return { theme, usesSystemTheme, toggleTheme };
}
