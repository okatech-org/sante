import { Home, Calendar, FileText, TestTube, UserSearch, CreditCard, User, BarChart3, Users, Clock, Building2, Activity, Shield, Settings, LucideIcon, Info, Phone, Mail, HelpCircle, Sparkles, BookOpen, Map, Heart, Pill } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarNavProps {
  mobile?: boolean;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
}

export const SidebarNav = ({ mobile = false }: SidebarNavProps) => {
  const { user, userRoles } = useAuth();
  const { t } = useLanguage();
  
  const publicNavItems: NavItem[] = [
    { icon: Home, label: t('nav.home'), href: "/" },
    { icon: Info, label: t('nav.about'), href: "/#about" },
    { icon: UserSearch, label: t('nav.services'), href: "/#services" },
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
    { icon: Building2, label: t('nav.establishments'), href: "/admin/establishments" },
    { icon: Activity, label: t('nav.professionals'), href: "/admin/professionals" },
    { icon: Map, label: t('nav.cartography'), href: "/cartography" },
    { icon: Sparkles, label: t('nav.demo'), href: "/admin/demo" },
    { icon: Shield, label: t('nav.audit'), href: "/admin/audit" },
    { icon: Settings, label: t('nav.settings'), href: "/admin/settings" },
  ];
  
  // Détermine le menu à afficher selon l'état de connexion et les rôles
  let navItems: NavItem[];
  if (!user) {
    navItems = publicNavItems;
  } else if (userRoles.includes('super_admin')) {
    navItems = superAdminNavItems;
  } else {
    navItems = patientNavItems;
  }

  return (
    <nav className={cn("flex flex-col gap-1 p-4", mobile && "pt-6")}>
      {navItems.map((item) => (
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
    </nav>
  );
};
