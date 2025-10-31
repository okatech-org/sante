import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Pill, PackageSearch, AlertTriangle, Clock,
  Mail, Phone, Building2, Briefcase, CheckCircle, Edit,
  ArrowUpRight, FileText, Package, TrendingDown, ShoppingCart, Users
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function PharmacistDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { currentEstablishment } = useMultiEstablishment();

  const [professionalData, setProfessionalData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadProfessionalData();
    }
  }, [user]);

  const loadProfessionalData = async () => {
    if (!user) return;

    const { data: profData } = await supabase
      .from('professionals')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profData) {
      setProfessionalData(profData);
    }
  };

  const fullName = user?.user_metadata?.full_name || professionalData?.full_name || 'Pharmacien(ne)';
  
  const profile = {
    email: user?.email || professionalData?.email || '',
    phone: professionalData?.phone || '+241 07 XX XX XX',
    numeroOrdre: professionalData?.license_number || 'PHAR-XXX',
    verified: professionalData?.is_verified || true,
  };

  // Ordonnances à traiter
  const ordonnances = [
    { id: 1, patient: 'Marie MOUSSAVOU', doctor: 'Dr. OKEMBA', items: 3, status: 'en_attente', time: '09:00', priority: 'normal', type: 'ambulatoire' },
    { id: 2, patient: 'Jean NZENGUE', doctor: 'Dr. NGUEMA', items: 5, status: 'en_preparation', time: '09:15', priority: 'urgent', type: 'hospitalisation' },
    { id: 3, patient: 'Sophie KOMBILA', doctor: 'Dr. MBINA', items: 2, status: 'en_attente', time: '09:30', priority: 'normal', type: 'ambulatoire' },
    { id: 4, patient: 'Pierre OBAME', doctor: 'Dr. MEZUI', items: 4, status: 'validation', time: '09:45', priority: 'high', type: 'ambulatoire' },
    { id: 5, patient: 'André NGUEMA', doctor: 'Dr. OKEMBA', items: 1, status: 'terminé', time: '08:30', priority: 'normal', type: 'ambulatoire' }
  ];

  // Alertes de stock
  const alertesStock = [
    { medicament: 'Paracétamol 1g', stock: 50, seuil: 100, unite: 'cp', criticite: 'moyen' },
    { medicament: 'Amoxicilline 500mg', stock: 15, seuil: 50, unite: 'gél', criticite: 'urgent' },
    { medicament: 'Insuline Rapide', stock: 8, seuil: 20, unite: 'flacons', criticite: 'urgent' }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente': return 'bg-orange-50 dark:bg-orange-950/30 border-l-orange-500';
      case 'en_preparation': return 'bg-blue-50 dark:bg-blue-950/30 border-l-blue-500';
      case 'validation': return 'bg-purple-50 dark:bg-purple-950/30 border-l-purple-500';
      case 'terminé': return 'bg-emerald-50 dark:bg-emerald-950/30 border-l-emerald-500';
      default: return 'bg-gray-50 dark:bg-gray-950/30 border-l-gray-500';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/50">Prioritaire</Badge>;
      default: return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_attente': return <Badge variant="outline">En attente</Badge>;
      case 'en_preparation': return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50">Préparation</Badge>;
      case 'validation': return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50">Validation</Badge>;
      case 'terminé': return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50">Terminé</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec profil pharmacien */}
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 via-background to-emerald-50 dark:from-green-900/20 dark:via-slate-900 dark:to-emerald-900/20">
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-lg">
                <AvatarFallback className="text-2xl font-bold bg-green-500 text-white">
                  {getInitials(fullName)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{fullName}</h1>
                  {profile.verified && (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Vérifié
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="gap-1">
                    <Pill className="h-3 w-3" />
                    Pharmacien(ne) Hospitalier(e)
                  </Badge>
                  <Badge variant="secondary">
                    N° Ordre: {profile.numeroOrdre}
                  </Badge>
                  <Badge variant="default" className="bg-green-500">
                    Pharmacien
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </div>
                  {currentEstablishment && (
                    <>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {currentEstablishment.establishment_name}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {currentEstablishment.department || 'Pharmacie'}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier profil
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards - Spécifique pharmacie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Ordonnances du jour */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +12
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                Ordonnances du jour
              </p>
              <h3 className="text-3xl font-bold text-green-900 dark:text-green-100">32</h3>
              <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                +12 vs hier
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-green-200/30 dark:bg-green-800/20"></div>
        </Card>

        {/* Card 2 - En préparation */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                <PackageSearch className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 gap-1">
                <Clock className="h-3 w-3" />
                En cours
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                En préparation
              </p>
              <h3 className="text-3xl font-bold text-blue-900 dark:text-blue-100">8</h3>
              <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                2 urgentes
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-200/30 dark:bg-blue-800/20"></div>
        </Card>

        {/* Card 3 - Alertes stock */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <Badge variant="destructive">
                Urgent
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                Alertes stock
              </p>
              <h3 className="text-3xl font-bold text-red-900 dark:text-red-100">12</h3>
              <p className="text-xs text-red-600 dark:text-red-500 mt-2">
                3 critiques
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-red-200/30 dark:bg-red-800/20"></div>
        </Card>

        {/* Card 4 - Dispensations */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                OK
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mb-1">
                Dispensations
              </p>
              <h3 className="text-3xl font-bold text-purple-900 dark:text-purple-100">24</h3>
              <p className="text-xs text-purple-600 dark:text-purple-500 mt-2">
                Aujourd'hui
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-purple-200/30 dark:bg-purple-800/20"></div>
        </Card>
      </div>

      {/* Ordonnances à traiter */}
      <Card className="border-0 shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Ordonnances à traiter
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="default">{ordonnances.length} ordonnances</Badge>
              <Button size="sm" variant="outline">
                Historique →
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {ordonnances.map((ord) => (
              <div
                key={ord.id}
                className={`p-4 rounded-xl flex items-center justify-between border-l-4 ${getStatusColor(ord.status)}`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col">
                    <p className="font-semibold">{ord.patient}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>Prescrit par {ord.doctor}</span>
                      <span className="flex items-center gap-1">
                        <Pill className="h-3 w-3" />
                        {ord.items} médicament{ord.items > 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {ord.time}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {ord.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(ord.priority)}
                  {getStatusBadge(ord.status)}
                  <Button variant="outline" size="sm">
                    {ord.status === 'terminé' ? 'Voir' : 'Préparer'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Alertes de stock */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              Alertes de stock
            </h3>
            <Button size="sm" variant="outline">
              Commander →
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alertesStock.map((alerte, index) => (
              <div key={index} className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border-l-4 border-l-red-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{alerte.medicament}</h4>
                  <Badge variant="destructive" className="text-xs">
                    {alerte.criticite === 'urgent' ? 'URGENT' : 'Attention'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Stock actuel:</span>
                  <span className="font-bold text-red-600">{alerte.stock} {alerte.unite}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Seuil minimal:</span>
                  <span className="font-medium">{alerte.seuil} {alerte.unite}</span>
                </div>
                <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500" 
                    style={{ width: `${(alerte.stock / alerte.seuil) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Actions rapides - Pharmacie */}
      <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Actions rapides</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              className="group p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-semibold text-green-900 dark:text-green-100">Ordonnance</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Traiter</p>
            </button>
            
            <button 
              className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PackageSearch className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Stock</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Consulter</p>
            </button>
            
            <button 
              className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">Commander</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Nouveau</p>
            </button>
            
            <button 
              className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Pill className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">Interactions</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Vérifier</p>
            </button>
          </div>
        </div>
      </Card>

      {/* Tâches du pharmacien */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Tâches du pharmacien</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold">Dispensation</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Analyser les ordonnances, vérifier interactions, dispenser les médicaments, conseiller les patients
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">Gestion du stock</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Gérer les stocks, passer commandes, contrôler péremptions, optimiser l'approvisionnement
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold">Pharmacovigilance</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Surveiller effets indésirables, déclarer incidents, assurer qualité et traçabilité des médicaments
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

