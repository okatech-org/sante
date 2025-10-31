import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ProfessionalThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ProfessionalThemeContext = createContext<ProfessionalThemeContextType | undefined>(undefined);

export function ProfessionalThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('professional_theme') as Theme;
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('professional_theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ProfessionalThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ProfessionalThemeContext.Provider>
  );
}

export function useProfessionalTheme() {
  const context = useContext(ProfessionalThemeContext);
  if (!context) {
    throw new Error('useProfessionalTheme must be used within ProfessionalThemeProvider');
  }
  return context;
}

