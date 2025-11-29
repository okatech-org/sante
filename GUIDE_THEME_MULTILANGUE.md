# 🎨 Guide d'Implémentation - Système de Thème & Multi-langues

Ce guide contient tout le nécessaire pour implémenter un système de thème clair/sombre et de gestion multilingue dans votre projet Lovable.

---

## 📋 PROMPT POUR LOVABLE AI

```
Implémente un système complet de thème clair/sombre et de gestion multilingue (FR/EN/ES/AR/PT) avec les fonctionnalités suivantes:

1. **Système de Thème:**
   - Toggle entre mode clair et sombre
   - Persistance dans localStorage
   - Design system complet avec variables CSS (HSL uniquement)
   - Transitions fluides entre les thèmes

2. **Système Multilingue:**
   - Support de 5 langues: Français, English, Español, العربية, Português
   - Contexte React pour gérer les traductions
   - Composant LanguageToggle avec dropdown
   - Persistance dans localStorage

3. **Design Requirements:**
   - Utiliser uniquement des couleurs HSL via variables CSS
   - Design system basé sur des tokens sémantiques
   - Pas de couleurs hardcodées (pas de bg-white, text-black, etc.)
   - Thème turquoise moderne + palette de couleurs vibrantes

Voici les fichiers à créer...
```

---

## 📁 FICHIERS À CRÉER

### 1. `src/contexts/ProfessionalThemeContext.tsx`

```typescript
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
```

---

### 2. `src/contexts/LanguageContext.tsx`

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en' | 'es' | 'ar' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    
    // Language
    'language.toggle': 'Changer de langue',
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',
    'language.ar': 'العربية',
    'language.pt': 'Português',
    
    // Theme
    'theme.toggle': 'Changer de thème',
    'theme.light': 'Clair',
    'theme.dark': 'Sombre',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Language
    'language.toggle': 'Change language',
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',
    'language.ar': 'العربية',
    'language.pt': 'Português',
    
    // Theme
    'theme.toggle': 'Change theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel',
    'nav.settings': 'Ajustes',
    'nav.logout': 'Cerrar sesión',
    
    // Language
    'language.toggle': 'Cambiar idioma',
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',
    'language.ar': 'العربية',
    'language.pt': 'Português',
    
    // Theme
    'theme.toggle': 'Cambiar tema',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',
    
    // Language
    'language.toggle': 'تغيير اللغة',
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',
    'language.ar': 'العربية',
    'language.pt': 'Português',
    
    // Theme
    'theme.toggle': 'تغيير المظهر',
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
    
    // Common
    'common.loading': 'جار التحميل...',
    'common.error': 'حدث خطأ',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
  },
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.dashboard': 'Painel',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',
    
    // Language
    'language.toggle': 'Mudar idioma',
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',
    'language.ar': 'العربية',
    'language.pt': 'Português',
    
    // Theme
    'theme.toggle': 'Mudar tema',
    'theme.light': 'Claro',
    'theme.dark': 'Escuro',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Ocorreu um erro',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language') as Language;
    return saved || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
    document.documentElement.lang = language;
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
```

---

### 3. `src/components/theme/ThemeToggle.tsx`

```typescript
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{t('theme.toggle')}</span>
    </Button>
  );
}
```

---

### 4. `src/components/language/LanguageToggle.tsx`

```typescript
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'fr' as const, label: t('language.fr') },
    { code: 'en' as const, label: t('language.en') },
    { code: 'es' as const, label: t('language.es') },
    { code: 'ar' as const, label: t('language.ar') },
    { code: 'pt' as const, label: t('language.pt') },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-5 w-5" />
          <span className="sr-only">{t('language.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code)}
            className={language === code ? 'bg-accent' : ''}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### 5. `src/index.css` - Design System

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 98%;
    --foreground: 210 20% 15%;

    --card: 0 0% 100%;
    --card-foreground: 210 20% 15%;

    --popover: 0 0% 100%;
    --popover-foreground: 210 20% 15%;

    /* Turquoise moderne - Couleur principale #17CCB9 */
    --primary: 173 78% 45%;
    --primary-foreground: 0 0% 100%;
    --primary-light: 173 70% 85%;

    /* Bleu électrique - Couleur secondaire #00A1FE */
    --secondary: 202 100% 50%;
    --secondary-foreground: 0 0% 100%;

    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;

    /* Rose vibrant - Couleur accent #E63B7A */
    --accent: 338 80% 57%;
    --accent-foreground: 0 0% 100%;
    
    /* Jaune doré - Couleur warning/highlight #FDAD00 */
    --warning: 41 100% 50%;
    --warning-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    
    --success: 173 78% 45%;
    --success-foreground: 0 0% 100%;

    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 173 78% 45%;

    --radius: 0.75rem;
  }

  .dark {
    --background: 210 30% 8%;
    --foreground: 210 40% 98%;

    --card: 210 30% 10%;
    --card-foreground: 210 40% 98%;

    --popover: 210 30% 10%;
    --popover-foreground: 210 40% 98%;

    --primary: 173 78% 50%;
    --primary-foreground: 0 0% 100%;
    --primary-light: 173 70% 30%;

    --secondary: 202 100% 55%;
    --secondary-foreground: 0 0% 100%;

    --muted: 210 30% 15%;
    --muted-foreground: 215 20% 65%;

    --accent: 338 80% 62%;
    --accent-foreground: 0 0% 100%;
    
    --warning: 41 100% 55%;
    --warning-foreground: 210 30% 8%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    
    --success: 173 78% 50%;
    --success-foreground: 0 0% 100%;

    --border: 210 30% 18%;
    --input: 210 30% 18%;
    --ring: 173 78% 50%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-semibold tracking-tight;
  }

  button, a, input, select, textarea {
    @apply transition-all duration-300;
  }
}
```

---

### 6. `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

