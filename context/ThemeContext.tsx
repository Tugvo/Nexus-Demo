import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "professional" | "sharp";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: "professional",
  setMode: () => {},
});

export const ThemeProvider = ({ children }: { children?: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>("professional");

  useEffect(() => {
    // Check local storage on mount
    const saved = localStorage.getItem("theme") as ThemeMode | null;
    if (saved === "sharp" || saved === "professional") {
      setMode(saved);
      document.body.classList.remove("professional", "sharp");
      document.body.classList.add(saved);
    } else {
      document.body.classList.add("professional");
    }
  }, []);

  const updateMode = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem("theme", newMode);

    document.body.classList.remove("professional", "sharp");
    document.body.classList.add(newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode: updateMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);