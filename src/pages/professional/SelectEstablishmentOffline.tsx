import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, ChevronRight, MapPin, Users, Calendar, 
  Shield, Briefcase, Clock, Star, Check, Home, Settings, LogOut, Sun, Moon, Laptop, Globe, Wifi, WifiOff
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOfflineAuth } from '@/contexts/OfflineAuthContext';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logoSante from '@/assets/logo_sante.png';

export default function SelectEstablishmentOffline() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useOfflineAuth();
  const { theme, setTheme } = useTheme();
  const [selectedEstablishment, setSelectedEstablishment] = useState<string | null>(null);
  const [userEstablishments, setUserEstablishments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [language, setLanguage] = useState('fr');
  const [isOffline, setIsOffline] = useState(true);

  useEffect(() => {
    if (authUser && !authLoading) {
      loadUserData();
    }
  }, [authUser, authLoading]);

  const loadUserData = async () => {
    if (!authUser?.id) return;

    try {
      setLoading(true);

      // Utiliser les données de l'utilisateur connecté
      setUserName(authUser.user_metadata?.full_name || 'Dr. Professionnel');

      // Données d'établissements simulées pour le mode hors-ligne
      const mockEstablishments = [
        {
          id: 'est-1',
          name: 'Hôpital Général de Libreville',
          type: 'hospital',
          sector: 'public',
          city: 'Libreville',
          province: 'Estuaire',
          role: 'Médecin Chef de Service',
          department: 'Cardiologie',
          isAdmin: true,
          permissions: ['*'],
          status: 'active',
          schedule: {
            monday: '08:00-17:00',
            tuesday: '08:00-17:00',
            wednesday: '08:00-17:00',
            thursday: '08:00-17:00',
            friday: '08:00-17:00'
          }
        },
        {
          id: 'est-2', 
          name: 'Clinique de la Santé',
          type: 'clinic',
          sector: 'private',
          city: 'Libreville',
          province: 'Estuaire',
          role: 'Médecin Consultant',
          department: 'Médecine Générale',
          isAdmin: false,
          permissions: ['consultations', 'patients', 'prescriptions'],
          status: 'active',
          schedule: {
            monday: '09:00-16:00',
            tuesday: '09:00-16:00',
            wednesday: '09:00-16:00',
            thursday: '09:00-16:00',
            friday: '09:00-16:00'
          }
        },
        {
          id: 'est-3',
          name: 'Centre Médical SOGARA',
          type: 'clinic',
          sector: 'public',
          city: 'Port-Gentil',
          province: 'Ogooué-Maritime',
          role: 'Médecin Spécialiste',
          department: 'Pneumologie',
          isAdmin: false,
          permissions: ['consultations', 'patients', 'imaging'],
          status: 'active',
          schedule: {
            monday: '08:00-15:00',
            tuesday: '08:00-15:00',
            wednesday: '08:00-15:00',
            thursday: '08:00-15:00',
            friday: '08:00-15:00'
          }
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
        localStorage.setItem('selected_establishment_type', establishment.type);
        localStorage.setItem('selected_establishment_sector', establishment.sector);
        toast.success(`Contexte de travail défini: ${establishment.name}`);
        navigate('/dashboard/professional');
      }
    }
  };

  const handleLogout = async () => {
    // Simuler la déconnexion
    localStorage.removeItem('offline_user');
    navigate('/');
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    toast.success(`Langue changée: ${lang === 'fr' ? 'Français' : 'English'}`);
  };

  const getEstablishmentIcon = (type: string) => {
    switch (type) {
      case 'hospital': return '🏥';
      case 'clinic': return '🏥';
      case 'cabinet': return '🏥';
      case 'pharmacy': return '💊';
      case 'laboratory': return '🔬';
      default: return '🏥';
    }
  };

  const getSectorColor = (sector: string) => {
    switch (sector) {
      case 'public': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'private': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'confessional': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'military': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (authLoading || loading) {
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
              {isOffline && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Mode Hors-ligne
                </Badge>
              )}
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Bienvenue, {userName || 'Dr. Professionnel'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Sélectionnez l'établissement dans lequel vous souhaitez travailler aujourd'hui
          </p>
          {isOffline && (
            <p className="text-sm text-orange-600 dark:text-orange-400">
              Mode hors-ligne - Données simulées pour démonstration
            </p>
          )}
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
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-2xl">
                      {getEstablishmentIcon(establishment.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {establishment.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={`text-xs ${getSectorColor(establishment.sector)}`}>
                          {establishment.sector}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {establishment.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedEstablishment === establishment.id && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 mr-2" />
                    {establishment.city}, {establishment.province}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {establishment.role}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Users className="h-4 w-4 mr-2" />
                    {establishment.department}
                  </div>

                  {establishment.isAdmin && (
                    <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                      <Shield className="h-4 w-4 mr-2" />
                      Administrateur
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {establishment.permissions.map((permission, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>

                {/* Schedule */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center mb-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Horaires
                  </div>
                  <div className="text-xs">
                    Lun-Ven: {establishment.schedule?.monday || '08:00-17:00'}
                  </div>
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

        {/* Offline Notice */}
        {isOffline && (
          <div className="mt-8 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-center">
              <WifiOff className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Mode Hors-ligne
                </h4>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  L'application fonctionne en mode démonstration avec des données simulées. 
                  La connexion à Supabase sera rétablie automatiquement dès que possible.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
