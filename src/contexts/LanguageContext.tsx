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
    'theme.system': 'Système',
    
    // Landing Page
    'landing.services': 'Services',
    'landing.howItWorks': 'Comment ça marche',
    'landing.servicesSubtitle': 'Des services simples et rapides pour prendre soin de vous et votre famille',
    'landing.howItWorksSubtitle': '4 étapes simples pour accéder aux meilleurs soins',
    'landing.secure': 'Plateforme E-Santé Nationale du Gabon',
    'landing.cta.login': 'Se connecter',
    'landing.cta.patient': 'Commencer maintenant',
    
    'landing.hero.title': 'Votre santé à',
    'landing.hero.titleHighlight': 'portée de clic',
    'landing.hero.subtitle': 'Trouvez un médecin, prenez rendez-vous, consultez en ligne et gérez votre santé facilement depuis Libreville, Port-Gentil ou n\'importe où au Gabon',
    'landing.hero.patient': 'S\'inscrire',
    
    'landing.search.doctor': 'Médecin, spécialité, hôpital...',
    'landing.search.location': 'Libreville, Port-Gentil...',
    'landing.search.button': 'Rechercher',
    
    'landing.stats.doctors': 'Médecins inscrits',
    'landing.stats.facilities': 'Hôpitaux & Cliniques',
    'landing.stats.available': 'Service disponible',
    'landing.stats.secure': 'Données sécurisées',
    
    'landing.service1.title': 'Prendre Rendez-vous',
    'landing.service1.desc': 'Trouvez et réservez un rendez-vous avec un médecin en quelques clics',
    'landing.service1.action': 'Trouver un médecin',
    'landing.service2.title': 'Téléconsultation',
    'landing.service2.desc': 'Consultez un médecin par vidéo depuis chez vous, où que vous soyez',
    'landing.service2.action': 'Démarrer une consultation',
    'landing.service3.title': 'Mon Dossier Médical',
    'landing.service3.desc': 'Accédez à tous vos documents médicaux en un seul endroit sécurisé',
    'landing.service3.action': 'Voir mon dossier',
    'landing.service4.title': 'Mes Droits CNAMGS',
    'landing.service4.desc': 'Vérifiez votre couverture santé et suivez vos remboursements',
    'landing.service4.action': 'Vérifier mes droits',
    
    'landing.step1.title': 'Créez votre compte',
    'landing.step1.desc': 'Inscription simple en 2 minutes',
    'landing.step2.title': 'Recherchez un professionnel',
    'landing.step2.desc': 'Par spécialité ou localisation',
    'landing.step3.title': 'Réservez votre rendez-vous',
    'landing.step3.desc': 'Choisissez l\'horaire qui vous convient',
    'landing.step4.title': 'Consultez et suivez',
    'landing.step4.desc': 'En ligne ou en présentiel',
    
    'landing.trust.title': 'Une plateforme de confiance pour tous les Gabonais',
    'landing.trust.subtitle': 'SANTE.GA est la plateforme officielle e-santé du Gabon, développée pour connecter patients, médecins, hôpitaux et pharmacies. Sécurisée, gratuite et accessible partout au Gabon.',
    'landing.trust.badge1': 'Données 100% sécurisées',
    'landing.trust.badge2': 'Validé par le Ministère',
    'landing.trust.badge3': 'Gratuit pour les patients',
    
    'landing.insurance.title': 'Vérifiez vos droits CNAMGS',
    'landing.insurance.placeholder': 'Numéro d\'assuré CNAMGS',
    'landing.insurance.verify': 'Vérifier ma couverture',
    'landing.insurance.subtitle': 'Vérifiez instantanément votre statut d\'assurance et vos droits aux remboursements',
    
    'landing.footer.tagline': 'Votre santé, notre priorité',
    'landing.footer.about': 'À propos',
    'landing.footer.support': 'Contact',
    'landing.footer.copyright': 'SANTE.GA - Ministère de la Santé du Gabon. Tous droits réservés.',
    'landing.footer.privacy': 'Confidentialité',
    'landing.footer.terms': 'Conditions d\'utilisation',
    'landing.footer.helpCenter': 'Aide',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenue',
    'dashboard.quickActions': 'Actions rapides',
    'dashboard.myAppointments': 'Mes Rendez-vous',
    'dashboard.noAppointments': 'Aucun rendez-vous prévu',
    'dashboard.makeAppointment': 'Prendre rendez-vous',
    'dashboard.viewAllAppointments': 'Voir tous mes RDV',
    
    // Quick Actions
    'quickActions.findDoctor': 'Trouver un médecin',
    'quickActions.pharmacies': 'Pharmacies de garde',
    'quickActions.teleconsultation': 'Téléconsultation',
    'quickActions.hospitals': 'Hôpitaux',
    
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
    'theme.system': 'System',
    
    // Landing Page
    'landing.services': 'Services',
    'landing.howItWorks': 'How It Works',
    'landing.servicesSubtitle': 'Simple and fast services to take care of you and your family',
    'landing.howItWorksSubtitle': '4 simple steps to access the best care',
    'landing.secure': 'National E-Health Platform of Gabon',
    'landing.cta.login': 'Login',
    'landing.cta.patient': 'Get Started',
    
    'landing.hero.title': 'Your health at',
    'landing.hero.titleHighlight': 'your fingertips',
    'landing.hero.subtitle': 'Find a doctor, book appointments, consult online and manage your health easily from Libreville, Port-Gentil or anywhere in Gabon',
    'landing.hero.patient': 'Sign Up',
    
    'landing.search.doctor': 'Doctor, specialty, hospital...',
    'landing.search.location': 'Libreville, Port-Gentil...',
    'landing.search.button': 'Search',
    
    'landing.stats.doctors': 'Registered Doctors',
    'landing.stats.facilities': 'Hospitals & Clinics',
    'landing.stats.available': 'Service Available',
    'landing.stats.secure': 'Secure Data',
    
    'landing.service1.title': 'Book Appointment',
    'landing.service1.desc': 'Find and book an appointment with a doctor in a few clicks',
    'landing.service1.action': 'Find a doctor',
    'landing.service2.title': 'Teleconsultation',
    'landing.service2.desc': 'Consult a doctor by video from home, wherever you are',
    'landing.service2.action': 'Start consultation',
    'landing.service3.title': 'Medical Record',
    'landing.service3.desc': 'Access all your medical documents in one secure place',
    'landing.service3.action': 'View my record',
    'landing.service4.title': 'CNAMGS Rights',
    'landing.service4.desc': 'Check your health coverage and track reimbursements',
    'landing.service4.action': 'Check my rights',
    
    'landing.step1.title': 'Create your account',
    'landing.step1.desc': 'Simple registration in 2 minutes',
    'landing.step2.title': 'Search for a professional',
    'landing.step2.desc': 'By specialty or location',
    'landing.step3.title': 'Book your appointment',
    'landing.step3.desc': 'Choose the time that suits you',
    'landing.step4.title': 'Consult and follow',
    'landing.step4.desc': 'Online or in person',
    
    'landing.trust.title': 'A trusted platform for all Gabonese',
    'landing.trust.subtitle': 'SANTE.GA is the official e-health platform of Gabon, developed to connect patients, doctors, hospitals and pharmacies. Secure, free and accessible throughout Gabon.',
    'landing.trust.badge1': '100% Secure Data',
    'landing.trust.badge2': 'Ministry Validated',
    'landing.trust.badge3': 'Free for Patients',
    
    'landing.insurance.title': 'Check your CNAMGS rights',
    'landing.insurance.placeholder': 'CNAMGS Member Number',
    'landing.insurance.verify': 'Check my coverage',
    'landing.insurance.subtitle': 'Instantly verify your insurance status and reimbursement rights',
    
    'landing.footer.tagline': 'Your health, our priority',
    'landing.footer.about': 'About',
    'landing.footer.support': 'Contact',
    'landing.footer.copyright': 'SANTE.GA - Ministry of Health of Gabon. All rights reserved.',
    'landing.footer.privacy': 'Privacy',
    'landing.footer.terms': 'Terms of Use',
    'landing.footer.helpCenter': 'Help',
    
    // Dashboard
    'dashboard.welcome': 'Welcome',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.myAppointments': 'My Appointments',
    'dashboard.noAppointments': 'No appointments scheduled',
    'dashboard.makeAppointment': 'Book Appointment',
    'dashboard.viewAllAppointments': 'View All Appointments',
    
    // Quick Actions
    'quickActions.findDoctor': 'Find a doctor',
    'quickActions.pharmacies': 'On-duty pharmacies',
    'quickActions.teleconsultation': 'Teleconsultation',
    'quickActions.hospitals': 'Hospitals',
    
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
    'theme.system': 'Sistema',
    
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
    'theme.system': 'النظام',
    
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
    'theme.system': 'Sistema',
    
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
