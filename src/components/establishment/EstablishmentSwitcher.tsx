import React, { useState, useEffect } from 'react';
import { ChevronDown, Building2, Users, Settings, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Establishment {
  id: string;
  raison_sociale: string;
  type_etablissement: string;
  ville: string;
  province: string;
  role_in_establishment: string;
  is_admin: boolean;
  permissions: string[];
  status: string;
}

interface EstablishmentSwitcherProps {
  currentEstablishmentId?: string;
  onEstablishmentChange: (establishmentId: string) => void;
  className?: string;
}

export function EstablishmentSwitcher({ 
  currentEstablishmentId, 
  onEstablishmentChange,
  className = ""
}: EstablishmentSwitcherProps) {
  const { user } = useAuth();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [currentEstablishment, setCurrentEstablishment] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserEstablishments();
    }
  }, [user]);

  useEffect(() => {
    if (currentEstablishmentId && establishments.length > 0) {
      const establishment = establishments.find(e => e.id === currentEstablishmentId);
      setCurrentEstablishment(establishment || null);
    }
  }, [currentEstablishmentId, establishments]);

  const fetchUserEstablishments = async () => {
    try {
      setLoading(true);
      
      // Récupérer les établissements de l'utilisateur via la fonction SQL
      const { data, error } = await supabase.rpc('get_user_establishments', {
        _user_id: user?.id
      });

      if (error) {
        console.error('Erreur lors de la récupération des établissements:', error);
        return;
      }

      setEstablishments(data || []);
      
      // Si aucun établissement actuel n'est sélectionné, prendre le premier
      if (!currentEstablishmentId && data && data.length > 0) {
        onEstablishmentChange(data[0].establishment_id);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstablishmentChange = (establishmentId: string) => {
    onEstablishmentChange(establishmentId);
  };

  const getEstablishmentIcon = (type: string) => {
    switch (type) {
      case 'chu':
      case 'chr':
        return '🏥';
      case 'polyclinique':
      case 'clinique':
        return '🏥';
      case 'centre_medical':
        return '🏥';
      case 'hopital_departemental':
      case 'hopital_confessionnel':
        return '🏥';
      default:
        return '🏢';
    }
  };

  const getRoleColor = (role: string, isAdmin: boolean) => {
    if (isAdmin) return 'bg-red-100 text-red-800';
    if (role.includes('Chef') || role.includes('Directeur')) return 'bg-blue-100 text-blue-800';
    if (role.includes('Médecin')) return 'bg-green-100 text-green-800';
    if (role.includes('Infirmier')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (establishments.length === 0) {
    return (
      <Card className={`border-dashed ${className}`}>
        <CardContent className="p-4 text-center">
          <Building2 className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Aucun établissement assigné
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between h-auto p-3 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {getEstablishmentIcon(currentEstablishment?.type_etablissement || '')}
              </div>
              <div className="text-left">
                <div className="font-medium text-sm">
                  {currentEstablishment?.raison_sociale || 'Sélectionner un établissement'}
                </div>
                <div className="text-xs text-gray-500">
                  {currentEstablishment?.ville}, {currentEstablishment?.province}
                </div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-80" align="start">
          <div className="p-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Mes Établissements ({establishments.length})
            </p>
          </div>
          
          {establishments.map((establishment) => (
            <DropdownMenuItem
              key={establishment.id}
              onClick={() => handleEstablishmentChange(establishment.id)}
              className="p-3 cursor-pointer"
            >
              <div className="flex items-start space-x-3 w-full">
                <div className="text-2xl mt-1">
                  {getEstablishmentIcon(establishment.type_etablissement)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {establishment.raison_sociale}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(establishment.status)}`}
                    >
                      {establishment.status}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-2">
                    {establishment.ville}, {establishment.province}
                  </p>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRoleColor(establishment.role_in_establishment, establishment.is_admin)}`}
                    >
                      {establishment.role_in_establishment}
                    </Badge>
                    {establishment.is_admin && (
                      <Badge variant="destructive" className="text-xs">
                        Admin
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>Staff</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Planning</span>
                    </div>
                    {establishment.is_admin && (
                      <div className="flex items-center space-x-1">
                        <Settings className="h-3 w-3" />
                        <span>Admin</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="p-3 text-center text-sm text-blue-600 hover:text-blue-700">
            + Demander une affectation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default EstablishmentSwitcher;
