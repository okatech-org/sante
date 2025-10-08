import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarNav } from "./SidebarNav";
import { Button } from "@/components/ui/button";
import { Heart, LogOut, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import logoSante from "@/assets/logo_sante.png";

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  const { user, isSuperAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/super-admin/login");
  };

  if (!isSuperAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-sidebar sticky top-0">
        {/* Logo / Brand */}
        <div className="border-b p-4">
          <Link to="/dashboard/superadmin" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">SA</span>
            </div>
            <div>
              <h2 className="font-semibold text-sm">Super Admin</h2>
              <p className="text-xs text-muted-foreground">Santé.ga</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>

        {/* User Profile */}
        <div className="border-t p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2" style={{ borderColor: '#ff0088' }}>
              <AvatarFallback style={{ backgroundColor: '#ff0088', color: 'white' }}>
                SA
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Super Administrateur</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Heart className="h-3 w-3" />
            <span>Fait avec ❤️ au Gabon</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Header (only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar/95 backdrop-blur-xl border-b border-sidebar-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">
                Super Admin
              </h1>
              <p className="text-xs text-muted-foreground">Santé.ga</p>
            </div>
          </div>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-sidebar-accent/30 text-sidebar-foreground hover:bg-sidebar-accent transition-all">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar border-sidebar-border p-0">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-sidebar-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">SA</span>
                    </div>
                    <div>
                      <h2 className="font-semibold text-sm text-sidebar-foreground">Super Admin</h2>
                      <p className="text-xs text-muted-foreground">Santé.ga</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto">
                  <SidebarNav mobile />
                </div>

                {/* User Profile */}
                <div className="border-t border-sidebar-border p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2" style={{ borderColor: '#ff0088' }}>
                      <AvatarFallback style={{ backgroundColor: '#ff0088', color: 'white' }}>
                        SA
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.email}</p>
                      <p className="text-xs text-muted-foreground">Super Administrateur</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>

                {/* Footer */}
                <div className="border-t border-sidebar-border p-4">
                  <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Heart className="h-3 w-3" />
                    <span>Fait avec ❤️ au Gabon</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-20">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};
