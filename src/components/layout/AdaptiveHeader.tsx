import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Calendar,
  Users,
  FileText,
  Activity,
  Settings,
  LogOut,
  User,
  Bell,
  ChevronDown,
  Building2,
  Briefcase,
  Stethoscope,
  Shield,
  BarChart3,
  ClipboardList,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ElementType;
  permissions?: string[];
}

export function AdaptiveHeader() {
  const { workContext } = useMultiEstablishment();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Générer la navigation en fonction des permissions
  const getNavigationItems = (): NavigationItem[] => {
    if (!workContext) return [];

    const items: NavigationItem[] = [
      {
        label: 'Tableau de bord',
        path: '/dashboard',
        icon: Home
      }
    ];

    // Navigation pour les professionnels de santé
    if (workContext?.permissions.includes('consultation')) {
      items.push({
        label: 'Consultations',
        path: '/consultations',
        icon: Stethoscope,
        permissions: ['consultation']
      });
    }

    if (workContext?.permissions.includes('manage_appointments')) {
      items.push({
        label: 'Rendez-vous',
        path: '/appointments',
        icon: Calendar,
        permissions: ['manage_appointments']
      });
    }

    if (workContext?.permissions.includes('access_patient_dmp')) {
      items.push({
        label: 'Patients',
        path: '/patients',
        icon: Users,
        permissions: ['access_patient_dmp']
      });
    }

    if (workContext?.permissions.includes('prescription')) {
      items.push({
        label: 'Prescriptions',
        path: '/prescriptions',
        icon: FileText,
        permissions: ['prescription']
      });
    }

    // Navigation administrative
    if (workContext?.permissions.includes('billing')) {
      items.push({
        label: 'Facturation',
        path: '/billing',
        icon: DollarSign,
        permissions: ['billing']
      });
    }

    if (workContext?.permissions.includes('view_analytics')) {
      items.push({
        label: 'Statistiques',
        path: '/analytics',
        icon: BarChart3,
        permissions: ['view_analytics']
      });
    }

    // Admin de l'établissement
    if (workContext.currentAffiliation?.isEstablishmentAdmin) {
      items.push({
        label: 'Administration',
        path: '/admin/establishment',
        icon: Shield
      });
    }

    return items;
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive"
      });
    }
  };

  const getUserInitials = () => {
    if (!workContext) return 'U';
    // Utiliser les données du contexte pour obtenir les initiales
    return 'JD'; // À remplacer par les vraies initiales
  };

  const getEstablishmentBadgeColor = () => {
    switch (workContext?.currentEstablishment?.sector) {
      case 'public':
        return 'bg-blue-100 text-blue-700';
      case 'private':
        return 'bg-green-100 text-green-700';
      case 'confessional':
        return 'bg-purple-100 text-purple-700';
      case 'military':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et sélecteur d'établissement */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={workContext?.currentEstablishment?.theme?.logo || "/logo-sante-ga.png"}
                alt="Logo"
                className="h-8 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">
                  {workContext?.currentEstablishment?.name || "SANTE.GA"}
                </h1>
                {workContext?.currentEstablishment && (
                  <Badge className={`text-xs ${getEstablishmentBadgeColor()}`}>
                    {workContext.currentEstablishment.sector}
                  </Badge>
                )}
              </div>
            </Link>
          </div>

          {/* Navigation principale */}
          <nav className="hidden lg:flex items-center gap-6">
            {getNavigationItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Menu utilisateur */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">
                      {workContext?.currentAffiliation?.role || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {workContext?.currentAffiliation?.department || 'Général'}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>

                {workContext?.currentAffiliation?.isEstablishmentAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/admin/establishment')}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin établissement</span>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Barre de navigation mobile */}
      <div className="lg:hidden border-t border-gray-200">
        <div className="px-4 py-2 flex gap-4 overflow-x-auto">
          {getNavigationItems().slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