### 7. `index.html` - Ajout de la police Inter

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Votre Application</title>
    
    <!-- Police Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 🔧 INSTALLATION

### Étape 1: Installer les dépendances

```bash
# Si pas déjà installé
npm install next-themes lucide-react
```

### Étape 2: Wrap votre App avec les Providers

Modifiez votre `src/main.tsx` ou `src/App.tsx`:

```typescript
import { ProfessionalThemeProvider } from '@/contexts/ProfessionalThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <ProfessionalThemeProvider>
          {/* Votre app ici */}
        </ProfessionalThemeProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
```

### Étape 3: Utiliser les composants dans votre Header/Nav

```typescript
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { LanguageToggle } from '@/components/language/LanguageToggle';

export function Header() {
  return (
    <header>
      <nav>
        {/* Votre navigation */}
        <div className="flex gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
```

---

## 💡 UTILISATION

### Accéder aux traductions

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### Accéder au thème

```typescript
import { useProfessionalTheme } from '@/contexts/ProfessionalThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useProfessionalTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

---

## ✅ CHECKLIST DE VÉRIFICATION

- [ ] Tous les fichiers créés
- [ ] Dépendances installées (`next-themes`, `lucide-react`)
- [ ] Providers wrappés autour de l'app
- [ ] Police Inter chargée dans `index.html`
- [ ] Design system en place avec variables HSL
- [ ] Composants ThemeToggle et LanguageToggle ajoutés au Header
- [ ] Pas de couleurs hardcodées (pas de `bg-white`, `text-black`, etc.)
- [ ] Test du toggle thème clair/sombre
- [ ] Test du changement de langue
- [ ] Vérification de la persistance (localStorage)

---

## 🎨 PERSONNALISATION

Pour personnaliser les couleurs, modifiez les variables dans `src/index.css`:

```css
:root {
  /* Changez ces valeurs HSL selon vos besoins */
  --primary: 173 78% 45%;  /* Votre couleur principale */
  --secondary: 202 100% 50%;  /* Votre couleur secondaire */
  --accent: 338 80% 57%;  /* Votre couleur accent */
}
```

Pour ajouter des traductions, ajoutez-les dans `src/contexts/LanguageContext.tsx`:

```typescript
const translations: Record<Language, Record<string, string>> = {
  fr: {
    'myapp.welcome': 'Bienvenue',
    // ...
  },
  en: {
    'myapp.welcome': 'Welcome',
    // ...
  },
  // ...
};
```

---

## 📚 RESSOURCES

- [Next Themes Documentation](https://github.com/pacocoursey/next-themes)
- [Lucide React Icons](https://lucide.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [HSL Color Picker](https://hslpicker.com/)

---

**Bon développement ! 🚀**
