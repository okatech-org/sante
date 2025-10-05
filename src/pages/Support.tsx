import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Phone,
  Mail,
  MessageCircle,
  HelpCircle,
  Book,
  Video,
  Menu,
  Home,
  Calendar,
  Video as VideoIcon,
  Shield,
  Activity,
  Bell,
  Settings,
  FileHeart,
  Pill
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logoSante from "@/assets/logo_sante.png";

export default function Support() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('messages');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const fullName = (user?.user_metadata as any)?.full_name || 'Utilisateur';

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/dashboard/patient', color: '#00d4ff' },
    { id: 'appointments', label: 'Mes rendez-vous', icon: Calendar, badge: '2', path: '/appointments', color: '#0088ff' },
    { id: 'teleconsult', label: 'Téléconsultation', icon: VideoIcon, path: '/teleconsultation', color: '#00d4ff' },
    { id: 'dossier', label: 'Dossier Médical', icon: FileHeart, path: '/medical-record', color: '#ffaa00' },
    { id: 'ordonnances', label: 'Mes ordonnances', icon: Pill, badge: '1', path: '/prescriptions', color: '#ff0088' },
    { id: 'resultats', label: 'Résultats d\'analyses', icon: Activity, path: '/results', color: '#0088ff' },
    { id: 'cnamgs', label: 'Droits CNAMGS', icon: Shield, path: '/reimbursements', color: '#00d4ff' },
    { id: 'messages', label: 'Messages', icon: Bell, badge: '3', path: '/support', color: '#ffaa00' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/profile', color: '#ff0088' }
  ];

  useEffect(() => {
    loadAvatar();
  }, [user?.id]);

  const loadAvatar = async () => {
    if (user?.id) {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Votre message a été envoyé avec succès");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background étoilé */}
      <div className="fixed inset-0 bg-[#0f1419] -z-10">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08) 1.5px, transparent 1.5px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 90% 50%, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '200px 200px, 250px 250px, 180px 180px, 220px 220px, 190px 190px',
          backgroundPosition: '0 0, 50px 50px, 100px 25px, 150px 75px, 25px 100px'
        }} />
      </div>

      <div className="relative flex">
        {/* Sidebar Desktop */}
        <aside className="hidden md:block w-64 h-screen fixed left-0 top-0 p-4 z-40">
          <div className="h-full rounded-2xl backdrop-blur-xl p-6 bg-[#1a1f2e]/90 border border-white/10 shadow-2xl flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <img src={logoSante} alt="SANTE.GA Logo" className="h-12 w-auto object-contain" />
                <h1 className="text-2xl font-bold text-white">SANTE.GA</h1>
              </div>
              <p className="text-xs text-gray-500">Votre santé à portée de clic</p>
            </div>

            <nav className="space-y-1 flex-1 overflow-y-auto">
              {menuItems.map(item => {
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
                      isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          isActive ? '' : 'bg-white/5'
                        }`}
                        style={isActive ? { backgroundColor: `${item.color}20` } : {}}
                      >
                        <Icon className="w-5 h-5" style={{ color: isActive ? item.color : '' }} />
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

            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff]">
                      {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{fullName.split(' ')[0]}</p>
                    <p className="text-xs text-gray-500">Patient</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#1a1f2e]/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
              <h1 className="text-xl font-bold text-white tracking-tight">SANTE.GA</h1>
            </div>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-[#1a1f2e] border-white/10 p-0">
                <div className="h-full flex flex-col p-6">
                  <div className="mb-8 mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
                      <h1 className="text-2xl font-bold text-white tracking-tight">SANTE.GA</h1>
                    </div>
                    <p className="text-xs text-gray-500 ml-1">Votre santé à portée de clic</p>
                  </div>

                  <nav className="space-y-1 flex-1 overflow-y-auto">
                    {menuItems.map(item => {
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
                            isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                isActive ? '' : 'bg-white/5'
                              }`}
                              style={isActive ? { backgroundColor: `${item.color}20` } : {}}
                            >
                              <Icon className="w-5 h-5" style={{ color: isActive ? item.color : '' }} />
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-20 md:pt-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-white">
                  <span className="bg-gradient-to-r from-[#ffaa00] via-[#ff8800] to-[#ff6600] bg-clip-text text-transparent">Messages</span> & Support
                </h1>
                <p className="text-gray-400 mt-2">
                  Nous sommes là pour vous aider. Consultez notre FAQ ou contactez-nous directement.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2 text-white">Téléphone</h3>
                  <p className="text-sm text-gray-400 mb-3">Lun-Ven 8h-18h</p>
                  <a href="tel:+24111234567" className="text-[#00d4ff] hover:underline">
                    +241 11 23 45 67
                  </a>
                </Card>

                <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2 text-white">Email</h3>
                  <p className="text-sm text-gray-400 mb-3">Réponse sous 24h</p>
                  <a href="mailto:support@sante.ga" className="text-[#00d4ff] hover:underline">
                    support@sante.ga
                  </a>
                </Card>

                <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-[#ffaa00]/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-6 w-6 text-[#ffaa00]" />
                  </div>
                  <h3 className="font-semibold mb-2 text-white">Chat en direct</h3>
                  <p className="text-sm text-gray-400 mb-3">Disponible maintenant</p>
                  <Button variant="link" className="p-0 text-[#00d4ff] hover:text-[#0088ff]">
                    Démarrer le chat
                  </Button>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="h-5 w-5 text-[#00d4ff]" />
                    <h2 className="text-xl font-semibold text-white">Questions Fréquentes (FAQ)</h2>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-white/10">
                      <AccordionTrigger className="text-white hover:text-[#00d4ff]">Comment prendre un rendez-vous ?</AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Pour prendre rendez-vous, cliquez sur "Mes Rendez-vous" dans le menu, puis "Nouveau rendez-vous". 
                        Sélectionnez votre prestataire, la date et l'heure souhaitées.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2" className="border-white/10">
                      <AccordionTrigger className="text-white hover:text-[#00d4ff]">Comment utiliser la CNAMGS ?</AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Présentez votre carte CNAMGS lors de votre consultation. Le prestataire conventionné 
                        appliquera automatiquement le tiers-payant. Vous pouvez suivre vos remboursements 
                        dans la section "Remboursements CNAMGS".
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3" className="border-white/10">
                      <AccordionTrigger className="text-white hover:text-[#00d4ff]">Comment accéder à mes résultats d'analyses ?</AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Vos résultats sont disponibles dans la section "Mes Résultats". Vous recevrez également 
                        une notification par email dès qu'un nouveau résultat est disponible.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4" className="border-white/10">
                      <AccordionTrigger className="text-white hover:text-[#00d4ff]">Puis-je annuler un rendez-vous ?</AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Oui, vous pouvez annuler un rendez-vous jusqu'à 24h avant l'heure prévue. 
                        Allez dans "Mes Rendez-vous", sélectionnez le rendez-vous et cliquez sur "Annuler".
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-5" className="border-white/10">
                      <AccordionTrigger className="text-white hover:text-[#00d4ff]">Comment modifier mes informations personnelles ?</AccordionTrigger>
                      <AccordionContent className="text-gray-400">
                        Rendez-vous dans votre profil en cliquant sur l'icône utilisateur. 
                        Vous pourrez modifier vos informations personnelles, adresse et contacts.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>

                <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="h-5 w-5 text-[#ffaa00]" />
                    <h2 className="text-xl font-semibold text-white">Contactez-nous</h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white">Sujet</Label>
                      <Input id="subject" placeholder="Objet de votre demande" required className="bg-white/5 border-white/10 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-white">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Décrivez votre problème ou question..."
                        rows={6}
                        required
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-to-r from-[#ffaa00] to-[#ff6600] hover:opacity-90">
                      Envoyer le message
                    </Button>
                  </form>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Book className="h-5 w-5 text-[#0088ff]" />
                    <h2 className="text-xl font-semibold text-white">Guides & Tutoriels</h2>
                  </div>
                  <div className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
                      <Book className="h-4 w-4 mr-2" />
                      Guide de démarrage
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
                      <Book className="h-4 w-4 mr-2" />
                      Utiliser la cartographie santé
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
                      <Book className="h-4 w-4 mr-2" />
                      Gérer vos ordonnances
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Video className="h-5 w-5 text-[#ff0088]" />
                    <h2 className="text-xl font-semibold text-white">Vidéos d'aide</h2>
                  </div>
                  <div className="space-y-3">
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
                      <Video className="h-4 w-4 mr-2" />
                      Prendre un rendez-vous
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
                      <Video className="h-4 w-4 mr-2" />
                      Consulter vos résultats
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
                      <Video className="h-4 w-4 mr-2" />
                      Demander un remboursement
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
