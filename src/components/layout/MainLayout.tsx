import { ReactNode } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface MainLayoutProps {
  children: ReactNode;
}

const routeLabels: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/appointments": "Mes Rendez-vous",
  "/appointments/confirmation": "Confirmation",
  "/prescriptions": "Mes Ordonnances",
  "/results": "Mes Résultats",
  "/providers": "Trouver un Prestataire",
  "/cartography": "Cartographie Santé",
  "/medical-record": "Mon Dossier Médical",
  "/reimbursements": "Remboursements CNAMGS",
  "/messages": "Messages",
  "/parametres": "Mon Profil",
  "/admin": "Administration",
  "/admin/dashboard": "Tableau de Bord Admin",
  "/admin/users": "Utilisateurs",
  "/admin/approvals": "Approbations",
  "/admin/establishments": "Établissements",
  "/admin/professionals": "Professionnels",
  "/admin/demo": "Démo",
  "/admin/project": "Projet",
  "/admin/audit": "Logs & Audit",
  "/admin/settings": "Paramètres",
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useOfflineAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Générer les breadcrumbs
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs: Array<{ path: string; label: string }> = [];

  // Déterminer la page d'accueil selon le rôle
  const homePath = location.pathname.startsWith("/admin") ? "/admin/dashboard" : "/dashboard";
  const homeLabel = location.pathname.startsWith("/admin") ? "Admin" : "Accueil";

  // Construire les breadcrumbs
  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeLabels[currentPath] || segment;
    
    if (index < pathSegments.length - 1) {
      breadcrumbs.push({ path: currentPath, label });
    }
  });

  const currentPageLabel = routeLabels[location.pathname] || pathSegments[pathSegments.length - 1] || "Page";
  const showBreadcrumbs = location.pathname !== "/" && location.pathname !== homePath;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {/* Breadcrumb Navigation */}
          {showBreadcrumbs && user && (
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to={homePath} className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Home className="h-4 w-4" />
                          <span className="hidden sm:inline">{homeLabel}</span>
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    
                    {breadcrumbs.map((crumb) => (
                      <div key={crumb.path} className="flex items-center">
                        <BreadcrumbSeparator>
                          <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link to={crumb.path} className="hover:text-primary transition-colors">
                              {crumb.label}
                            </Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      </div>
                    ))}
                    
                    {breadcrumbs.length > 0 && (
                      <BreadcrumbSeparator>
                        <ChevronRight className="h-4 w-4" />
                      </BreadcrumbSeparator>
                    )}
                    
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-semibold">{currentPageLabel}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                {/* Bouton retour rapide */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(homePath)}
                  className="hidden sm:flex items-center gap-2 hover:bg-primary/10"
                >
                  <Home className="h-4 w-4" />
                  Retour
                </Button>
              </div>
            </div>
          )}
          
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      {user && <MobileBottomNav />}
    </div>
  );
};
