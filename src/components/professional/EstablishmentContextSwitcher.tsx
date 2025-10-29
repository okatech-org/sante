// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Building2, ChevronDown, Check, Briefcase, Clock, MapPin, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AccountService from '@/services/AccountService';

interface EstablishmentContext {
  establishment_id: string;
  establishment: {
    id: string;
    name: string;
    establishment_type: string;
    city: string;
    address: string;
  };
  role_title: string;
  department?: string;
  permissions: string[];
  schedule_type?: string;
  is_establishment_admin: boolean;
}

export function EstablishmentContextSwitcher() {
  const { user } = useAuth();
  const [establishments, setEstablishments] = useState<EstablishmentContext[]>([]);
  const [currentContext, setCurrentContext] = useState<EstablishmentContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserEstablishments();
      loadCurrentContext();
    }
  }, [user]);

  const fetchUserEstablishments = async () => {
    try {
      // Get professional ID
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!professional) return;

      // Get all establishments where professional works
      const establishments = await AccountService.getProfessionalEstablishments(professional.id);
      setEstablishments(establishments);
    } catch (error) {
      console.error('Failed to fetch establishments:', error);
    }
  };

  const loadCurrentContext = () => {
    const context = AccountService.getCurrentContext();
    if (context) {
      setCurrentContext(context);
    }
  };

  const handleSwitch = async (establishment: EstablishmentContext) => {
    setLoading(true);
    try {
      // Get professional ID
      const { data: professional } = await supabase
        .from('professionals')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!professional) throw new Error('Professional profile not found');

      const newContext = await AccountService.switchContext(
        professional.id,
        establishment.establishment_id
      );
      
      setCurrentContext({
        establishment_id: establishment.establishment_id,
        establishment: newContext.establishment,
        role_title: newContext.role,
        department: newContext.department,
        permissions: newContext.permissions,
        schedule_type: establishment.schedule_type,
        is_establishment_admin: establishment.is_establishment_admin
      });
      
      setIsOpen(false);
      
      toast.success('Contexte changé', {
        description: `Vous travaillez maintenant à ${newContext.establishment.name}`,
      });

      // Refresh the page to update all components with new context
      window.location.reload();
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message || 'Impossible de changer de contexte',
      });
    } finally {
      setLoading(false);
    }
  };

  if (establishments.length <= 1) {
    return null; // Don't show switcher if only one establishment
  }

  const getEstablishmentTypeColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'bg-red-100 text-red-700';
      case 'clinic': return 'bg-blue-100 text-blue-700';
      case 'medical_cabinet': return 'bg-green-100 text-green-700';
      case 'pharmacy': return 'bg-purple-100 text-purple-700';
      case 'laboratory': return 'bg-yellow-100 text-yellow-700';
      case 'imaging_center': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEstablishmentTypeLabel = (type: string) => {
    switch (type) {
      case 'hospital': return 'Hôpital';
      case 'clinic': return 'Clinique';
      case 'medical_cabinet': return 'Cabinet';
      case 'pharmacy': return 'Pharmacie';
      case 'laboratory': return 'Laboratoire';
      case 'imaging_center': return 'Imagerie';
      default: return 'Autre';
    }
  };

  const getScheduleTypeLabel = (type?: string) => {
    switch (type) {
      case 'full_time': return 'Temps plein';
      case 'part_time': return 'Temps partiel';
      case 'consultant': return 'Consultant';
      case 'on_call': return 'Astreinte';
      case 'volunteer': return 'Bénévole';
      default: return '';
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-3 px-4 py-2 h-auto"
          disabled={loading}
        >
          <Building2 className="w-5 h-5 text-muted-foreground" />
          <div className="text-left">
            <div className="text-sm font-semibold">
              {currentContext?.establishment?.name || 'Sélectionner établissement'}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentContext?.role_title || 'Aucun rôle'}
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[400px]">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase">
          Mes établissements ({establishments.length})
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {establishments.map((item) => {
          const isActive = currentContext?.establishment_id === item.establishment_id;
          
          return (
            <DropdownMenuItem
              key={item.establishment_id}
              onClick={() => handleSwitch(item)}
              disabled={loading || isActive}
              className={`cursor-pointer p-3 ${isActive ? 'bg-accent' : ''}`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {item.establishment.name}
                    </span>
                    {isActive && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Briefcase className="w-3 h-3" />
                      <span>{item.role_title}</span>
                    </div>
                    
                    {item.department && (
                      <Badge variant="outline" className="text-xs">
                        {item.department}
                      </Badge>
                    )}
                    
                    {item.is_establishment_admin && (
                      <Badge variant="default" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    
                    {item.schedule_type && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{getScheduleTypeLabel(item.schedule_type)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{item.establishment.address}, {item.establishment.city}</span>
                  </div>
                </div>
                
                <Badge 
                  variant="secondary" 
                  className={`ml-2 text-xs ${getEstablishmentTypeColor(item.establishment.establishment_type)}`}
                >
                  {getEstablishmentTypeLabel(item.establishment.establishment_type)}
                </Badge>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        {establishments.length === 0 && (
          <div className="px-3 py-4 text-center text-muted-foreground text-sm">
            Aucun établissement associé
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => window.location.href = '/professional/establishments'}
          className="text-sm text-primary cursor-pointer"
        >
          <Building2 className="w-4 h-4 mr-2" />
          Gérer mes établissements
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
