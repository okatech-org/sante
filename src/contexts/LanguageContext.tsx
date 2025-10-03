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
    'nav.dashboard': 'Tableau de bord',
    'nav.appointments': 'Rendez-vous',
    'nav.providers': 'Professionnels',
    'nav.cartography': 'Cartographie',
    'nav.prescriptions': 'Ordonnances',
    'nav.results': 'Résultats',
    'nav.medicalRecord': 'Dossier médical',
    'nav.reimbursements': 'Remboursements',
    'nav.support': 'Support',
    'nav.profile': 'Profil',
    'nav.insurance': 'Assurance',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenue',
    'dashboard.quickActions': 'Actions rapides',
    'dashboard.upcomingAppointments': 'Rendez-vous à venir',
    'dashboard.activePrescriptions': 'Ordonnances actives',
    'dashboard.recentResults': 'Résultats récents',
    'dashboard.insuranceStatus': 'Statut assurance',
    
    // Quick Actions
    'quickActions.findDoctor': 'Trouver un médecin',
    'quickActions.pharmacies': 'Pharmacies de garde',
    'quickActions.teleconsultation': 'Téléconsultation urgente',
    'quickActions.hospitals': 'Hôpitaux proches',
    
    // Common
    'common.search': 'Rechercher',
    'common.notifications': 'Notifications',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    
    // Theme
    'theme.toggle': 'Basculer le thème',
    'theme.light': 'Clair',
    'theme.dark': 'Sombre',
    'theme.system': 'Système',
    
    // Language
    'language.toggle': 'Changer de langue',
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',
    'language.ar': 'العربية',
    'language.pt': 'Português',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.appointments': 'Appointments',
    'nav.providers': 'Providers',
    'nav.cartography': 'Cartography',
    'nav.prescriptions': 'Prescriptions',
    'nav.results': 'Results',
    'nav.medicalRecord': 'Medical Record',
    'nav.reimbursements': 'Reimbursements',
    'nav.support': 'Support',
    'nav.profile': 'Profile',
    'nav.insurance': 'Insurance',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.upcomingAppointments': 'Upcoming Appointments',
    'dashboard.activePrescriptions': 'Active Prescriptions',
    'dashboard.recentResults': 'Recent Results',
    'dashboard.insuranceStatus': 'Insurance Status',
    
    // Quick Actions
    'quickActions.findDoctor': 'Find a doctor',
    'quickActions.pharmacies': 'On-duty pharmacies',
    'quickActions.teleconsultation': 'Urgent teleconsultation',
    'quickActions.hospitals': 'Nearby hospitals',
    
    // Common
    'common.search': 'Search',
    'common.notifications': 'Notifications',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    
    // Theme
    'theme.toggle': 'Toggle theme',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    
    // Language
    'language.toggle': 'Change language',
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',
    'language.ar': 'العربية',
    'language.pt': 'Português',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.appointments': 'Citas',
    'nav.providers': 'Profesionales',
    'nav.cartography': 'Cartografía',
    'nav.prescriptions': 'Recetas',
    'nav.results': 'Resultados',
    'nav.medicalRecord': 'Historial médico',
    'nav.reimbursements': 'Reembolsos',
    'nav.support': 'Soporte',
    'nav.profile': 'Perfil',
    'nav.insurance': 'Seguro',
    'nav.settings': 'Configuración',
    'nav.logout': 'Cerrar sesión',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenido',
    'dashboard.quickActions': 'Acciones rápidas',
    'dashboard.upcomingAppointments': 'Próximas citas',
    'dashboard.activePrescriptions': 'Recetas activas',
    'dashboard.recentResults': 'Resultados recientes',
    'dashboard.insuranceStatus': 'Estado del seguro',
    
    // Quick Actions
    'quickActions.findDoctor': 'Encontrar un médico',
    'quickActions.pharmacies': 'Farmacias de guardia',
    'quickActions.teleconsultation': 'Teleconsulta urgente',
    'quickActions.hospitals': 'Hospitales cercanos',
    
    // Common
    'common.search': 'Buscar',
    'common.notifications': 'Notificaciones',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    
    // Theme
    'theme.toggle': 'Cambiar tema',
    'theme.light': 'Claro',
    'theme.dark': 'Oscuro',
    'theme.system': 'Sistema',
    
    // Language
    'language.toggle': 'Cambiar idioma',
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',
    'language.ar': 'العربية',
    'language.pt': 'Português',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.appointments': 'المواعيد',
    'nav.providers': 'المهنيون',
    'nav.cartography': 'الخرائط',
    'nav.prescriptions': 'الوصفات',
    'nav.results': 'النتائج',
    'nav.medicalRecord': 'السجل الطبي',
    'nav.reimbursements': 'التعويضات',
    'nav.support': 'الدعم',
    'nav.profile': 'الملف الشخصي',
    'nav.insurance': 'التأمين',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',
    
    // Dashboard
    'dashboard.welcome': 'مرحبا',
    'dashboard.quickActions': 'إجراءات سريعة',
    'dashboard.upcomingAppointments': 'المواعيد القادمة',
    'dashboard.activePrescriptions': 'الوصفات النشطة',
    'dashboard.recentResults': 'النتائج الأخيرة',
    'dashboard.insuranceStatus': 'حالة التأمين',
    
    // Quick Actions
    'quickActions.findDoctor': 'ابحث عن طبيب',
    'quickActions.pharmacies': 'الصيدليات المناوبة',
    'quickActions.teleconsultation': 'استشارة عن بعد عاجلة',
    'quickActions.hospitals': 'المستشفيات القريبة',
    
    // Common
    'common.search': 'بحث',
    'common.notifications': 'الإشعارات',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    
    // Theme
    'theme.toggle': 'تبديل المظهر',
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
    'theme.system': 'النظام',
    
    // Language
    'language.toggle': 'تغيير اللغة',
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',
    'language.ar': 'العربية',
    'language.pt': 'Português',
  },
  pt: {
    // Navigation
    'nav.dashboard': 'Painel',
    'nav.appointments': 'Consultas',
    'nav.providers': 'Profissionais',
    'nav.cartography': 'Cartografia',
    'nav.prescriptions': 'Receitas',
    'nav.results': 'Resultados',
    'nav.medicalRecord': 'Prontuário médico',
    'nav.reimbursements': 'Reembolsos',
    'nav.support': 'Suporte',
    'nav.profile': 'Perfil',
    'nav.insurance': 'Seguro',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',
    
    // Dashboard
    'dashboard.welcome': 'Bem-vindo',
    'dashboard.quickActions': 'Ações rápidas',
    'dashboard.upcomingAppointments': 'Próximas consultas',
    'dashboard.activePrescriptions': 'Receitas ativas',
    'dashboard.recentResults': 'Resultados recentes',
    'dashboard.insuranceStatus': 'Status do seguro',
    
    // Quick Actions
    'quickActions.findDoctor': 'Encontrar um médico',
    'quickActions.pharmacies': 'Farmácias de plantão',
    'quickActions.teleconsultation': 'Teleconsulta urgente',
    'quickActions.hospitals': 'Hospitais próximos',
    
    // Common
    'common.search': 'Pesquisar',
    'common.notifications': 'Notificações',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    
    // Theme
    'theme.toggle': 'Alternar tema',
    'theme.light': 'Claro',
    'theme.dark': 'Escuro',
    'theme.system': 'Sistema',
    
    // Language
    'language.toggle': 'Mudar idioma',
    'language.fr': 'Français',
    'language.en': 'English',
    'language.es': 'Español',
    'language.ar': 'العربية',
    'language.pt': 'Português',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
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
