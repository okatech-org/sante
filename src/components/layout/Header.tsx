import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoSante from "@/assets/logo_sante.png";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const { user, signOut } = useOfflineAuth();
  const userRoles = user?.user_metadata?.roles || [];
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Détermine le lien du tableau de bord selon le contexte
  const getDashboardLink = () => {
    // Si on est sur une page démo, retourner vers cette démo
    if (location.pathname.startsWith('/demo/doctor')) return '/demo/doctor';
    if (location.pathname.startsWith('/demo/specialist')) return '/demo/specialist';
    if (location.pathname.startsWith('/demo/hospital')) return '/demo/hospital';
    if (location.pathname.startsWith('/demo/clinic')) return '/demo/clinic';
    
    // Si on est connecté et on a un rôle professionnel
    if (user && (userRoles.includes('doctor') || userRoles.includes('medical_staff'))) {
      return '/dashboard/professional';
    }
    
    // Par défaut, dashboard patient
    return '/dashboard/patient';
  };

  const dashboardLink = getDashboardLink();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={logoSante} 
            alt="SANTE.GA Logo" 
            className="h-10 w-auto object-contain"
          />
          <span className="text-lg font-bold">
            <span className="text-foreground">SANTE</span>
            <span className="text-primary">.GA</span>
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {user || location.pathname.startsWith('/demo') ? (
            <>
              <Link to={dashboardLink} className="text-sm font-medium hover:text-primary transition-colors">
                Tableau de bord
              </Link>
              <Link to="/appointments" className="text-sm font-medium hover:text-primary transition-colors">
                Rendez-vous
              </Link>
              <Link to="/parametres" className="text-sm font-medium hover:text-primary transition-colors">
                Profil
              </Link>
            </>
          ) : (
            <>
              <a href="/#services" className="text-sm font-medium hover:text-primary transition-colors">
                Services
              </a>
              <a href="/#about" className="text-sm font-medium hover:text-primary transition-colors">
                À propos
              </a>
              <a href="/#professionals" className="text-sm font-medium hover:text-primary transition-colors">
                Professionnels
              </a>
              <Link to="/awareness" className="text-sm font-medium hover:text-primary transition-colors">
                Sensibilisation
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          
          {/* Boutons Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {user.user_metadata?.roles?.includes('super_admin') && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/dashboard">{t('header.adminPanel')}</Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  {t('header.signOut')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login/patient">{t('header.signIn')}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register/patient">{t('header.signUp')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Menu Mobile */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('header.openMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {user || location.pathname.startsWith('/demo') ? (
                  <>
                    <Link to={dashboardLink} className="text-sm font-medium hover:text-primary transition-colors py-2">
                      Tableau de bord
                    </Link>
                    <Link to="/appointments" className="text-sm font-medium hover:text-primary transition-colors py-2">
                      Rendez-vous
                    </Link>
                    <Link to="/parametres" className="text-sm font-medium hover:text-primary transition-colors py-2">
                      Profil
                    </Link>
                  </>
                ) : (
                  <>
                    <a href="/#services" className="text-sm font-medium hover:text-primary transition-colors py-2">
                      Services
                    </a>
                    <a href="/#about" className="text-sm font-medium hover:text-primary transition-colors py-2">
                      À propos
                    </a>
                    <a href="/#professionals" className="text-sm font-medium hover:text-primary transition-colors py-2">
                      Professionnels
                    </a>
                    <Link to="/awareness" className="text-sm font-medium hover:text-primary transition-colors py-2">
                      Sensibilisation
                    </Link>
                  </>
                )}
                
                <div className="border-t pt-4 mt-4 flex flex-col gap-2">
                  {user ? (
                    <>
                      {user.user_metadata?.roles?.includes('super_admin') && (
                        <Button variant="ghost" size="sm" asChild className="justify-start">
                          <Link to="/admin/dashboard">{t('header.admin')}</Link>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={handleSignOut} className="justify-start">
                        {t('header.signOut')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" asChild className="justify-start">
                        <Link to="/login/patient">{t('header.signIn')}</Link>
                      </Button>
                      <Button size="sm" asChild className="justify-start">
                        <Link to="/register/patient">{t('header.signUp')}</Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
