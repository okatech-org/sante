import { Home, Calendar, FileText, TestTube, UserSearch, CreditCard, User, BarChart3, Users, Clock, Building2, Activity, Shield, Settings, LucideIcon } from "lucide-react";
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

const patientNavItems: NavItem[] = [
  { icon: Home, label: "Accueil", href: "/dashboard" },
  { icon: Calendar, label: "Mes Rendez-vous", href: "/appointments" },
  { icon: FileText, label: "Mes Ordonnances", href: "/prescriptions" },
  { icon: TestTube, label: "Mes Résultats", href: "/results" },
  { icon: UserSearch, label: "Trouver un Prestataire", href: "/providers" },
  { icon: CreditCard, label: "Remboursements", href: "/reimbursements" },
  { icon: User, label: "Mon Profil", href: "/profile" },
];

const superAdminNavItems: NavItem[] = [
  { icon: BarChart3, label: "Tableau de Bord", href: "/admin/dashboard" },
  { icon: Users, label: "Utilisateurs", href: "/admin/users" },
  { icon: Clock, label: "Approbations", href: "/admin/approvals", badge: 43 },
  { icon: Building2, label: "Établissements", href: "/admin/establishments" },
  { icon: Activity, label: "Professionnels", href: "/admin/professionals" },
  { icon: Shield, label: "Logs & Audit", href: "/admin/audit" },
  { icon: Settings, label: "Paramètres", href: "/admin/settings" },
];

export const SidebarNav = ({ mobile = false }: SidebarNavProps) => {
  const { userRoles } = useAuth();
  const isSuperAdmin = userRoles.includes('super_admin');
  const navItems = isSuperAdmin ? superAdminNavItems : patientNavItems;

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
