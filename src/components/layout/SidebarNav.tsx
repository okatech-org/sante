import { Home, Calendar, FileText, TestTube, UserSearch, CreditCard, User, BarChart3, Users, Clock, Building2, Activity, Shield, Settings, LucideIcon, Info, Phone, Mail, HelpCircle, Sparkles, BookOpen, Map } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarNavProps {
  mobile?: boolean;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
}

const publicNavItems: NavItem[] = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: Info, label: "À Propos", href: "/#about" },
  { icon: UserSearch, label: "Nos Services", href: "/#services" },
  { icon: HelpCircle, label: "FAQ", href: "/#faq" },
  { icon: Phone, label: "Contact", href: "/#contact" },
];

const patientNavItems: NavItem[] = [
  { icon: Home, label: "Accueil", href: "/dashboard" },
  { icon: Calendar, label: "Mes Rendez-vous", href: "/appointments", badge: 2 },
  { icon: FileText, label: "Mes Ordonnances", href: "/prescriptions", badge: 1 },
  { icon: TestTube, label: "Mes Résultats", href: "/results", badge: 2 },
  { icon: FileText, label: "Mon Dossier Médical", href: "/medical-record" },
  { icon: UserSearch, label: "Trouver un Prestataire", href: "/providers" },
  { icon: Map, label: "Cartographie Santé", href: "/cartography" },
  { icon: CreditCard, label: "Remboursements CNAMGS", href: "/reimbursements" },
  { icon: HelpCircle, label: "Aide & Support", href: "/support" },
];

const superAdminNavItems: NavItem[] = [
  { icon: BarChart3, label: "Tableau de Bord", href: "/admin/dashboard" },
  { icon: BookOpen, label: "Projet", href: "/admin/project" },
  { icon: Users, label: "Utilisateurs", href: "/admin/users" },
  { icon: Clock, label: "Approbations", href: "/admin/approvals", badge: 43 },
  { icon: Building2, label: "Établissements", href: "/admin/establishments" },
  { icon: Activity, label: "Professionnels", href: "/admin/professionals" },
  { icon: Map, label: "Cartographie", href: "/cartography" },
  { icon: Sparkles, label: "Démo", href: "/admin/demo" },
  { icon: Shield, label: "Logs & Audit", href: "/admin/audit" },
  { icon: Settings, label: "Paramètres", href: "/admin/settings" },
];

export const SidebarNav = ({ mobile = false }: SidebarNavProps) => {
  const { user, userRoles } = useAuth();
  
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
