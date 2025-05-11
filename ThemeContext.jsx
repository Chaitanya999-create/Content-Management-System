
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('cms_theme_mode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [themeColors, setThemeColors] = useState(() => {
    const saved = localStorage.getItem('cms_theme_colors');
    return saved ? JSON.parse(saved) : {
      primary: '#7c3aed', // Default purple
      secondary: '#f472b6', // Default pink
      accent: '#f43f5e', // Default rose
    };
  });

  const [fonts, setFonts] = useState(() => {
    const saved = localStorage.getItem('cms_theme_fonts');
    return saved ? JSON.parse(saved) : {
      heading: 'Inter',
      body: 'Inter',
    };
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('cms_theme_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('cms_theme_colors', JSON.stringify(themeColors));
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--color-primary', themeColors.primary);
    document.documentElement.style.setProperty('--color-secondary', themeColors.secondary);
    document.documentElement.style.setProperty('--color-accent', themeColors.accent);
  }, [themeColors]);

  useEffect(() => {
    localStorage.setItem('cms_theme_fonts', JSON.stringify(fonts));
    document.documentElement.style.setProperty('--font-heading', fonts.heading);
    document.documentElement.style.setProperty('--font-body', fonts.body);
  }, [fonts]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const updateThemeColors = (newColors) => {
    setThemeColors(prev => ({ ...prev, ...newColors }));
  };

  const updateFonts = (newFonts) => {
    setFonts(prev => ({ ...prev, ...newFonts }));
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      themeColors,
      updateThemeColors,
      fonts,
      updateFonts
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
