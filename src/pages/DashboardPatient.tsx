import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Video, Stethoscope, Shield, Activity, Pill, CheckCircle, FileHeart, AlertCircle, Home, Bell, Settings, Heart, MapPin, ChevronRight, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardPatient() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const userName = (user?.user_metadata as any)?.full_name?.split(' ')[0] || 'Jean-Pierre';
  const fullName = (user?.user_metadata as any)?.full_name || 'Jean-Pierre Mbadinga';
  
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/dashboard/patient', color: '#00d4ff' },
    { id: 'appointments', label: 'Mes rendez-vous', icon: Calendar, badge: '2', path: '/appointments', color: '#0088ff' },
    { id: 'teleconsult', label: 'Téléconsultation', icon: Video, path: '/teleconsultation', color: '#00d4ff' },
    { id: 'dossier', label: 'Dossier Médical', icon: FileHeart, path: '/medical-record', color: '#ffaa00' },
    { id: 'ordonnances', label: 'Mes ordonnances', icon: Pill, badge: '1', path: '/prescriptions', color: '#ff0088' },
    { id: 'resultats', label: 'Résultats d\'analyses', icon: Activity, path: '/results', color: '#0088ff' },
    { id: 'cnamgs', label: 'Droits CNAMGS', icon: Shield, path: '/reimbursements', color: '#00d4ff' },
    { id: 'messages', label: 'Messages', icon: Bell, badge: '3', path: '/support', color: '#ffaa00' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/profile', color: '#ff0088' }
  ];
  
  useEffect(() => {
    // Animation des progress bars au chargement
    setTimeout(() => {
      const progressBar = document.querySelector('.progress-fill');
      if (progressBar) {
        (progressBar as HTMLElement).style.width = '100%';
      }
    }, 100);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background sombre avec étoiles comme la page d'accueil */}
      <div className="fixed inset-0 bg-[#0f1419] -z-10">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08) 1.5px, transparent 1.5px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 90% 50%, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '200px 200px, 250px 250px, 180px 180px, 220px 220px, 190px 190px',
            backgroundPosition: '0 0, 50px 50px, 100px 25px, 150px 75px, 25px 100px'
          }}
        />
      </div>

      {/* Container avec sidebar */}
      <div className="relative flex">
        {/* Sidebar Desktop - cachée sur mobile */}
        <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 p-4 z-40">
          <div className="h-full rounded-2xl backdrop-blur-xl p-6 bg-[#1a1f2e]/90 border border-white/10 shadow-2xl flex flex-col">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00d4ff]/20">
                  <Heart className="w-6 h-6 text-[#00d4ff]" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  SANTE.GA
                </h1>
              </div>
              <p className="text-xs text-gray-500">
                Votre santé à portée de clic
              </p>
            </div>

            {/* Menu */}
            <nav className="space-y-1 flex-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id);
                      if (item.path) navigate(item.path);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          isActive ? '' : 'bg-white/5'
                        }`}
                        style={isActive ? {
                          backgroundColor: `${item.color}20`
                        } : {}}
                      >
                        <Icon 
                          className="w-5 h-5" 
                          style={{ color: isActive ? item.color : '' }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span 
                        className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff]">
                    {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {fullName.split(' ')[0]} ast...
                    </p>
                    <p className="text-xs text-gray-500">
                      N° ••••7891
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header avec menu hamburger */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#1a1f2e]/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00d4ff]/20">
                <Heart className="w-6 h-6 text-[#00d4ff]" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                SANTE.GA
              </h1>
            </div>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-[#1a1f2e] border-white/10 p-0">
                <div className="h-full flex flex-col p-6">
                  {/* Logo */}
                  <div className="mb-8 mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00d4ff]/20">
                        <Heart className="w-6 h-6 text-[#00d4ff]" />
                      </div>
                      <h1 className="text-2xl font-bold text-white tracking-tight">
                        SANTE.GA
                      </h1>
                    </div>
                    <p className="text-xs text-gray-500 ml-1">
                      Votre santé à portée de clic
                    </p>
                  </div>

                  {/* Menu Mobile */}
                  <nav className="space-y-1 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeMenu === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveMenu(item.id);
                            if (item.path) navigate(item.path);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? 'bg-white/10 text-white'
                              : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                isActive ? '' : 'bg-white/5'
                              }`}
                              style={isActive ? {
                                backgroundColor: `${item.color}20`
                              } : {}}
                            >
                              <Icon 
                                className="w-5 h-5" 
                                style={{ color: isActive ? item.color : '' }}
                              />
                            </div>
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span 
                              className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
                              style={{ backgroundColor: item.color }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>

                  {/* User Profile Mobile */}
                  <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff] text-lg">
                          {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            N° ••••7891
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-4 lg:p-6 max-w-7xl pt-20 lg:pt-6">
          {/* Header Card avec dégradé coloré comme "portée de clic" */}
          <div className="rounded-2xl backdrop-blur-xl p-8 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl mb-6">
            <h2 className="text-3xl font-bold mb-3">
              <span className="text-white">Bonjour </span>
              <span 
                className="bg-gradient-to-r from-[#00d4ff] via-[#00ff88] to-[#ffaa00] bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #00d4ff 0%, #00ff88 25%, #ffdd00 50%, #ff8800 75%, #ff0088 100%)'
                }}
              >
                {userName}
              </span>
              <span className="text-white"> ! 👋</span>
            </h2>
            <p className="text-gray-400 text-base">
              Bienvenue sur votre espace santé personnel. Gérez vos rendez-vous et consultations facilement.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
              onClick={() => navigate('/appointments')}
              className="group rounded-xl backdrop-blur-xl p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-[#1a1f2e]/80 border border-white/10 hover:bg-[#1a1f2e]/90 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20">
                    <Calendar className="w-7 h-7 text-[#00d4ff]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-2">Prendre rendez-vous</h3>
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#ff0088]/20 text-[#ff0088]">
                      Prochain disponible aujourd'hui
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => navigate('/teleconsultation')}
              className="group rounded-xl backdrop-blur-xl p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-[#1a1f2e]/80 border border-white/10 hover:bg-[#1a1f2e]/90 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20">
                    <Video className="w-7 h-7 text-[#00d4ff]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-2">Téléconsultation</h3>
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#ff0088]/20 text-[#ff0088]">
                      Médecins disponibles
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-gray-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Health Overview */}
          <div className="rounded-2xl backdrop-blur-xl p-8 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl mb-6">
            <h3 className="text-xl font-semibold mb-6 text-white">
              Aperçu de votre Santé
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prochain RDV */}
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 font-medium">Prochain Rendez-vous</p>
                    <p className="text-3xl font-bold mt-2 text-white">Mardi 8 Oct - 14h30</p>
                    <p className="text-sm mt-2 text-gray-400 font-medium">Dr.Ékomi - Cardiologie</p>
                    <p className="text-xs text-gray-500 mt-1">Cabinet Montagne Sainte, Libreville</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20">
                    <Stethoscope className="w-7 h-7 text-[#00d4ff]" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-3 bg-white/5 px-3 py-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-[#00d4ff]" />
                  <span>3.2 km de votre position</span>
                </div>
              </div>

              {/* Couverture CNAMGS */}
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 font-medium">Couverture CNAMGS</p>
                    <p className="text-3xl font-bold mt-2 text-white">100%</p>
                    <p className="text-sm mt-2 text-gray-400 font-medium">Statut: Actif</p>
                    <p className="text-xs text-gray-500 mt-1">N° GA2384567891</p>
                  </div>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20">
                    <Shield className="w-7 h-7 text-[#00d4ff]" />
                  </div>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden bg-white/10 mt-4">
                  <div
                    className="progress-fill h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#00d4ff] to-[#0088ff]"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - avec icônes colorées comme la page d'accueil */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Consultations', value: '8', icon: Stethoscope, trend: 'Cette année', color: '#00d4ff' },
              { label: 'Ordonnances actives', value: '3', icon: Pill, trend: 'En cours', color: '#0088ff' },
              { label: 'Analyses en attente', value: '1', icon: Activity, trend: 'Résultat prévu lundi', color: '#ffaa00' },
              { label: 'Vaccins à jour', value: '100%', icon: CheckCircle, trend: 'Prochain: 2026', color: '#ff0088' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl backdrop-blur-xl p-5 text-center bg-[#1a1f2e]/80 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] group"
                >
                  <div 
                    className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: stat.color }} />
                  </div>
                  <p className="text-xs mb-2 text-gray-400 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.trend}</p>
                </div>
              );
            })}
          </div>

          {/* Rappels & Alertes */}
          <div className="rounded-2xl backdrop-blur-xl p-8 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl mb-6">
            <h3 className="text-xl font-semibold mb-6 text-white">
              Rappels & Alertes
            </h3>
            
            <div className="space-y-3">
              {[
                { 
                  time: 'Aujourd\'hui 14h30', 
                  event: 'Consultation cardiologie - Dr.Ékomi', 
                  location: 'Cabinet Montagne Sainte',
                  icon: Calendar,
                  color: '#00d4ff'
                },
                { 
                  time: 'Dans 3 jours', 
                  event: 'Résultats d\'analyses disponibles', 
                  location: 'Laboratoire BIOLAB',
                  icon: Activity,
                  color: '#0088ff'
                },
                { 
                  time: 'Cette semaine', 
                  event: 'Ordonnance à renouveler', 
                  location: 'Pharmacie de la Grâce',
                  icon: Pill,
                  color: '#ffaa00'
                },
                { 
                  time: 'Urgent', 
                  event: 'Vaccin tétanos recommandé', 
                  location: 'Tout centre de vaccination',
                  icon: AlertCircle,
                  color: '#ff0088'
                }
              ].map((reminder, idx) => {
                const Icon = reminder.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-5 rounded-xl hover:scale-[1.02] transition-all cursor-pointer bg-white/5 hover:bg-white/10 border border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${reminder.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: reminder.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">{reminder.event}</p>
                        <p className="text-xs text-gray-400">
                          {reminder.time} • {reminder.location}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dossier Médical Récent */}
          <div className="rounded-2xl backdrop-blur-xl p-8 bg-[#1a1f2e]/80 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Dossier Médical Récent
              </h3>
              <button 
                onClick={() => navigate('/medical-record')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Voir tout
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Dernière consultation', date: '28 Sept 2025', type: 'Cardiologie', icon: FileHeart, color: '#00d4ff' },
                { title: 'Dernière ordonnance', date: '28 Sept 2025', type: '3 médicaments', icon: Pill, color: '#ffaa00' },
                { title: 'Dernière analyse', date: '15 Sept 2025', type: 'Bilan sanguin', icon: Activity, color: '#0088ff' }
              ].map((doc, idx) => {
                const Icon = doc.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-xl hover:scale-[1.02] transition-all cursor-pointer bg-white/5 hover:bg-white/10 border border-white/5"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${doc.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: doc.color }} />
                    </div>
                    <p className="text-sm font-semibold mb-2 text-white">{doc.title}</p>
                    <p className="text-xs text-gray-400 mb-1">{doc.date}</p>
                    <p className="text-xs text-gray-500">{doc.type}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}