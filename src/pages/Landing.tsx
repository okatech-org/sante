import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import logoSante from "@/assets/logo_sante.png";
import heroImage from "@/assets/hero-telemedicine.jpg";
import doctorImage from "@/assets/doctor-consultation.jpg";
import familyImage from "@/assets/family-health.jpg";
import hospitalImage from "@/assets/hospital-reception.jpg";
import { 
  Calendar, 
  FileText, 
  Shield, 
  Clock,
  MapPin,
  Stethoscope,
  Video,
  Heart,
  Search,
  Users,
  Activity,
  Award,
  ChevronRight,
  Mail,
  Menu,
  X,
  Globe
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";

export default function Landing() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeService, setActiveService] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [cnamgsNumber, setCnamgsNumber] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for header background
  useState(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (searchLocation) params.set('location', searchLocation);
    navigate(`/providers?${params.toString()}`);
  };

  const handleSpecialtyClick = (specialty: string) => {
    navigate(`/providers?search=${encodeURIComponent(specialty)}`);
  };

  const handleServiceClick = (index: number) => {
    const routes = [
      '/providers',        // Prendre Rendez-vous
      '/teleconsultation', // Téléconsultation
      '/medical-record',   // Mon Dossier Médical
      '/login/patient'     // Mes Droits CNAMGS
    ];
    navigate(routes[index]);
  };

  const handleCNAMGSVerification = async () => {
    if (!cnamgsNumber.trim()) {
      toast({
        title: t('landing.toast.required') || "Champ requis",
        description: t('landing.toast.enterNumber') || "Veuillez entrer votre numéro d'assuré CNAMGS",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulation de vérification
    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: t('landing.toast.verified') || "Vérification effectuée",
        description: t('landing.toast.loginPrompt') || "Veuillez vous connecter pour voir vos droits complets",
      });
      navigate('/login/patient');
    }, 1500);
  };

  const stats = [
    { value: "2,159", label: t('landing.stats.doctors') || "Médecins inscrits", icon: Users },
    { value: "88", label: t('landing.stats.facilities') || "Hôpitaux & Cliniques", icon: Activity },
    { value: "24/7", label: t('landing.stats.available') || "Service disponible", icon: Clock },
    { value: "100%", label: t('landing.stats.secure') || "Données sécurisées", icon: Shield }
  ];

  const services = [
    {
      icon: Calendar,
      title: t('landing.service1.title') || "Prendre Rendez-vous",
      description: t('landing.service1.desc') || "Trouvez et réservez un rendez-vous avec un médecin en quelques clics",
      action: t('landing.service1.action') || "Trouver un médecin"
    },
    {
      icon: Video,
      title: t('landing.service2.title') || "Téléconsultation",
      description: t('landing.service2.desc') || "Consultez un médecin par vidéo depuis chez vous, où que vous soyez",
      action: t('landing.service2.action') || "Démarrer une consultation"
    },
    {
      icon: FileText,
      title: t('landing.service3.title') || "Mon Dossier Médical",
      description: t('landing.service3.desc') || "Accédez à tous vos documents médicaux en un seul endroit sécurisé",
      action: t('landing.service3.action') || "Voir mon dossier"
    },
    {
      icon: Shield,
      title: t('landing.service4.title') || "Mes Droits CNAMGS",
      description: t('landing.service4.desc') || "Vérifiez votre couverture santé et suivez vos remboursements",
      action: t('landing.service4.action') || "Vérifier mes droits"
    }
  ];

  const steps = [
    { 
      number: "1", 
      title: t('landing.step1.title') || "Créez votre compte", 
      description: t('landing.step1.desc') || "Inscription simple en 2 minutes"
    },
    { 
      number: "2", 
      title: t('landing.step2.title') || "Recherchez un professionnel", 
      description: t('landing.step2.desc') || "Par spécialité ou localisation"
    },
    { 
      number: "3", 
      title: t('landing.step3.title') || "Réservez votre rendez-vous", 
      description: t('landing.step3.desc') || "Choisissez l'horaire qui vous convient"
    },
    { 
      number: "4", 
      title: t('landing.step4.title') || "Consultez et suivez", 
      description: t('landing.step4.desc') || "En ligne ou en présentiel"
    }
  ];

  const specialties = [
    t('landing.specialties.cardiologist') || 'Cardiologue',
    t('landing.specialties.gynecologist') || 'Gynécologue', 
    t('landing.specialties.pediatrician') || 'Pédiatre',
    t('landing.specialties.dentist') || 'Dentiste',
    t('landing.specialties.emergency') || 'Urgences'
  ];

  return (
    <div className="min-h-screen">
      {/* Background avec pattern subtil et animations */}
      <div className="fixed inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20 animate-fade-in">
        <div 
          className="absolute inset-0 opacity-[0.03] animate-pulse" 
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px), radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animationDuration: '4s'
          }}
        />
      </div>

      {/* Header Navigation avec effet glassmorphism amélioré */}
      <header className={`fixed top-0 w-full z-40 border-b transition-all duration-500 ${
        scrolled 
          ? 'bg-card/95 border-border/60 shadow-lg backdrop-blur-2xl' 
          : 'bg-card/60 border-border/40 backdrop-blur-xl shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover-scale group">
              <img 
                src={logoSante} 
                alt="SANTE.GA Logo" 
                className="h-16 w-auto object-contain group-hover:scale-110 transition-transform"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="text-foreground">SANTE</span>
                  <span className="text-primary">.GA</span>
                </h1>
                <p className="text-xs text-muted-foreground">{t('landing.footer.tagline') || "Votre santé, notre priorité"}</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a 
                href="#services" 
                className="story-link font-medium text-foreground/80 hover:text-primary transition-all duration-300 py-2"
              >
                {t('landing.services') || "Services"}
              </a>
              <a 
                href="#comment" 
                className="story-link font-medium text-foreground/80 hover:text-primary transition-all duration-300 py-2"
              >
                {t('landing.howItWorks') || "Comment ça marche"}
              </a>
              <a 
                href="#propos" 
                className="story-link font-medium text-foreground/80 hover:text-primary transition-all duration-300 py-2"
              >
                {t('landing.footer.about') || "À propos"}
              </a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <LanguageToggle />
              <Link to="/login/patient">
                <Button variant="ghost" className="hover-scale">
                  {t('landing.cta.login') || "Se connecter"}
                </Button>
              </Link>
              <Link to="/register/patient">
                <Button className="shadow-lg hover:shadow-2xl hover-scale bg-gradient-to-r from-accent to-accent/90">
                  {t('landing.hero.patient') || "S'inscrire"}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover-scale">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-6 mt-8">
                    <a 
                      href="#services" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2 border-b border-border/50"
                    >
                      {t('landing.services') || "Services"}
                    </a>
                    <a 
                      href="#comment"
                      onClick={() => setMobileMenuOpen(false)} 
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2 border-b border-border/50"
                    >
                      {t('landing.howItWorks') || "Comment ça marche"}
                    </a>
                    <a 
                      href="#propos"
                      onClick={() => setMobileMenuOpen(false)} 
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2 border-b border-border/50"
                    >
                      {t('landing.footer.about') || "À propos"}
                    </a>
                    
                    <div className="flex flex-col gap-3 mt-6">
                      <Link to="/login/patient" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          {t('landing.cta.login') || "Se connecter"}
                        </Button>
                      </Link>
                      <Link to="/register/patient" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-accent to-accent/90">
                          {t('landing.hero.patient') || "S'inscrire"}
                        </Button>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section avec animations */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 animate-fade-in overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Patient using telemedicine" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/75 to-background/85" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 backdrop-blur-sm animate-scale-in">
              <Award className="w-4 h-4 text-secondary" />
              <span className="text-foreground">{t('landing.secure') || "Plateforme E-Santé Nationale du Gabon"}</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('landing.hero.title') || "Votre santé à"}
              <span className="block mt-2 bg-gradient-to-r from-secondary via-warning to-accent bg-clip-text text-transparent animate-scale-in" style={{ animationDelay: '0.2s' }}>
                {t('landing.hero.titleHighlight') || "portée de clic"}
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl mb-12 leading-relaxed text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {t('landing.hero.subtitle') || "Trouvez un médecin, prenez rendez-vous, consultez en ligne et gérez votre santé facilement depuis Libreville, Port-Gentil ou n'importe où au Gabon"}
            </p>

            {/* Search Bar avec effet glassmorphism amélioré */}
            <div className="rounded-2xl shadow-2xl p-3 max-w-3xl mx-auto backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border border-border/40 hover:shadow-3xl transition-all duration-500 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center rounded-xl px-4 py-3 bg-background/50 hover:bg-background/70 transition-colors group">
                  <Stethoscope className="w-5 h-5 mr-3 text-primary group-hover:scale-110 transition-transform" />
                  <input 
                    type="text" 
                    placeholder={t('landing.search.doctor') || "Médecin, spécialité, hôpital..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex-1 flex items-center rounded-xl px-4 py-3 bg-background/50 hover:bg-background/70 transition-colors group">
                  <MapPin className="w-5 h-5 mr-3 text-primary group-hover:scale-110 transition-transform" />
                  <input 
                    type="text" 
                    placeholder={t('landing.search.location') || "Libreville, Port-Gentil..."}
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="w-full sm:w-auto px-8 py-3 shadow-lg hover:shadow-2xl hover-scale bg-gradient-to-r from-secondary to-secondary/90"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {t('landing.search.button') || "Rechercher"}
                </Button>
              </div>
            </div>

            {/* Quick Access Chips avec animations */}
            <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              {specialties.map((specialty, index) => (
                <Button 
                  key={specialty}
                  onClick={() => handleSpecialtyClick(specialty)}
                  variant="outline"
                  className="rounded-full shadow-md hover:shadow-xl hover-scale bg-card/70 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  {specialty}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats Bar avec animations en cascade */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover-scale backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border border-border/40 animate-scale-in group"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <div className={`mb-3 inline-block p-3 rounded-xl group-hover:scale-110 transition-transform ${
                  index === 0 ? 'bg-gradient-to-br from-primary/10 to-primary/5' :
                  index === 1 ? 'bg-gradient-to-br from-secondary/10 to-secondary/5' :
                  index === 2 ? 'bg-gradient-to-br from-warning/10 to-warning/5' :
                  'bg-gradient-to-br from-accent/10 to-accent/5'
                }`}>
                  <stat.icon className={`w-8 h-8 ${
                    index === 0 ? 'text-primary' :
                    index === 1 ? 'text-secondary' :
                    index === 2 ? 'text-warning' :
                    'text-accent'
                  }`} />
                </div>
                <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background images */}
        <div className="absolute left-0 top-1/4 w-64 h-64 hidden lg:block opacity-15">
          <img 
            src={doctorImage} 
            alt="Doctor consultation" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="absolute right-0 bottom-1/4 w-64 h-64 hidden lg:block opacity-15">
          <img 
            src={familyImage} 
            alt="Family health" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t('landing.services') || "Tous vos besoins de santé"}</h2>
            <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
              {t('landing.servicesSubtitle') || "Des services simples et rapides pour prendre soin de vous et votre famille"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                onMouseEnter={() => setActiveService(index)}
                className={`group relative rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border border-border ${
                  index === 0 ? 'hover:border-primary/30' :
                  index === 1 ? 'hover:border-secondary/30' :
                  index === 2 ? 'hover:border-warning/30' :
                  'hover:border-accent/30'
                } animate-fade-in ${
                  activeService === index ? 'scale-[1.02] shadow-3xl' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full transition-all duration-500 group-hover:w-40 group-hover:h-40 opacity-50 ${
                  index === 0 ? 'bg-gradient-to-br from-primary/10 to-primary/5' :
                  index === 1 ? 'bg-gradient-to-br from-secondary/10 to-secondary/5' :
                  index === 2 ? 'bg-gradient-to-br from-warning/10 to-warning/5' :
                  'bg-gradient-to-br from-accent/10 to-accent/5'
                }`} />
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-all duration-300 backdrop-blur-sm ${
                  index === 0 ? 'bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20' :
                  index === 1 ? 'bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/20' :
                  index === 2 ? 'bg-gradient-to-br from-warning/20 to-warning/10 border border-warning/20' :
                  'bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20'
                }`}>
                  <service.icon className={`w-8 h-8 ${
                    index === 0 ? 'text-primary' :
                    index === 1 ? 'text-secondary' :
                    index === 2 ? 'text-warning' :
                    'text-accent'
                  }`} />
                </div>
                
                <h3 className={`text-2xl font-bold mb-3 text-foreground transition-colors ${
                  index === 0 ? 'group-hover:text-primary' :
                  index === 1 ? 'group-hover:text-secondary' :
                  index === 2 ? 'group-hover:text-warning' :
                  'group-hover:text-accent'
                }`}>{service.title}</h3>
                <p className="mb-6 leading-relaxed text-muted-foreground">{service.description}</p>
                
                <button 
                  onClick={() => handleServiceClick(index)}
                  className={`flex items-center font-semibold transition-all group-hover:gap-3 gap-2 ${
                    index === 0 ? 'text-primary hover:text-primary/80' :
                    index === 1 ? 'text-secondary hover:text-secondary/80' :
                    index === 2 ? 'text-warning hover:text-warning/80' :
                    'text-accent hover:text-accent/80'
                  }`}
                >
                  {service.action}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="comment" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">{t('landing.howItWorks') || "Comment ça marche ?"}</h2>
            <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
              {t('landing.howItWorksSubtitle') || "4 étapes simples pour accéder aux meilleurs soins"}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection Line animée */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
            
            {steps.map((step, index) => (
              <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className={`rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-center backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border border-border ${
                  index === 0 ? 'hover:border-primary/30' :
                  index === 1 ? 'hover:border-secondary/30' :
                  index === 2 ? 'hover:border-warning/30' :
                  'hover:border-accent/30'
                } hover-scale group`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform ${
                    index === 0 ? 'bg-gradient-to-br from-primary/20 to-primary/10 text-primary border border-primary/20' :
                    index === 1 ? 'bg-gradient-to-br from-secondary/20 to-secondary/10 text-secondary border border-secondary/20' :
                    index === 2 ? 'bg-gradient-to-br from-warning/20 to-warning/10 text-warning border border-warning/20' :
                    'bg-gradient-to-br from-accent/20 to-accent/10 text-accent border border-accent/20'
                  }`}>
                    {step.number}
                  </div>
                  <h3 className={`text-xl font-bold mb-3 text-foreground transition-colors ${
                    index === 0 ? 'group-hover:text-primary' :
                    index === 1 ? 'group-hover:text-secondary' :
                    index === 2 ? 'group-hover:text-warning' :
                    'group-hover:text-accent'
                  }`}>{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/register/patient">
              <Button size="lg" className="px-10 py-6 text-lg shadow-xl hover:shadow-3xl hover-scale bg-gradient-to-r from-accent to-accent/90 animate-scale-in">
                {t('landing.cta.patient') || "Commencer maintenant"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="propos" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden">
        {/* Background decorative image */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
          <img 
            src={hospitalImage} 
            alt="Modern hospital reception" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                {t('landing.trust.title') || "Une plateforme de confiance pour tous les Gabonais"}
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {t('landing.trust.subtitle') || "SANTE.GA est la plateforme officielle e-santé du Gabon, développée pour connecter patients, médecins, hôpitaux et pharmacies. Sécurisée, gratuite et accessible partout au Gabon."}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-card/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-secondary/40">
                  <Shield className="w-5 h-5 text-secondary" />
                  <span>{t('landing.trust.badge1') || "Données 100% sécurisées"}</span>
                </div>
                <div className="flex items-center space-x-2 bg-card/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-warning/40">
                  <Award className="w-5 h-5 text-warning" />
                  <span>{t('landing.trust.badge2') || "Validé par le Ministère"}</span>
                </div>
                <div className="flex items-center space-x-2 bg-card/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/40">
                  <Heart className="w-5 h-5 text-primary" />
                  <span>{t('landing.trust.badge3') || "Gratuit pour les patients"}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card/70 backdrop-blur-lg rounded-3xl p-8 border border-border/40 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">{t('landing.insurance.title') || "Vérifiez vos droits CNAMGS"}</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={cnamgsNumber}
                  onChange={(e) => setCnamgsNumber(e.target.value)}
                  placeholder={t('landing.insurance.placeholder') || "Numéro d'assuré CNAMGS"}
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border outline-none focus:border-primary transition-colors"
                  disabled={isVerifying}
                />
                <Button 
                  onClick={handleCNAMGSVerification}
                  disabled={isVerifying}
                  className="w-full py-6 shadow-lg bg-gradient-to-r from-accent to-accent/90"
                >
                  {isVerifying ? (t('landing.insurance.verifying') || "Vérification en cours...") : (t('landing.insurance.verify') || "Vérifier ma couverture")}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  {t('landing.insurance.subtitle') || "Vérifiez instantanément votre statut d'assurance et vos droits aux remboursements"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={logoSante} 
                  alt="SANTE.GA Logo" 
                  className="h-16 w-auto object-contain"
                />
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    <span className="text-foreground">SANTE</span>
                    <span className="text-primary">.GA</span>
                  </h2>
                  <p className="text-xs text-muted-foreground">{t('landing.footer.tagline') || "Votre santé, notre priorité"}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {t('landing.footer.description') || "La plateforme nationale e-santé du Gabon. Connectant patients, médecins et professionnels de santé pour un accès équitable aux soins partout au Gabon."}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">{t('landing.services') || "Services"}</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/providers" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('landing.footer.findDoctor') || "Trouver un médecin"}
                  </Link>
                </li>
                <li>
                  <Link to="/teleconsultation" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('landing.footer.teleconsultation') || "Téléconsultation"}
                  </Link>
                </li>
                <li>
                  <Link to="/medical-record" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('landing.footer.medicalRecord') || "Dossier médical"}
                  </Link>
                </li>
                <li>
                  <Link to="/login/patient" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('landing.footer.cnamgsRights') || "Droits CNAMGS"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">{t('landing.footer.support') || "Contact"}</h4>
              <ul className="space-y-3">
                <li className="flex items-start text-muted-foreground">
                  <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                  <span>{t('landing.footer.location') || "Libreville, Gabon"}</span>
                </li>
                <li className="flex items-start text-muted-foreground">
                  <Mail className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                  <span>support@sante.ga</span>
                </li>
                <li className="flex items-start text-muted-foreground">
                  <Clock className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                  <span>{t('landing.footer.availability') || "24/7 Support disponible"}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-muted-foreground text-sm">
                © 2025 SANTE.GA - Conçu et développé par ORGANÉUS Gabon. Tous droits réservés.
              </p>
              
              <Link to="/superadmin" className="opacity-30 hover:opacity-60 transition-opacity flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Admin</span>
              </Link>
              
              <div className="flex space-x-6 text-sm">
                <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('landing.footer.privacy') || 'Confidentialité'}
                </Link>
                <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('landing.footer.terms') || "Conditions d'utilisation"}
                </Link>
                <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('landing.footer.helpCenter') || 'Aide'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
