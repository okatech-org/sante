import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarNav } from "./SidebarNav";
import { Button } from "@/components/ui/button";
import { Heart, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  const { user, isSuperAdmin, signOut } = useAuth();
  const navigate = useNavigate();

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
      {/* Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 flex-col border-r bg-sidebar sticky top-0">
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};
