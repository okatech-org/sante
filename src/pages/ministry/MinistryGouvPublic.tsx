import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Shield, 
  Users, 
  FileText, 
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Building2,
  GraduationCap,
  Target,
  TrendingUp,
  Facebook,
  Twitter,
  Linkedin,
  Menu,
  X,
  Stethoscope,
  Building
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const MinistryGouvPublic = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête et Navigation */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? 'bg-background/80 backdrop-blur-2xl' : 'bg-transparent'
      }`}>
        <div className="container flex h-24 items-center justify-between">
          {/* Logo */}
          <Link to="/gouv" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background group-hover:scale-105 transition-transform duration-300">
              <Shield className="h-6 w-6" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-foreground">Ministère de la Santé</div>
              <div className="text-xs text-muted-foreground">République Gabonaise</div>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-12">
            <a href="#missions" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
              Missions
            </a>
            <a href="#vision" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
              Vision
            </a>
            <a href="#actualites" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
              Actualités
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
              Contact
            </a>
          </nav>

          {/* CTA Header */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/ministry/login">
              <Button variant="ghost" className="rounded-full px-6">
                Administration
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-2xl animate-fade-in">
            <nav className="container flex flex-col gap-6 py-8">
              <a href="#missions" className="text-base text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Missions
              </a>
              <a href="#vision" className="text-base text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Vision
              </a>
              <a href="#actualites" className="text-base text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Actualités
              </a>
              <a href="#contact" className="text-base text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </a>
              <Link to="/ministry/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full rounded-full mt-4">
                  Administration
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Section Héro */}
      <section className="relative overflow-hidden">
        <div className="container relative py-32 md:py-48 lg:py-64">
          <div className="max-w-4xl mx-auto text-center space-y-12 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              République Gabonaise
            </div>
            
            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight leading-[1.1]">
              La Santé pour Tous,<br />
              Notre Priorité
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Garantir le bien-être physique, mental et social de la population gabonaise.
            </p>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90">
                Découvrir nos Programmes
              </Button>
              <Link to="/login/patient">
                <Button size="lg" variant="ghost" className="rounded-full px-8">
                  Services en Ligne
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Missions Fondamentales */}
      <section id="missions" className="py-32 md:py-48">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-24 space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
              Nos Missions
            </h2>
            <p className="text-xl text-muted-foreground">
              Quatre piliers stratégiques pour un système de santé performant
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:gap-16 max-w-6xl mx-auto">
            {/* Mission 1 */}
            <div className="space-y-6 group">
              <div className="h-16 w-16 rounded-3xl bg-foreground text-background flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Building2 className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold">Gouvernance et Régulation</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Élaborer et coordonner la politique nationale de santé en garantissant une gouvernance transparente et efficace.
              </p>
            </div>

            {/* Mission 2 */}
            <div className="space-y-6 group">
              <div className="h-16 w-16 rounded-3xl bg-foreground text-background flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold">Offre de Soins</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Veiller à la qualité des prestations sanitaires et définir les normes d'équipement des structures de santé.
              </p>
            </div>

            {/* Mission 3 */}
            <div className="space-y-6 group">
              <div className="h-16 w-16 rounded-3xl bg-foreground text-background flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold">Formation</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Gérer les carrières et contrôler la formation des personnels de santé pour garantir l'excellence.
              </p>
            </div>

            {/* Mission 4 */}
            <div className="space-y-6 group">
              <div className="h-16 w-16 rounded-3xl bg-foreground text-background flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold">Prévention</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Concevoir les actions de santé prioritaires et les programmes de prévention des maladies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Vision et Politique Nationale */}
      <section id="vision" className="py-32 md:py-48 bg-muted/30">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-6">
              <div className="text-sm text-muted-foreground uppercase tracking-wider">PNDS 2024-2028</div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight max-w-3xl mx-auto">
                Couverture Sanitaire Universelle
              </h2>
            </div>
            
            <div className="space-y-16">
              <p className="text-2xl md:text-3xl text-center leading-relaxed max-w-4xl mx-auto">
                Accélérer les progrès vers la Couverture Sanitaire Universelle pour garantir l'accès à des soins de qualité pour tous les Gabonais.
              </p>
              
              <div className="flex justify-center">
                <Button size="lg" className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90">
                  Consulter le PNDS 2024-2028
                  <FileText className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Axes stratégiques */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 pt-16">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-foreground/5 flex items-center justify-center">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">Gouvernance</h3>
                  <p className="text-sm text-muted-foreground">Renforcement du leadership</p>
                </div>
                
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-foreground/5 flex items-center justify-center">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">Offre de Soins</h3>
                  <p className="text-sm text-muted-foreground">Amélioration des services</p>
                </div>
                
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-foreground/5 flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">Ressources</h3>
                  <p className="text-sm text-muted-foreground">Développement du personnel</p>
                </div>
                
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-foreground/5 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">Financement</h3>
                  <p className="text-sm text-muted-foreground">Durabilité financière</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Actualités */}
      <section id="actualites" className="py-32 md:py-48">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-24 space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
              Actualités
            </h2>
            <p className="text-xl text-muted-foreground">
              Les dernières nouvelles et initiatives
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 max-w-6xl mx-auto">
            {[
              { 
                date: "15 Oct 2025", 
                title: "Octobre Rose 2025",
                desc: "Campagne nationale de sensibilisation et de dépistage gratuit du cancer du sein.",
                icon: Heart
              },
              { 
                date: "8 Oct 2025", 
                title: "CHR de Mouila",
                desc: "Réception officielle des travaux de réhabilitation et modernisation.",
                icon: Building
              },
              { 
                date: "21 Juil 2024", 
                title: "Nouveau décret",
                desc: "Décret N° 0292/PR/MS portant attributions du Ministère de la Santé.",
                icon: FileText
              }
            ].map((news, index) => (
              <div key={index} className="space-y-6 group">
                <div className="h-14 w-14 rounded-3xl bg-foreground text-background flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <news.icon className="h-7 w-7" />
                </div>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">{news.date}</div>
                  <h3 className="text-2xl font-semibold">{news.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{news.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button variant="ghost" className="rounded-full px-8">
              Voir toutes les actualités
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Section Indicateurs Stratégiques */}
      <section className="py-32 md:py-48 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-24 space-y-6">
            <div className="text-sm text-muted-foreground uppercase tracking-wider">Performance</div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
              Indicateurs Clés
            </h2>
            <p className="text-xl text-muted-foreground">
              Nos objectifs pour 2028
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="h-14 w-14 rounded-3xl bg-foreground text-background flex items-center justify-center">
                <Target className="h-7 w-7" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Couverture Universelle</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-semibold">78%</span>
                  <span className="text-muted-foreground">→ 95%</span>
                </div>
                <p className="text-lg text-muted-foreground">Population couverte par l'assurance maladie</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="h-14 w-14 rounded-3xl bg-foreground text-background flex items-center justify-center">
                <Building className="h-7 w-7" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Infrastructures</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-semibold">238</span>
                  <span className="text-muted-foreground">→ 300</span>
                </div>
                <p className="text-lg text-muted-foreground">Établissements de santé opérationnels</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="h-14 w-14 rounded-3xl bg-foreground text-background flex items-center justify-center">
                <Stethoscope className="h-7 w-7" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Personnel</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-semibold">2.4K</span>
                  <span className="text-muted-foreground">→ 3.5K</span>
                </div>
                <p className="text-lg text-muted-foreground">Professionnels de santé actifs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-32 md:py-48">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-24 space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
                Contactez-nous
              </h2>
              <p className="text-xl text-muted-foreground">
                Nous sommes à votre écoute
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-3">
              <div className="space-y-4 text-center">
                <div className="h-14 w-14 rounded-3xl bg-foreground text-background flex items-center justify-center mx-auto">
                  <MapPin className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold">Adresse</h3>
                <p className="text-muted-foreground">
                  Immeuble Alu-Suisse<br />
                  Libreville, Gabon
                </p>
              </div>

              <div className="space-y-4 text-center">
                <div className="h-14 w-14 rounded-3xl bg-foreground text-background flex items-center justify-center mx-auto">
                  <Phone className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold">Téléphone</h3>
                <p className="text-muted-foreground">
                  (+241) 01-72-26-61
                </p>
              </div>

              <div className="space-y-4 text-center">
                <div className="h-14 w-14 rounded-3xl bg-foreground text-background flex items-center justify-center mx-auto">
                  <Mail className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-semibold">Email</h3>
                <p className="text-muted-foreground">
                  contact@sante.gouv.ga
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="border-t bg-muted/30">
        <div className="container py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-foreground text-background flex items-center justify-center">
                  <Shield className="h-4 w-4" />
                </div>
                <span className="font-semibold">Ministère de la Santé</span>
              </div>
              <p className="text-sm text-muted-foreground">
                République Gabonaise<br />
                La Santé pour Tous
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Le Ministère</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Mission</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Organisation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Textes Législatifs</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/login/patient" className="hover:text-foreground transition-colors">Espace Patient</Link></li>
                <li><Link to="/login/professional" className="hover:text-foreground transition-colors">Espace Professionnel</Link></li>
                <li><Link to="/ministry/login" className="hover:text-foreground transition-colors">Administration</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Suivez-nous</h4>
              <div className="flex gap-3">
                <a href="#" className="h-10 w-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Ministère de la Santé - République Gabonaise. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MinistryGouvPublic;
