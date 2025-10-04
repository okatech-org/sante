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
    'nav.appointments': 'Mes Rendez-vous',
    'nav.providers': 'Trouver un Prestataire',
    'nav.cartography': 'Cartographie Santé',
    'nav.prescriptions': 'Mes Ordonnances',
    'nav.results': 'Mes Résultats',
    'nav.medicalRecord': 'Mon Dossier Médical',
    'nav.reimbursements': 'Remboursements CNAMGS',
    'nav.support': 'Aide & Support',
    'nav.profile': 'Profil',
    'nav.insurance': 'Assurance',
    'nav.settings': 'Paramètres',
    'nav.logout': 'Déconnexion',
    'nav.about': 'À Propos',
    'nav.services': 'Nos Services',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenue',
    'dashboard.quickActions': 'Actions rapides',
    'dashboard.myAppointments': 'Mes Rendez-vous',
    'dashboard.noAppointments': 'Aucun rendez-vous prévu',
    'dashboard.makeAppointment': 'Prendre rendez-vous',
    'dashboard.viewAllAppointments': 'Voir tous mes RDV',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.retry': 'Réessayer',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.view': 'Voir',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.close': 'Fermer',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.appointments': 'My Appointments',
    'nav.providers': 'Find Provider',
    'nav.cartography': 'Health Map',
    'nav.prescriptions': 'My Prescriptions',
    'nav.results': 'My Results',
    'nav.medicalRecord': 'Medical Record',
    'nav.reimbursements': 'CNAMGS Reimbursements',
    'nav.support': 'Help & Support',
    'nav.profile': 'Profile',
    'nav.insurance': 'Insurance',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.about': 'About',
    'nav.services': 'Our Services',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.myAppointments': 'My Appointments',
    'dashboard.noAppointments': 'No appointments scheduled',
    'dashboard.makeAppointment': 'Book Appointment',
    'dashboard.viewAllAppointments': 'View All Appointments',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel',
    'nav.appointments': 'Mis Citas',
    'nav.providers': 'Buscar Proveedor',
    'nav.cartography': 'Mapa de Salud',
    'nav.prescriptions': 'Mis Recetas',
    'nav.results': 'Mis Resultados',
    'nav.medicalRecord': 'Historia Clínica',
    'nav.reimbursements': 'Reembolsos CNAMGS',
    'nav.support': 'Ayuda y Soporte',
    'nav.profile': 'Perfil',
    'nav.insurance': 'Seguro',
    'nav.settings': 'Configuración',
    'nav.logout': 'Cerrar Sesión',
    'nav.about': 'Acerca de',
    'nav.services': 'Nuestros Servicios',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contacto',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenido',
    'dashboard.quickActions': 'Acciones Rápidas',
    'dashboard.myAppointments': 'Mis Citas',
    'dashboard.noAppointments': 'No hay citas programadas',
    'dashboard.makeAppointment': 'Agendar Cita',
    'dashboard.viewAllAppointments': 'Ver Todas las Citas',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Ocurrió un error',
    'common.retry': 'Reintentar',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.close': 'Cerrar',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.appointments': 'مواعيدي',
    'nav.providers': 'البحث عن مقدم خدمة',
    'nav.cartography': 'خريطة الصحة',
    'nav.prescriptions': 'وصفاتي الطبية',
    'nav.results': 'نتائجي',
    'nav.medicalRecord': 'السجل الطبي',
    'nav.reimbursements': 'استرداد CNAMGS',
    'nav.support': 'المساعدة والدعم',
    'nav.profile': 'الملف الشخصي',
    'nav.insurance': 'التأمين',
    'nav.settings': 'الإعدادات',
    'nav.logout': 'تسجيل الخروج',
    'nav.about': 'حول',
    'nav.services': 'خدماتنا',
    'nav.faq': 'الأسئلة الشائعة',
    'nav.contact': 'اتصل',
    
    // Dashboard
    'dashboard.welcome': 'مرحبا',
    'dashboard.quickActions': 'إجراءات سريعة',
    'dashboard.myAppointments': 'مواعيدي',
    'dashboard.noAppointments': 'لا توجد مواعيد مجدولة',
    'dashboard.makeAppointment': 'حجز موعد',
    'dashboard.viewAllAppointments': 'عرض جميع المواعيد',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.retry': 'إعادة المحاولة',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.close': 'إغلاق',
  },
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.dashboard': 'Painel',
    'nav.appointments': 'Meus Agendamentos',
    'nav.providers': 'Buscar Prestador',
    'nav.cartography': 'Mapa de Saúde',
    'nav.prescriptions': 'Minhas Prescrições',
    'nav.results': 'Meus Resultados',
    'nav.medicalRecord': 'Prontuário',
    'nav.reimbursements': 'Reembolsos CNAMGS',
    'nav.support': 'Ajuda e Suporte',
    'nav.profile': 'Perfil',
    'nav.insurance': 'Seguro',
    'nav.settings': 'Configurações',
    'nav.logout': 'Sair',
    'nav.about': 'Sobre',
    'nav.services': 'Nossos Serviços',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contato',
    
    // Dashboard
    'dashboard.welcome': 'Bem-vindo',
    'dashboard.quickActions': 'Ações Rápidas',
    'dashboard.myAppointments': 'Meus Agendamentos',
    'dashboard.noAppointments': 'Nenhum agendamento programado',
    'dashboard.makeAppointment': 'Agendar Consulta',
    'dashboard.viewAllAppointments': 'Ver Todos os Agendamentos',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Ocorreu um erro',
    'common.retry': 'Tentar Novamente',
    'common.cancel': 'Cancelar',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.search': 'Pesquisar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.next': 'Próximo',
    'common.previous': 'Anterior',
    'common.close': 'Fechar',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    // Récupérer la langue sauvegardée ou utiliser le français par défaut
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['fr', 'en', 'es', 'ar', 'pt'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Sauvegarder la langue
    localStorage.setItem('language', language);
    
    // Ajuster la direction du texte pour l'arabe
    document.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['fr'][key] || key;
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
