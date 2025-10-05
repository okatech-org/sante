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
    'landing.insurance.verifying': 'Vérification en cours...',
    'landing.insurance.subtitle': 'Vérifiez instantanément votre statut d\'assurance et vos droits aux remboursements',
    
    'landing.specialties.cardiologist': 'Cardiologue',
    'landing.specialties.gynecologist': 'Gynécologue',
    'landing.specialties.pediatrician': 'Pédiatre',
    'landing.specialties.dentist': 'Dentiste',
    'landing.specialties.emergency': 'Urgences',
    
    'landing.toast.required': 'Champ requis',
    'landing.toast.enterNumber': 'Veuillez entrer votre numéro d\'assuré CNAMGS',
    'landing.toast.verified': 'Vérification effectuée',
    'landing.toast.loginPrompt': 'Veuillez vous connecter pour voir vos droits complets',
    
    'landing.footer.tagline': 'Votre santé, notre priorité',
    'landing.footer.description': 'La plateforme nationale e-santé du Gabon. Connectant patients, médecins et professionnels de santé pour un accès équitable aux soins partout au Gabon.',
    'landing.footer.about': 'À propos',
    'landing.footer.support': 'Contact',
    'landing.footer.findDoctor': 'Trouver un médecin',
    'landing.footer.teleconsultation': 'Téléconsultation',
    'landing.footer.medicalRecord': 'Dossier médical',
    'landing.footer.cnamgsRights': 'Droits CNAMGS',
    'landing.footer.location': 'Libreville, Gabon',
    'landing.footer.availability': '24/7 Support disponible',
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
    
    // Register Page
    'register.title': 'Rejoignez-nous',
    'register.subtitle': 'Choisissez votre type de compte pour commencer',
    'register.patient.title': 'Patient',
    'register.patient.description': 'Gérez votre santé facilement',
    'register.patient.feature1': 'Prendre des rendez-vous en ligne',
    'register.patient.feature2': 'Accéder à votre dossier médical',
    'register.patient.feature3': 'Consulter en ligne (téléconsultation)',
    'register.patient.feature4': 'Suivre vos prescriptions et résultats',
    'register.patient.cta': 'S\'inscrire en tant que Patient',
    'register.professional.title': 'Professionnel de Santé',
    'register.professional.description': 'Développez votre activité médicale',
    'register.professional.feature1': 'Gérer votre agenda en ligne',
    'register.professional.feature2': 'Accéder aux dossiers patients',
    'register.professional.feature3': 'Proposer des téléconsultations',
    'register.professional.feature4': 'Augmenter votre visibilité',
    'register.professional.cta': 'S\'inscrire en tant que Professionnel',
    'register.hasAccount': 'Vous avez déjà un compte ?',
    'register.login': 'Se connecter',
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
    'landing.insurance.verifying': 'Verifying...',
    'landing.insurance.subtitle': 'Instantly verify your insurance status and reimbursement rights',
    
    'landing.specialties.cardiologist': 'Cardiologist',
    'landing.specialties.gynecologist': 'Gynecologist',
    'landing.specialties.pediatrician': 'Pediatrician',
    'landing.specialties.dentist': 'Dentist',
    'landing.specialties.emergency': 'Emergency',
    
    'landing.toast.required': 'Required field',
    'landing.toast.enterNumber': 'Please enter your CNAMGS member number',
    'landing.toast.verified': 'Verification completed',
    'landing.toast.loginPrompt': 'Please log in to see your complete rights',
    
    'landing.footer.tagline': 'Your health, our priority',
    'landing.footer.description': 'The national e-health platform of Gabon. Connecting patients, doctors and healthcare professionals for equitable access to care throughout Gabon.',
    'landing.footer.about': 'About',
    'landing.footer.support': 'Contact',
    'landing.footer.findDoctor': 'Find a doctor',
    'landing.footer.teleconsultation': 'Teleconsultation',
    'landing.footer.medicalRecord': 'Medical record',
    'landing.footer.cnamgsRights': 'CNAMGS Rights',
    'landing.footer.location': 'Libreville, Gabon',
    'landing.footer.availability': '24/7 Support available',
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
    
    // Register Page
    'register.title': 'Join Us',
    'register.subtitle': 'Choose your account type to get started',
    'register.patient.title': 'Patient',
    'register.patient.description': 'Manage your health easily',
    'register.patient.feature1': 'Book appointments online',
    'register.patient.feature2': 'Access your medical records',
    'register.patient.feature3': 'Consult online (teleconsultation)',
    'register.patient.feature4': 'Track your prescriptions and results',
    'register.patient.cta': 'Sign Up as Patient',
    'register.professional.title': 'Healthcare Professional',
    'register.professional.description': 'Grow your medical practice',
    'register.professional.feature1': 'Manage your online schedule',
    'register.professional.feature2': 'Access patient records',
    'register.professional.feature3': 'Offer teleconsultations',
    'register.professional.feature4': 'Increase your visibility',
    'register.professional.cta': 'Sign Up as Professional',
    'register.hasAccount': 'Already have an account?',
    'register.login': 'Log in',
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
    
    // Landing Page
    'landing.services': 'Servicios',
    'landing.howItWorks': 'Cómo funciona',
    'landing.servicesSubtitle': 'Servicios simples y rápidos para cuidar de usted y su familia',
    'landing.howItWorksSubtitle': '4 pasos simples para acceder a la mejor atención',
    'landing.secure': 'Plataforma Nacional de E-Salud de Gabón',
    'landing.cta.login': 'Iniciar Sesión',
    'landing.cta.patient': 'Empezar Ahora',
    
    'landing.hero.title': 'Su salud al',
    'landing.hero.titleHighlight': 'alcance de su mano',
    'landing.hero.subtitle': 'Encuentre un médico, reserve citas, consulte en línea y gestione su salud fácilmente desde Libreville, Port-Gentil o cualquier lugar de Gabón',
    'landing.hero.patient': 'Registrarse',
    
    'landing.search.doctor': 'Médico, especialidad, hospital...',
    'landing.search.location': 'Libreville, Port-Gentil...',
    'landing.search.button': 'Buscar',
    
    'landing.stats.doctors': 'Médicos Registrados',
    'landing.stats.facilities': 'Hospitales y Clínicas',
    'landing.stats.available': 'Servicio Disponible',
    'landing.stats.secure': 'Datos Seguros',
    
    'landing.service1.title': 'Reservar Cita',
    'landing.service1.desc': 'Encuentre y reserve una cita con un médico en pocos clics',
    'landing.service1.action': 'Encontrar un médico',
    'landing.service2.title': 'Teleconsulta',
    'landing.service2.desc': 'Consulte a un médico por video desde casa, donde sea que esté',
    'landing.service2.action': 'Iniciar consulta',
    'landing.service3.title': 'Historia Clínica',
    'landing.service3.desc': 'Acceda a todos sus documentos médicos en un lugar seguro',
    'landing.service3.action': 'Ver mi historia',
    'landing.service4.title': 'Derechos CNAMGS',
    'landing.service4.desc': 'Verifique su cobertura de salud y siga los reembolsos',
    'landing.service4.action': 'Verificar mis derechos',
    
    'landing.step1.title': 'Cree su cuenta',
    'landing.step1.desc': 'Registro simple en 2 minutos',
    'landing.step2.title': 'Busque un profesional',
    'landing.step2.desc': 'Por especialidad o ubicación',
    'landing.step3.title': 'Reserve su cita',
    'landing.step3.desc': 'Elija el horario que le convenga',
    'landing.step4.title': 'Consulte y siga',
    'landing.step4.desc': 'En línea o en persona',
    
    'landing.trust.title': 'Una plataforma de confianza para todos los gaboneses',
    'landing.trust.subtitle': 'SANTE.GA es la plataforma oficial de e-salud de Gabón, desarrollada para conectar pacientes, médicos, hospitales y farmacias. Segura, gratuita y accesible en todo Gabón.',
    'landing.trust.badge1': 'Datos 100% Seguros',
    'landing.trust.badge2': 'Validado por el Ministerio',
    'landing.trust.badge3': 'Gratis para Pacientes',
    
    'landing.insurance.title': 'Verifique sus derechos CNAMGS',
    'landing.insurance.placeholder': 'Número de Miembro CNAMGS',
    'landing.insurance.verify': 'Verificar mi cobertura',
    'landing.insurance.verifying': 'Verificando...',
    'landing.insurance.subtitle': 'Verifique instantáneamente su estado de seguro y derechos de reembolso',
    
    'landing.specialties.cardiologist': 'Cardiólogo',
    'landing.specialties.gynecologist': 'Ginecólogo',
    'landing.specialties.pediatrician': 'Pediatra',
    'landing.specialties.dentist': 'Dentista',
    'landing.specialties.emergency': 'Urgencias',
    
    'landing.toast.required': 'Campo requerido',
    'landing.toast.enterNumber': 'Por favor ingrese su número de miembro CNAMGS',
    'landing.toast.verified': 'Verificación completada',
    'landing.toast.loginPrompt': 'Por favor inicie sesión para ver sus derechos completos',
    
    'landing.footer.tagline': 'Su salud, nuestra prioridad',
    'landing.footer.description': 'La plataforma nacional de e-salud de Gabón. Conectando pacientes, médicos y profesionales de la salud para un acceso equitativo a la atención en todo Gabón.',
    'landing.footer.about': 'Acerca de',
    'landing.footer.support': 'Contacto',
    'landing.footer.findDoctor': 'Encontrar un médico',
    'landing.footer.teleconsultation': 'Teleconsulta',
    'landing.footer.medicalRecord': 'Historia clínica',
    'landing.footer.cnamgsRights': 'Derechos CNAMGS',
    'landing.footer.location': 'Libreville, Gabón',
    'landing.footer.availability': 'Soporte 24/7 disponible',
    'landing.footer.copyright': 'SANTE.GA - Ministerio de Salud de Gabón. Todos los derechos reservados.',
    'landing.footer.privacy': 'Privacidad',
    'landing.footer.terms': 'Términos de Uso',
    'landing.footer.helpCenter': 'Ayuda',
    
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
    
    // Landing Page
    'landing.services': 'الخدمات',
    'landing.howItWorks': 'كيف يعمل',
    'landing.servicesSubtitle': 'خدمات بسيطة وسريعة للعناية بك وبعائلتك',
    'landing.howItWorksSubtitle': '4 خطوات بسيطة للوصول إلى أفضل رعاية',
    'landing.secure': 'المنصة الوطنية للصحة الإلكترونية في الغابون',
    'landing.cta.login': 'تسجيل الدخول',
    'landing.cta.patient': 'ابدأ الآن',
    
    'landing.hero.title': 'صحتك في',
    'landing.hero.titleHighlight': 'متناول يدك',
    'landing.hero.subtitle': 'ابحث عن طبيب، احجز المواعيد، استشر عبر الإنترنت وأدر صحتك بسهولة من ليبرفيل، بورت جنتيل أو أي مكان في الغابون',
    'landing.hero.patient': 'التسجيل',
    
    'landing.search.doctor': 'طبيب، تخصص، مستشفى...',
    'landing.search.location': 'ليبرفيل، بورت جنتيل...',
    'landing.search.button': 'بحث',
    
    'landing.stats.doctors': 'الأطباء المسجلون',
    'landing.stats.facilities': 'المستشفيات والعيادات',
    'landing.stats.available': 'الخدمة متاحة',
    'landing.stats.secure': 'بيانات آمنة',
    
    'landing.service1.title': 'حجز موعد',
    'landing.service1.desc': 'ابحث واحجز موعداً مع طبيب بنقرات قليلة',
    'landing.service1.action': 'ابحث عن طبيب',
    'landing.service2.title': 'الاستشارة عن بعد',
    'landing.service2.desc': 'استشر طبيباً عبر الفيديو من المنزل، أينما كنت',
    'landing.service2.action': 'بدء الاستشارة',
    'landing.service3.title': 'السجل الطبي',
    'landing.service3.desc': 'الوصول إلى جميع المستندات الطبية في مكان آمن واحد',
    'landing.service3.action': 'عرض سجلي',
    'landing.service4.title': 'حقوق CNAMGS',
    'landing.service4.desc': 'تحقق من تغطية التأمين الصحي وتتبع المبالغ المستردة',
    'landing.service4.action': 'تحقق من حقوقي',
    
    'landing.step1.title': 'أنشئ حسابك',
    'landing.step1.desc': 'تسجيل بسيط في دقيقتين',
    'landing.step2.title': 'ابحث عن محترف',
    'landing.step2.desc': 'حسب التخصص أو الموقع',
    'landing.step3.title': 'احجز موعدك',
    'landing.step3.desc': 'اختر الوقت المناسب لك',
    'landing.step4.title': 'استشر وتابع',
    'landing.step4.desc': 'عبر الإنترنت أو شخصياً',
    
    'landing.trust.title': 'منصة موثوقة لجميع الغابونيين',
    'landing.trust.subtitle': 'SANTE.GA هي منصة الصحة الإلكترونية الرسمية في الغابون، تم تطويرها لربط المرضى والأطباء والمستشفيات والصيدليات. آمنة ومجانية ومتاحة في جميع أنحاء الغابون.',
    'landing.trust.badge1': 'بيانات آمنة 100%',
    'landing.trust.badge2': 'معتمد من الوزارة',
    'landing.trust.badge3': 'مجاني للمرضى',
    
    'landing.insurance.title': 'تحقق من حقوق CNAMGS الخاصة بك',
    'landing.insurance.placeholder': 'رقم عضو CNAMGS',
    'landing.insurance.verify': 'تحقق من تغطيتي',
    'landing.insurance.verifying': 'جاري التحقق...',
    'landing.insurance.subtitle': 'تحقق فوراً من حالة التأمين وحقوق الاسترداد',
    
    'landing.specialties.cardiologist': 'طبيب قلب',
    'landing.specialties.gynecologist': 'طبيب نساء',
    'landing.specialties.pediatrician': 'طبيب أطفال',
    'landing.specialties.dentist': 'طبيب أسنان',
    'landing.specialties.emergency': 'طوارئ',
    
    'landing.toast.required': 'حقل مطلوب',
    'landing.toast.enterNumber': 'الرجاء إدخال رقم عضو CNAMGS الخاص بك',
    'landing.toast.verified': 'اكتمل التحقق',
    'landing.toast.loginPrompt': 'الرجاء تسجيل الدخول لرؤية حقوقك الكاملة',
    
    'landing.footer.tagline': 'صحتك، أولويتنا',
    'landing.footer.description': 'المنصة الوطنية للصحة الإلكترونية في الغابون. ربط المرضى والأطباء ومهنيي الصحة للوصول العادل إلى الرعاية في جميع أنحاء الغابون.',
    'landing.footer.about': 'حول',
    'landing.footer.support': 'اتصل',
    'landing.footer.findDoctor': 'ابحث عن طبيب',
    'landing.footer.teleconsultation': 'الاستشارة عن بعد',
    'landing.footer.medicalRecord': 'السجل الطبي',
    'landing.footer.cnamgsRights': 'حقوق CNAMGS',
    'landing.footer.location': 'ليبرفيل، الغابون',
    'landing.footer.availability': 'دعم متاح 24/7',
    'landing.footer.copyright': 'SANTE.GA - وزارة الصحة في الغابون. جميع الحقوق محفوظة.',
    'landing.footer.privacy': 'الخصوصية',
    'landing.footer.terms': 'شروط الاستخدام',
    'landing.footer.helpCenter': 'المساعدة',
    
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
    
    // Landing Page
    'landing.services': 'Serviços',
    'landing.howItWorks': 'Como Funciona',
    'landing.servicesSubtitle': 'Serviços simples e rápidos para cuidar de você e sua família',
    'landing.howItWorksSubtitle': '4 passos simples para acessar os melhores cuidados',
    'landing.secure': 'Plataforma Nacional de E-Saúde do Gabão',
    'landing.cta.login': 'Entrar',
    'landing.cta.patient': 'Começar Agora',
    
    'landing.hero.title': 'Sua saúde ao',
    'landing.hero.titleHighlight': 'alcance de um clique',
    'landing.hero.subtitle': 'Encontre um médico, marque consultas, consulte online e gerencie sua saúde facilmente de Libreville, Port-Gentil ou qualquer lugar do Gabão',
    'landing.hero.patient': 'Cadastrar-se',
    
    'landing.search.doctor': 'Médico, especialidade, hospital...',
    'landing.search.location': 'Libreville, Port-Gentil...',
    'landing.search.button': 'Pesquisar',
    
    'landing.stats.doctors': 'Médicos Registrados',
    'landing.stats.facilities': 'Hospitais e Clínicas',
    'landing.stats.available': 'Serviço Disponível',
    'landing.stats.secure': 'Dados Seguros',
    
    'landing.service1.title': 'Marcar Consulta',
    'landing.service1.desc': 'Encontre e marque uma consulta com um médico em poucos cliques',
    'landing.service1.action': 'Encontrar um médico',
    'landing.service2.title': 'Teleconsulta',
    'landing.service2.desc': 'Consulte um médico por vídeo de casa, onde quer que esteja',
    'landing.service2.action': 'Iniciar consulta',
    'landing.service3.title': 'Prontuário Médico',
    'landing.service3.desc': 'Acesse todos os seus documentos médicos em um local seguro',
    'landing.service3.action': 'Ver meu prontuário',
    'landing.service4.title': 'Direitos CNAMGS',
    'landing.service4.desc': 'Verifique sua cobertura de saúde e acompanhe reembolsos',
    'landing.service4.action': 'Verificar meus direitos',
    
    'landing.step1.title': 'Crie sua conta',
    'landing.step1.desc': 'Registro simples em 2 minutos',
    'landing.step2.title': 'Procure um profissional',
    'landing.step2.desc': 'Por especialidade ou localização',
    'landing.step3.title': 'Reserve sua consulta',
    'landing.step3.desc': 'Escolha o horário que melhor lhe convier',
    'landing.step4.title': 'Consulte e acompanhe',
    'landing.step4.desc': 'Online ou presencial',
    
    'landing.trust.title': 'Uma plataforma confiável para todos os gaboneses',
    'landing.trust.subtitle': 'SANTE.GA é a plataforma oficial de e-saúde do Gabão, desenvolvida para conectar pacientes, médicos, hospitais e farmácias. Segura, gratuita e acessível em todo o Gabão.',
    'landing.trust.badge1': 'Dados 100% Seguros',
    'landing.trust.badge2': 'Validado pelo Ministério',
    'landing.trust.badge3': 'Grátis para Pacientes',
    
    'landing.insurance.title': 'Verifique seus direitos CNAMGS',
    'landing.insurance.placeholder': 'Número de Membro CNAMGS',
    'landing.insurance.verify': 'Verificar minha cobertura',
    'landing.insurance.verifying': 'Verificando...',
    'landing.insurance.subtitle': 'Verifique instantaneamente seu status de seguro e direitos de reembolso',
    
    'landing.specialties.cardiologist': 'Cardiologista',
    'landing.specialties.gynecologist': 'Ginecologista',
    'landing.specialties.pediatrician': 'Pediatra',
    'landing.specialties.dentist': 'Dentista',
    'landing.specialties.emergency': 'Emergência',
    
    'landing.toast.required': 'Campo obrigatório',
    'landing.toast.enterNumber': 'Por favor, insira seu número de membro CNAMGS',
    'landing.toast.verified': 'Verificação concluída',
    'landing.toast.loginPrompt': 'Por favor, faça login para ver seus direitos completos',
    
    'landing.footer.tagline': 'Sua saúde, nossa prioridade',
    'landing.footer.description': 'A plataforma nacional de e-saúde do Gabão. Conectando pacientes, médicos e profissionais de saúde para acesso equitativo aos cuidados em todo o Gabão.',
    'landing.footer.about': 'Sobre',
    'landing.footer.support': 'Contato',
    'landing.footer.findDoctor': 'Encontrar um médico',
    'landing.footer.teleconsultation': 'Teleconsulta',
    'landing.footer.medicalRecord': 'Prontuário médico',
    'landing.footer.cnamgsRights': 'Direitos CNAMGS',
    'landing.footer.location': 'Libreville, Gabão',
    'landing.footer.availability': 'Suporte 24/7 disponível',
    'landing.footer.copyright': 'SANTE.GA - Ministério da Saúde do Gabão. Todos os direitos reservados.',
    'landing.footer.privacy': 'Privacidade',
    'landing.footer.terms': 'Termos de Uso',
    'landing.footer.helpCenter': 'Ajuda',
    
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
