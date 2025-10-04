import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  Mail
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";

export default function Landing() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [activeService, setActiveService] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

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

  const specialties = ['Cardiologue', 'Gynécologue', 'Pédiatre', 'Dentiste', 'Urgences'];

  return (
    <div className="min-h-screen">
      {/* Background avec pattern subtil */}
      <div className="fixed inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px), radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-40 bg-card/60 border-b border-border/40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-muted shadow-lg">
                <Heart className="w-7 h-7 text-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">SANTE.GA</h1>
                <p className="text-xs text-muted-foreground">{t('landing.footer.tagline') || "Votre santé, notre priorité"}</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="font-medium text-foreground/80 hover:text-foreground transition-colors">
                {t('landing.services') || "Services"}
              </a>
              <a href="#comment" className="font-medium text-foreground/80 hover:text-foreground transition-colors">
                {t('landing.howItWorks') || "Comment ça marche"}
              </a>
              <a href="#propos" className="font-medium text-foreground/80 hover:text-foreground transition-colors">
                {t('landing.footer.about') || "À propos"}
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/login/patient" className="hidden sm:block">
                <Button variant="ghost">{t('landing.cta.login') || "Se connecter"}</Button>
              </Link>
              <Link to="/register/patient">
                <Button className="shadow-lg hover:shadow-xl hover:scale-105 transition-all">{t('landing.hero.patient') || "S'inscrire"}</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-muted/50 border border-border">
              <Award className="w-4 h-4 text-foreground" />
              <span className="text-foreground">{t('landing.secure') || "Plateforme E-Santé Nationale du Gabon"}</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-foreground">
              {t('landing.hero.title') || "Votre santé à"}
              <span className="block mt-2 bg-gradient-to-r from-foreground/60 via-foreground to-foreground/60 bg-clip-text text-transparent">
                {t('landing.hero.titleHighlight') || "portée de clic"}
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl mb-12 leading-relaxed text-muted-foreground">
              {t('landing.hero.subtitle') || "Trouvez un médecin, prenez rendez-vous, consultez en ligne et gérez votre santé facilement depuis Libreville, Port-Gentil ou n'importe où au Gabon"}
            </p>

            {/* Search Bar */}
            <div className="rounded-2xl shadow-2xl p-3 max-w-3xl mx-auto backdrop-blur-lg bg-card/70 border border-border/40">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center rounded-xl px-4 py-3 bg-muted/50">
                  <Stethoscope className="w-5 h-5 mr-3 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder={t('landing.search.doctor') || "Médecin, spécialité, hôpital..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex-1 flex items-center rounded-xl px-4 py-3 bg-muted/50">
                  <MapPin className="w-5 h-5 mr-3 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder={t('landing.search.location') || "Libreville, Port-Gentil..."}
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="bg-transparent outline-none w-full text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Link to="/providers" className="sm:flex-shrink-0">
                  <Button className="w-full sm:w-auto px-8 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                    <Search className="w-5 h-5 mr-2" />
                    {t('landing.search.button') || "Rechercher"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Access Chips */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {specialties.map((specialty) => (
                <Button 
                  key={specialty}
                  variant="outline"
                  className="rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all bg-card/70 backdrop-blur-sm border-border"
                >
                  {specialty}
                </Button>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105 backdrop-blur-lg bg-card/70 border border-border/40"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
                className={`group relative rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer backdrop-blur-lg bg-card/70 border border-border ${
                  activeService === index ? 'scale-[1.02]' : ''
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full transition-all duration-500 group-hover:w-40 group-hover:h-40 bg-muted/20" />
                
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform bg-muted/50">
                  <service.icon className="w-8 h-8 text-foreground" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-foreground">{service.title}</h3>
                <p className="mb-6 leading-relaxed text-muted-foreground">{service.description}</p>
                
                <button className="flex items-center font-semibold text-foreground/80 hover:text-foreground transition-colors">
                  {service.action}
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
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
            {/* Connection Line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-border" />
            
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center backdrop-blur-lg bg-card/70 border border-border">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg bg-muted text-foreground">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/register/patient">
              <Button size="lg" className="px-10 py-6 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                {t('landing.cta.patient') || "Commencer maintenant"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="propos" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                {t('landing.trust.title') || "Une plateforme de confiance pour tous les Gabonais"}
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {t('landing.trust.subtitle') || "SANTE.GA est la plateforme officielle e-santé du Gabon, développée pour connecter patients, médecins, hôpitaux et pharmacies. Sécurisée, gratuite et accessible partout au Gabon."}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-card/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/40">
                  <Shield className="w-5 h-5" />
                  <span>{t('landing.trust.badge1') || "Données 100% sécurisées"}</span>
                </div>
                <div className="flex items-center space-x-2 bg-card/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/40">
                  <Award className="w-5 h-5" />
                  <span>{t('landing.trust.badge2') || "Validé par le Ministère"}</span>
                </div>
                <div className="flex items-center space-x-2 bg-card/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/40">
                  <Heart className="w-5 h-5" />
                  <span>{t('landing.trust.badge3') || "Gratuit pour les patients"}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-card/70 backdrop-blur-lg rounded-3xl p-8 border border-border/40 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">{t('landing.insurance.title') || "Vérifiez vos droits CNAMGS"}</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder={t('landing.insurance.placeholder') || "Numéro d'assuré CNAMGS"}
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border outline-none focus:border-primary transition-colors"
                />
                <Button className="w-full py-6 shadow-lg">
                  {t('landing.insurance.verify') || "Vérifier ma couverture"}
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
                <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">SANTE.GA</span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('landing.footer.tagline') || "La plateforme nationale e-santé du Gabon. Connectant patients, médecins et professionnels de santé pour un accès équitable aux soins partout au Gabon."}
              </p>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'LinkedIn'].map((social) => (
                  <button 
                    key={social}
                    className="w-10 h-10 bg-card rounded-lg hover:bg-muted transition-colors flex items-center justify-center border border-border/40"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-muted-foreground/30 rounded" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">{t('landing.services') || "Services"}</h4>
              <ul className="space-y-3">
                {['Trouver un médecin', 'Téléconsultation', 'Dossier médical', 'Droits CNAMGS'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">{t('landing.footer.support') || "Contact"}</h4>
              <ul className="space-y-3">
                <li className="flex items-start text-muted-foreground">
                  <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                  <span>Libreville, Gabon</span>
                </li>
                <li className="flex items-start text-muted-foreground">
                  <Mail className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                  <span>support@sante.ga</span>
                </li>
                <li className="flex items-start text-muted-foreground">
                  <Clock className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                  <span>24/7 Support disponible</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-muted-foreground text-sm">
                © 2025 {t('landing.footer.copyright') || "SANTE.GA - Ministère de la Santé du Gabon. Tous droits réservés."}
              </p>
              
              <Link to="/superadmin" className="opacity-30 hover:opacity-60 transition-opacity flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Admin</span>
              </Link>
              
              <div className="flex space-x-6 text-sm">
                {[
                  t('landing.footer.privacy') || 'Confidentialité', 
                  t('landing.footer.terms') || "Conditions d'utilisation", 
                  t('landing.footer.helpCenter') || 'Aide'
                ].map((item) => (
                  <a key={item} href="#" className="text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
