import { Home, Calendar, FileText, TestTube, Search, CreditCard, User, BarChart3, Users, Clock, Building2, Activity, Shield, Settings, LucideIcon, Info, Phone, Mail, HelpCircle, Sparkles, BookOpen, Map, Heart, Pill, Video, ClipboardList, DollarSign, TrendingUp, Stethoscope, UserPlus, Link2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMultiEstablishment } from "@/contexts/MultiEstablishmentContext";
import { getMenuForContext, MenuSection } from "@/config/menuDefinitions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SidebarNavProps {
  mobile?: boolean;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
  permission?: string;
}

export const SidebarNav = ({ mobile = false }: SidebarNavProps) => {
  const { user } = useOfflineAuth();
  const userRoles = user?.user_metadata?.roles || [];
  const { t } = useLanguage();
  const { currentEstablishment, currentRole, hasPermission } = useMultiEstablishment();
  
  const publicNavItems: NavItem[] = [
    { icon: Home, label: t('nav.home'), href: "/" },
    { icon: Info, label: t('nav.about'), href: "/#about" },
    { icon: Search, label: t('nav.services'), href: "/#services" },
    { icon: Heart, label: t('nav.awareness'), href: "/awareness" },
    { icon: HelpCircle, label: t('nav.faq'), href: "/#faq" },
    { icon: Phone, label: t('nav.contact'), href: "/#contact" },
  ];

  const patientNavItems: NavItem[] = [
    { icon: Home, label: "Tableau de bord", href: "/dashboard/patient" },
    { icon: Calendar, label: "Mes rendez-vous", href: "/appointments", badge: 2 },
    { icon: Activity, label: "Téléconsultation", href: "/teleconsultation" },
    { icon: FileText, label: "Dossier Médical", href: "/medical-record" },
    { icon: Pill, label: "Mes ordonnances", href: "/prescriptions", badge: 1 },
    { icon: TestTube, label: "Résultats d'analyses", href: "/results" },
    { icon: Shield, label: "Droits CNAMGS", href: "/reimbursements" },
    { icon: Mail, label: "Messages", href: "/messages", badge: 3 },
    { icon: Settings, label: "Paramètres", href: "/parametres" },
  ];

  const superAdminNavItems: NavItem[] = [
    { icon: BarChart3, label: t('nav.adminDashboard'), href: "/admin/dashboard" },
    { icon: BookOpen, label: t('nav.project'), href: "/admin/project" },
    { icon: Users, label: t('nav.users'), href: "/admin/users" },
    { icon: Clock, label: t('nav.approvals'), href: "/admin/approvals", badge: 43 },
    { icon: Activity, label: "Acteurs de Santé", href: "/admin/health-actors" },
    { icon: Map, label: t('nav.cartography'), href: "/cartography" },
    { icon: Sparkles, label: t('nav.demo'), href: "/admin/demo" },
    { icon: Shield, label: t('nav.audit'), href: "/admin/audit" },
    { icon: Settings, label: t('nav.settings'), href: "/admin/settings" },
  ];

  const doctorNavItems: NavItem[] = [
    { icon: Home, label: "Tableau de bord", href: "/dashboard/professional" },
    { icon: Calendar, label: "Agenda & RDV", href: "/professional/agenda", badge: 8 },
    { icon: Users, label: "Mes patients", href: "/professional/patients" },
    { icon: Video, label: "Téléconsultations", href: "/professional/teleconsultations" },
    { icon: ClipboardList, label: "Consultations", href: "/professional/consultations" },
    { icon: Pill, label: "Prescriptions", href: "/professional/prescriptions" },
    { icon: DollarSign, label: "Finances & CNAMGS", href: "/professional/finances" },
    { icon: TrendingUp, label: "Statistiques", href: "/professional/stats" },
    { icon: Mail, label: "Messages", href: "/professional/messages", badge: 5 },
    { icon: Stethoscope, label: "Télé-expertise", href: "/professional/tele-expertise" },
    { icon: Link2, label: "Intégrations", href: "/professional/integrations" },
    { icon: Settings, label: "Paramètres", href: "/professional/settings" },
  ];
  
  // Détermine le menu à afficher selon l'état de connexion et les rôles
  let menuSections: MenuSection[] = [];
  
  if (!user) {
    // Utilisateur non connecté: menu public
    menuSections = [{
      label: "Navigation",
      items: publicNavItems
    }];
  } else if (userRoles.includes('super_admin')) {
    // Super admin: menu admin
    menuSections = [{
      label: "Administration",
      items: superAdminNavItems
    }];
  } else if (currentEstablishment && currentRole) {
    // Professionnel: menu dynamique selon établissement et rôle
    const establishmentType = currentEstablishment.establishment?.type || 'cabinet_medical';
    menuSections = getMenuForContext(establishmentType, currentRole);
  } else if (userRoles.includes('doctor') || userRoles.includes('medical_staff')) {
    // Fallback: menu médecin par défaut
    menuSections = [{
      label: "Professionnel",
      items: doctorNavItems
    }];
  } else {
    // Fallback: menu patient
    menuSections = [{
      label: "Patient",
      items: patientNavItems
    }];
  }

  // Filtrer les items selon les permissions
  const filterByPermissions = (items: NavItem[]) => {
    if (!currentEstablishment) return items;
    
    return items.filter(item => {
      if (!item.permission) return true;
      return hasPermission(item.permission);
    });
  };

  return (
    <nav className={cn("flex flex-col gap-1 p-4", mobile && "pt-6")}>
      {menuSections.length === 1 ? (
        // Menu simple sans sections
        <div className="space-y-1">
          {filterByPermissions(menuSections[0].items).map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-destructive text-destructive-foreground rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      ) : (
        // Menu avec sections accordéon
        <Accordion type="multiple" defaultValue={menuSections.map((_, i) => `section-${i}`)} className="space-y-2">
          {menuSections.map((section, sectionIndex) => (
            <AccordionItem key={`section-${sectionIndex}`} value={`section-${sectionIndex}`} className="border-0">
              <AccordionTrigger className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:no-underline">
                {section.label}
              </AccordionTrigger>
              <AccordionContent className="pb-0 pt-1">
                <div className="space-y-1">
                  {filterByPermissions(section.items).map((item) => (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-destructive text-destructive-foreground rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </nav>
  );
};
