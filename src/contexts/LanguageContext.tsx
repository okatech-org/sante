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
    'nav.adminDashboard': 'Tableau de Bord',
    'nav.project': 'Projet',
    'nav.users': 'Utilisateurs',
    'nav.approvals': 'Approbations',
    'nav.establishments': 'Établissements',
    'nav.professionals': 'Professionnels',
    'nav.demo': 'Démo',
    'nav.audit': 'Logs & Audit',
    
    // Dashboard & Appointments
    'dashboard.welcome': 'Bienvenue',
    'dashboard.quickActions': 'Actions rapides',
    'dashboard.myAppointments': 'Mes Rendez-vous',
    'dashboard.noAppointments': 'Aucun rendez-vous prévu',
    'dashboard.makeAppointment': 'Prendre rendez-vous',
    'dashboard.viewAllAppointments': 'Voir tous mes RDV',
    'dashboard.viewDetails': 'Voir détails',
    'dashboard.cancel': 'Annuler',
    'dashboard.consultation': 'Consultation',
    'dashboard.teleconsultation': 'Téléconsultation',
    'dashboard.exam': 'Examen',
    
    // Prescriptions
    'prescriptions.title': 'Mes Ordonnances',
    'prescriptions.new': 'Nouvelle',
    'prescriptions.news': 'Nouvelles',
    'prescriptions.notDispensed': 'Non dispensée',
    'prescriptions.dispensed': 'Dispensée',
    'prescriptions.expired': 'Expirée',
    'prescriptions.date': 'Date',
    'prescriptions.prescriber': 'Prescripteur',
    'prescriptions.medication': 'médicament',
    'prescriptions.medications': 'médicaments',
    'prescriptions.viewPrescription': 'Voir l\'ordonnance',
    'prescriptions.findPharmacy': 'Trouver une pharmacie',
    'prescriptions.viewAll': 'Toutes mes ordonnances',
    
    // Results
    'results.title': 'Mes Résultats d\'Examens',
    'results.new': 'Nouveau',
    'results.news': 'Nouveaux',
    'results.biology': 'Biologie',
    'results.imaging': 'Imagerie',
    'results.available': 'Disponible',
    'results.labCenter': 'Labo/Centre',
    'results.prescriber': 'Prescripteur',
    'results.downloadPdf': 'Télécharger PDF',
    'results.viewAll': 'Tous mes résultats',
    
    // Insurance
    'insurance.addInsurance': 'Ajoutez votre assurance',
    'insurance.addDescription': 'Pour suivre vos remboursements et simplifier vos démarches',
    'insurance.addButton': 'Ajouter mon assurance',
    'insurance.cnamgsInsured': 'Assuré CNAMGS',
    'insurance.cnssInsured': 'Assuré CNSS',
    'insurance.active': 'Actif',
    'insurance.checkRights': 'Vérifier mes droits',
    'insurance.coverageRate': 'Taux de couverture',
    'insurance.remainingBalance': 'Plafond restant',
    'insurance.contributionsUpToDate': 'Cotisations à jour',
    'insurance.toVerify': 'À vérifier',
    'insurance.lastContribution': 'Dernière cotisation',
    'insurance.consultCnss': 'Consulter e.CNSS.ga',
    
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
    'common.actions': 'Actions',
    'common.view': 'Voir',
    'common.export': 'Exporter',
    'common.filter': 'Filtrer',
    'common.reset': 'Réinitialiser',
    'common.noResults': 'Aucun résultat',
    'common.results': 'Résultats',
    
    // Admin
    'admin.dashboard': 'Administration SANTE.GA',
    'admin.subtitle': 'Gestion Complète de l\'Écosystème',
    'admin.users': 'Gestion des Utilisateurs',
    'admin.usersSubtitle': 'Administrez tous les utilisateurs de la plateforme SANTE.GA',
    'admin.totalUsers': 'Utilisateurs Total',
    'admin.activeUsers': 'Utilisateurs Actifs',
    'admin.pendingApprovals': 'En Attente',
    'admin.quickActions': 'Actions Rapides',
    'admin.recentActivity': 'Activité Récente',
    'admin.createUser': 'Créer un Utilisateur',
    'admin.createUserDesc': 'Ajouter un nouveau compte système',
    'admin.registerEstablishment': 'Enregistrer Établissement',
    'admin.registerEstablishmentDesc': 'Hôpital, clinique ou centre médical',
    'admin.exportData': 'Exporter Données',
    'admin.exportDataDesc': 'Rapports et statistiques système',
    'admin.allUsers': 'Tous les utilisateurs',
    'admin.manageRoles': 'Gérer les rôles',
    'admin.administrators': 'Administrateurs',
    'admin.patients': 'Patients',
    'admin.professionals': 'Professionnels',
    'admin.assignRole': 'Attribuer un rôle',
    'admin.accessDenied': 'Accès refusé',
    'admin.noPermission': 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.',
    
    // Approvals
    'approvals.title': 'Approbations en attente',
    'approvals.subtitle': 'Validez les inscriptions des professionnels de santé',
    'approvals.pending': 'en attente',
    'approvals.total': 'Total',
    'approvals.doctors': 'Médecins',
    'approvals.pharmacies': 'Pharmacies',
    'approvals.laboratories': 'Laboratoires',
    'approvals.hospitals': 'Hôpitaux',
    'approvals.allTypes': 'Tous les types',
    'approvals.examine': 'Examiner',
    'approvals.approve': 'Approuver',
    'approvals.reject': 'Refuser',
    'approvals.noPending': 'Aucune demande en attente',
    'approvals.allProcessed': 'Toutes les demandes ont été traitées',
    
    // Project Documentation
    'project.title': 'Documentation SANTE.GA',
    'project.subtitle': 'Plateforme nationale de santé numérique du Gabon',
    'project.version': 'v1.0.0',
    'project.productionReady': 'Production Ready',
    'project.overview': 'Vue d\'ensemble',
    'project.features': 'Fonctionnalités',
    'project.architecture': 'Architecture',
    'project.backend': 'Backend',
    'project.frontend': 'Frontend',
    'project.implementation': 'Implémentation',
    'project.security': 'Sécurité',
    'project.roadmap': 'Roadmap',
    'project.presentation': 'Présentation du Projet',
    'project.mission': 'Mission',
    'project.missionDesc': 'SANTE.GA est la plateforme nationale de santé numérique du Gabon qui vise à digitaliser et moderniser l\'écosystème de santé gabonais en connectant patients, professionnels de santé, établissements médicaux et organismes d\'assurance (CNAMGS, CNSS).',
    'project.mainObjectives': 'Objectifs Principaux',
    'project.healthcareAccess': 'Accessibilité des Soins',
    'project.healthcareAccessDesc': 'Faciliter l\'accès aux soins pour tous les Gabonais',
    'project.medicalRecord': 'Dossier Médical Unique',
    'project.medicalRecordDesc': 'Centraliser l\'historique médical de chaque patient',
    'project.adminManagement': 'Gestion Administrative',
    'project.adminManagementDesc': 'Simplifier les démarches et remboursements',
    'project.telemedicine': 'Télémédecine',
    'project.telemedicineDesc': 'Permettre les consultations à distance',
    'project.ecosystem': 'Écosystème',
    'project.systemActors': 'Acteurs du Système',
    'project.technologies': 'Technologies Utilisées',
    
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
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.appointments': 'My Appointments',
    'nav.providers': 'Find a Provider',
    'nav.cartography': 'Health Map',
    'nav.prescriptions': 'My Prescriptions',
    'nav.results': 'My Results',
    'nav.medicalRecord': 'My Medical Record',
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
    'nav.adminDashboard': 'Dashboard',
    'nav.project': 'Project',
    'nav.users': 'Users',
    'nav.approvals': 'Approvals',
    'nav.establishments': 'Establishments',
    'nav.professionals': 'Professionals',
    'nav.demo': 'Demo',
    'nav.audit': 'Logs & Audit',
    
    // Dashboard & Appointments
    'dashboard.welcome': 'Welcome',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.myAppointments': 'My Appointments',
    'dashboard.noAppointments': 'No scheduled appointments',
    'dashboard.makeAppointment': 'Make an appointment',
    'dashboard.viewAllAppointments': 'View all my appointments',
    'dashboard.viewDetails': 'View details',
    'dashboard.cancel': 'Cancel',
    'dashboard.consultation': 'Consultation',
    'dashboard.teleconsultation': 'Teleconsultation',
    'dashboard.exam': 'Exam',
    
    // Prescriptions
    'prescriptions.title': 'My Prescriptions',
    'prescriptions.new': 'New',
    'prescriptions.news': 'New',
    'prescriptions.notDispensed': 'Not dispensed',
    'prescriptions.dispensed': 'Dispensed',
    'prescriptions.expired': 'Expired',
    'prescriptions.date': 'Date',
    'prescriptions.prescriber': 'Prescriber',
    'prescriptions.medication': 'medication',
    'prescriptions.medications': 'medications',
    'prescriptions.viewPrescription': 'View prescription',
    'prescriptions.findPharmacy': 'Find a pharmacy',
    'prescriptions.viewAll': 'All my prescriptions',
    
    // Results
    'results.title': 'My Exam Results',
    'results.new': 'New',
    'results.news': 'New',
    'results.biology': 'Biology',
    'results.imaging': 'Imaging',
    'results.available': 'Available',
    'results.labCenter': 'Lab/Center',
    'results.prescriber': 'Prescriber',
    'results.downloadPdf': 'Download PDF',
    'results.viewAll': 'All my results',
    
    // Insurance
    'insurance.addInsurance': 'Add your insurance',
    'insurance.addDescription': 'To track reimbursements and simplify your procedures',
    'insurance.addButton': 'Add my insurance',
    'insurance.cnamgsInsured': 'CNAMGS Insured',
    'insurance.cnssInsured': 'CNSS Insured',
    'insurance.active': 'Active',
    'insurance.checkRights': 'Check my rights',
    'insurance.coverageRate': 'Coverage rate',
    'insurance.remainingBalance': 'Remaining balance',
    'insurance.contributionsUpToDate': 'Contributions up to date',
    'insurance.toVerify': 'To verify',
    'insurance.lastContribution': 'Last contribution',
    'insurance.consultCnss': 'Consult e.CNSS.ga',
    
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
    'common.actions': 'Actions',
    'common.view': 'View',
    'common.export': 'Export',
    'common.filter': 'Filter',
    'common.reset': 'Reset',
    'common.noResults': 'No results',
    'common.results': 'Results',
    
    // Admin
    'admin.dashboard': 'SANTE.GA Administration',
    'admin.subtitle': 'Complete Ecosystem Management',
    'admin.users': 'User Management',
    'admin.usersSubtitle': 'Manage all users of the SANTE.GA platform',
    'admin.totalUsers': 'Total Users',
    'admin.activeUsers': 'Active Users',
    'admin.pendingApprovals': 'Pending',
    'admin.quickActions': 'Quick Actions',
    'admin.recentActivity': 'Recent Activity',
    'admin.createUser': 'Create User',
    'admin.createUserDesc': 'Add a new system account',
    'admin.registerEstablishment': 'Register Establishment',
    'admin.registerEstablishmentDesc': 'Hospital, clinic or medical center',
    'admin.exportData': 'Export Data',
    'admin.exportDataDesc': 'System reports and statistics',
    'admin.allUsers': 'All users',
    'admin.manageRoles': 'Manage roles',
    'admin.administrators': 'Administrators',
    'admin.patients': 'Patients',
    'admin.professionals': 'Professionals',
    'admin.assignRole': 'Assign role',
    'admin.accessDenied': 'Access Denied',
    'admin.noPermission': 'You do not have the necessary permissions to access this page.',
    
    // Approvals
    'approvals.title': 'Pending Approvals',
    'approvals.subtitle': 'Validate healthcare professional registrations',
    'approvals.pending': 'pending',
    'approvals.total': 'Total',
    'approvals.doctors': 'Doctors',
    'approvals.pharmacies': 'Pharmacies',
    'approvals.laboratories': 'Laboratories',
    'approvals.hospitals': 'Hospitals',
    'approvals.allTypes': 'All types',
    'approvals.examine': 'Examine',
    'approvals.approve': 'Approve',
    'approvals.reject': 'Reject',
    'approvals.noPending': 'No pending requests',
    'approvals.allProcessed': 'All requests have been processed',
    
    // Project Documentation
    'project.title': 'SANTE.GA Documentation',
    'project.subtitle': 'Gabon\'s National Digital Health Platform',
    'project.version': 'v1.0.0',
    'project.productionReady': 'Production Ready',
    'project.overview': 'Overview',
    'project.features': 'Features',
    'project.architecture': 'Architecture',
    'project.backend': 'Backend',
    'project.frontend': 'Frontend',
    'project.implementation': 'Implementation',
    'project.security': 'Security',
    'project.roadmap': 'Roadmap',
    'project.presentation': 'Project Overview',
    'project.mission': 'Mission',
    'project.missionDesc': 'SANTE.GA is Gabon\'s national digital health platform that aims to digitize and modernize the Gabonese healthcare ecosystem by connecting patients, healthcare professionals, medical establishments and insurance organizations (CNAMGS, CNSS).',
    'project.mainObjectives': 'Main Objectives',
    'project.healthcareAccess': 'Healthcare Access',
    'project.healthcareAccessDesc': 'Facilitate access to healthcare for all Gabonese',
    'project.medicalRecord': 'Unified Medical Record',
    'project.medicalRecordDesc': 'Centralize each patient\'s medical history',
    'project.adminManagement': 'Administrative Management',
    'project.adminManagementDesc': 'Simplify procedures and reimbursements',
    'project.telemedicine': 'Telemedicine',
    'project.telemedicineDesc': 'Enable remote consultations',
    'project.ecosystem': 'Ecosystem',
    'project.systemActors': 'System Actors',
    'project.technologies': 'Technologies Used',
    
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
