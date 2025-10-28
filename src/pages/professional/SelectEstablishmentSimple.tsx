import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, ChevronRight, MapPin, Users, Calendar, 
  Shield, Briefcase, Clock, Star, Check, Home, Settings, LogOut, Sun, Moon, Laptop, Globe
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logoSante from '@/assets/logo_sante.png';

export default function SelectEstablishmentSimple() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [selectedEstablishment, setSelectedEstablishment] = useState<string | null>(null);
  const [userEstablishments, setUserEstablishments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [language, setLanguage] = useState('fr');
  const [professionalId, setProfessionalId] = useState<string | null>(null);

  useEffect(() => {
    if (authUser?.id) {
      loadUserData();
    }
  }, [authUser?.id]);

  const loadUserData = async () => {
    if (!authUser?.id) return;

    try {
      setLoading(true);

      // Charger le profil utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUserName(profile.full_name);
      }

      // Essayer de trouver un ID professionnel (dans professional_profiles ou professionals)
      let profId = null;

      // Essayer d'abord professional_profiles
      const { data: profProfile } = await supabase
        .from('professional_profiles')
        .select('id')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (profProfile) {
        profId = profProfile.id;
      } else {
        // Essayer professionals si professional_profiles n'existe pas
        const { data: professional } = await supabase
          .from('professionals')
          .select('id')
          .eq('user_id', authUser.id)
          .maybeSingle();

        if (professional) {
          profId = professional.id;
        } else {
          // Créer un profil professionnel temporaire
          console.log('Création d\'un profil professionnel temporaire...');
          profId = authUser.id; // Utiliser l'ID utilisateur comme ID professionnel temporaire
        }
      }

      setProfessionalId(profId);

      // Charger les établissements (simulation pour l'instant)
      const mockEstablishments = [
        {
          id: 'est-1',
          name: 'Hôpital Général de Libreville',
          type: 'hospital',
          sector: 'public',
          city: 'Libreville',
          role: 'Médecin',
          isAdmin: true,
          permissions: ['*'],
          status: 'active'
        },
        {
          id: 'est-2', 
          name: 'Clinique de la Santé',
          type: 'clinic',
          sector: 'private',
          city: 'Libreville',
          role: 'Médecin',
          isAdmin: false,
          permissions: ['consultations', 'patients'],
          status: 'active'
        }
      ];

      setUserEstablishments(mockEstablishments);

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Auto-sélection si un seul établissement
  useEffect(() => {
    if (userEstablishments.length === 1) {
      setSelectedEstablishment(userEstablishments[0].id);
      toast.info('Établissement unique sélectionné automatiquement');
    }
  }, [userEstablishments]);

  const handleEstablishmentSelect = (establishmentId: string) => {
    setSelectedEstablishment(establishmentId);
    localStorage.setItem('selected_establishment_id', establishmentId);
  };

  const handleContinue = () => {
    if (selectedEstablishment) {
      const establishment = userEstablishments.find(e => e.id === selectedEstablishment);
      if (establishment) {
        localStorage.setItem('selected_establishment_id', selectedEstablishment);
        localStorage.setItem('selected_establishment_name', establishment.name);
        toast.success(`Contexte de travail défini: ${establishment.name}`);
        navigate('/dashboard/professional');
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    toast.success(`Langue changée: ${lang === 'fr' ? 'Français' : 'English'}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement des établissements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={logoSante} alt="SANTE.GA" className="h-8 w-auto" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sélection d'Établissement</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-2" />
                    {language === 'fr' ? 'FR' : 'EN'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleLanguageChange('fr')}>
                    Français
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                    English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Logout */}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Bienvenue, {userName || 'Dr. Professionnel'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sélectionnez l'établissement dans lequel vous souhaitez travailler aujourd'hui
          </p>
        </div>

        {/* Establishments Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userEstablishments.map((establishment) => (
            <Card 
              key={establishment.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedEstablishment === establishment.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleEstablishmentSelect(establishment.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {establishment.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {establishment.type} • {establishment.sector}
                      </p>
                    </div>
                  </div>
                  
                  {selectedEstablishment === establishment.id && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    {establishment.city}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {establishment.role}
                  </div>

                  {establishment.isAdmin && (
                    <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                      <Shield className="h-4 w-4 mr-2" />
                      Administrateur
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {establishment.permissions.map((permission, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Establishments Message */}
        {userEstablishments.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Aucun établissement trouvé
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Vous n'êtes pas encore affilié à un établissement.
            </p>
            <Button onClick={() => navigate('/professional/settings')}>
              Configurer votre profil
            </Button>
          </div>
        )}

        {/* Continue Button */}
        {selectedEstablishment && userEstablishments.length > 0 && (
          <div className="mt-8 text-center">
            <Button 
              onClick={handleContinue}
              size="lg"
              className="px-8 py-3"
            >
              Continuer avec l'établissement sélectionné
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
