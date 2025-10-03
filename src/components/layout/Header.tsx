import { Heart, Menu, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "./SidebarNav";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";



export const Header = () => {
  const { user, hasRole, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isSuperAdmin = user && hasRole("super_admin");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-xl font-bold text-foreground">SANTE<span className="text-primary">.GA</span></span>
        </Link>

        {/* Menu hamburger mobile */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">{t('header.openMenu')}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-16 items-center gap-2 border-b px-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-lg font-bold">SANTE<span className="text-primary">.GA</span></span>
            </div>
            <SidebarNav mobile />
            
            {/* Actions mobile */}
            <div className="p-4 border-t space-y-2">
              <div className="flex justify-center gap-2 mb-2">
                <ThemeToggle />
                <LanguageToggle />
              </div>
              {user ? (
                <>
                  {isSuperAdmin && (
                    <Link to="/admin" className="block">
                      <Button variant="outline" size="lg" className="w-full btn-mobile-xxl">
                        <Shield className="mr-2 h-5 w-5" />
                        {t('header.adminPanel')}
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full btn-mobile-xxl"
                    onClick={handleSignOut}
                  >
                    {t('header.signOut')}
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block">
                    <Button variant="ghost" size="lg" className="w-full btn-mobile-xxl">
                      {t('header.signIn')}
                    </Button>
                  </Link>
                  <Link to="/register" className="block">
                    <Button size="lg" className="w-full btn-mobile-xxl">
                      {t('header.signUp')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Boutons desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          {user ? (
            <>
              {isSuperAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="lg">
                    <Shield className="mr-2 h-5 w-5" />
                    {t('header.admin')}
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="lg" onClick={handleSignOut}>
                {t('header.signOut')}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="lg">
                  {t('header.signIn')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg">
                  {t('header.signUp')}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
