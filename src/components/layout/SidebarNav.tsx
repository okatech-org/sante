import { Home, Calendar, FileText, TestTube, UserSearch, CreditCard, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  mobile?: boolean;
}

const navItems = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: Calendar, label: "Mes Rendez-vous", href: "/appointments" },
  { icon: FileText, label: "Mes Ordonnances", href: "/prescriptions" },
  { icon: TestTube, label: "Mes Résultats", href: "/results" },
  { icon: UserSearch, label: "Trouver un Prestataire", href: "/providers" },
  { icon: CreditCard, label: "Remboursements", href: "/reimbursements" },
  { icon: User, label: "Mon Profil", href: "/profile" },
];

export const SidebarNav = ({ mobile = false }: SidebarNavProps) => {
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
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
