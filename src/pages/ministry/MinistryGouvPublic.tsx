import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Activity,
  CheckCircle,
  Target,
  TrendingUp,
  Calendar,
  Facebook,
  Twitter,
  Linkedin,
  Menu,
  X,
  Stethoscope,
  Truck,
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
      <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-xl shadow-sm' : 'bg-background'
      }`}>
        <div className="container flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/gouv" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg group-hover:shadow-xl transition-all">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-bold text-foreground tracking-tight">République Gabonaise</div>
              <div className="text-xs text-muted-foreground font-medium">Ministère de la Santé</div>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#missions" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Nos Missions
            </a>
            <a href="#vision" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Notre Vision
            </a>
            <a href="#actualites" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Actualités
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* CTA Header */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login/patient">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                Services en Ligne
              </Button>
            </Link>
            <Link to="/ministry/login">
              <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-md">
                Espace Administration
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur-xl animate-slide-up">
            <nav className="container flex flex-col gap-4 py-6">
              <a href="#missions" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Nos Missions
              </a>
              <a href="#vision" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Notre Vision
              </a>
              <a href="#actualites" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Actualités
              </a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Link to="/login/patient" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Services en Ligne
                  </Button>
                </Link>
                <Link to="/ministry/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                    Espace Administration
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Section Héro */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container relative py-20 md:py-32 lg:py-40">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            {/* Content */}
            <div className="space-y-8 animate-slide-up">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-sm px-4 py-1.5">
                <Shield className="h-3.5 w-3.5 mr-2" />
                République Gabonaise
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                  La Santé pour Tous,{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent">
                    Notre Priorité
                  </span>
                </h1>
                
                <p className="text-lg text-muted-foreground md:text-xl max-w-2xl leading-relaxed">
                  Mettre en œuvre la politique de santé pour garantir le bien-être physique, mental et social de la population gabonaise.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all text-base px-8">
                  Découvrir nos Programmes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 hover:bg-primary/5 text-base px-8">
                  Services en Ligne
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-primary">238</div>
                  <div className="text-xs text-muted-foreground">Établissements</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-secondary">78%</div>
                  <div className="text-xs text-muted-foreground">Couverture</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-accent">1.8M</div>
                  <div className="text-xs text-muted-foreground">Population</div>
                </div>
              </div>
            </div>

            {/* Visual Cards */}
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6 space-y-2">
                  <div className="text-4xl font-bold text-primary">78%</div>
                  <div className="text-sm text-muted-foreground">
                    Taux de couverture CNAMGS
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6 space-y-2">
                  <div className="text-4xl font-bold text-accent">238</div>
                  <div className="text-sm text-muted-foreground">
                    Établissements opérationnels
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6 space-y-2">
                  <div className="text-4xl font-bold text-secondary">1.8M</div>
                  <div className="text-sm text-muted-foreground">
                    Population couverte
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6 space-y-2">
                  <div className="text-4xl font-bold text-warning">2.4K</div>
                  <div className="text-sm text-muted-foreground">
                    Professionnels actifs
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24" preserveAspectRatio="none" viewBox="0 0 1440 54">
            <path fill="currentColor" className="text-background" d="M0,0 C480,54 960,54 1440,0 L1440,54 L0,54 Z" />
          </svg>
        </div>
      </section>

      {/* Section Missions Fondamentales */}
      <section id="missions" className="py-24 md:py-32">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <Badge className="mb-2">Nos Attributions</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Nos Missions Fondamentales
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Au cœur de notre action, quatre piliers stratégiques pour un système de santé performant et équitable
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Mission 1 */}
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[100px] transition-all group-hover:scale-150" />
              <CardHeader className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Building2 className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Gouvernance et Régulation</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground leading-relaxed">
                  Élaborer et coordonner la politique nationale de santé en garantissant une gouvernance transparente et efficace.
                </p>
              </CardContent>
            </Card>

            {/* Mission 2 */}
            <Card className="group relative overflow-hidden border-2 hover:border-accent/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-bl-[100px] transition-all group-hover:scale-150" />
              <CardHeader className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Heart className="h-7 w-7 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">Offre de Soins</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground leading-relaxed">
                  Veiller à la qualité des prestations sanitaires et définir les normes d'équipement des structures de santé.
                </p>
              </CardContent>
            </Card>

            {/* Mission 3 */}
            <Card className="group relative overflow-hidden border-2 hover:border-secondary/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-[100px] transition-all group-hover:scale-150" />
              <CardHeader className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-7 w-7 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Formation</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground leading-relaxed">
                  Gérer les carrières et contrôler la formation des personnels de santé pour garantir l'excellence.
                </p>
              </CardContent>
            </Card>

            {/* Mission 4 */}
            <Card className="group relative overflow-hidden border-2 hover:border-warning/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-warning/10 to-transparent rounded-bl-[100px] transition-all group-hover:scale-150" />
              <CardHeader className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-warning-foreground" />
                </div>
                <CardTitle className="text-xl">Prévention</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground leading-relaxed">
                  Concevoir les actions de santé prioritaires et les programmes de prévention des maladies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Vision et Politique Nationale */}
      <section id="vision" className="py-24 md:py-32 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container relative">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">PNDS 2024-2028</Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Notre Vision : La Couverture Sanitaire Universelle
                </h2>
              </div>
              
              <blockquote className="border-l-4 border-primary pl-6 py-2 space-y-2">
                <p className="text-xl italic text-foreground">
                  "Accélérer les progrès vers la Couverture Sanitaire Universelle (CSU) pour garantir l'accès à des soins de santé de qualité pour tous les Gabonais."
                </p>
              </blockquote>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Découvrez les axes stratégiques de notre Plan National de Développement Sanitaire (PNDS) 2024-2028, feuille de route pour un système de santé plus équitable et performant.
              </p>
              
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg">
                Consulter le PNDS 2024-2028
                <FileText className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Axes stratégiques */}
            <div className="space-y-4">
              <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all hover:-translate-x-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Gouvernance et Leadership</h3>
                      <p className="text-sm text-muted-foreground">Renforcement de la gouvernance du secteur de la santé</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent hover:shadow-lg transition-all hover:-translate-x-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Offre de Soins</h3>
                      <p className="text-sm text-muted-foreground">Amélioration de l'offre de soins et des services de santé</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary hover:shadow-lg transition-all hover:-translate-x-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Ressources Humaines</h3>
                      <p className="text-sm text-muted-foreground">Développement des ressources humaines en santé</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-warning hover:shadow-lg transition-all hover:-translate-x-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Financement</h3>
                      <p className="text-sm text-muted-foreground">Financement durable de la santé</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all hover:-translate-x-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Promotion</h3>
                      <p className="text-sm text-muted-foreground">Promotion de la santé et prévention des maladies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section Actualités */}
      <section id="actualites" className="py-24 md:py-32">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <Badge className="mb-2">Informations</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Actualités et Communiqués
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Restez informés des dernières nouvelles et initiatives du Ministère de la Santé
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { 
                date: "15 Octobre 2025", 
                badge: "Campagne", 
                badgeColor: "bg-accent/10 text-accent", 
                title: "Octobre Rose 2025 : Appel au dépistage",
                desc: "Campagne nationale de sensibilisation et de dépistage gratuit du cancer du sein dans tous les centres de santé du pays.",
                icon: Heart
              },
              { 
                date: "8 Octobre 2025", 
                badge: "Inauguration", 
                badgeColor: "bg-warning/10 text-warning", 
                title: "Réhabilitation du CHR de Mouila",
                desc: "Réception officielle des travaux de réhabilitation et modernisation du Centre Hospitalier Régional de Mouila.",
                icon: Building
              },
              { 
                date: "21 Juillet 2024", 
                badge: "Législation", 
                badgeColor: "bg-secondary/10 text-secondary", 
                title: "Nouveau décret ministériel",
                desc: "Décret N° 0292/PR/MS du 21/07/2024 portant attributions et organisation du Ministère de la Santé.",
                icon: FileText
              }
            ].map((news, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-2 hover:border-primary/50">
                <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary"></div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{news.date}</span>
                  </div>
                  <Badge className={`w-fit mb-4 ${news.badgeColor}`}>{news.badge}</Badge>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <news.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {news.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{news.desc}</p>
                  <Button variant="link" className="p-0 text-primary group-hover:gap-2 transition-all">
                    En savoir plus 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-2 hover:bg-primary/5">
              Voir toutes les Actualités
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Section Indicateurs Stratégiques */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-secondary/5 via-primary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container relative">
          <div className="text-center mb-16 space-y-4">
            <Badge className="mb-2">Performance</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Indicateurs Stratégiques PNDS 2024-2028
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nos objectifs chiffrés pour une transformation durable du système de santé
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Couverture Universelle</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Actuel</div>
                    <div className="text-3xl font-bold text-primary">78%</div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Cible 2028</div>
                    <div className="text-3xl font-bold text-accent">95%</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Population couverte par l'assurance maladie
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Mortalité Maternelle</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Actuel</div>
                    <div className="text-3xl font-bold text-primary">252</div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Cible 2028</div>
                    <div className="text-3xl font-bold text-accent">180</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pour 100 000 naissances vivantes
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-secondary/50 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">Médecins pour 10k hab.</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Actuel</div>
                    <div className="text-3xl font-bold text-primary">5.2</div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Cible 2028</div>
                    <div className="text-3xl font-bold text-accent">8.5</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Densité de médecins qualifiés
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-warning/50 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Building className="h-6 w-6 text-warning" />
                  </div>
                  <CardTitle className="text-lg">Établissements Modernes</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Actuel</div>
                    <div className="text-3xl font-bold text-primary">42%</div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Cible 2028</div>
                    <div className="text-3xl font-bold text-accent">75%</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Établissements aux normes internationales
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">EVASAN Réduites</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Actuel</div>
                    <div className="text-3xl font-bold text-primary">850</div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Cible 2028</div>
                    <div className="text-3xl font-bold text-accent">-60%</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Évacuations sanitaires par an
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent/50 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">Budget Santé</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Actuel</div>
                    <div className="text-3xl font-bold text-primary">8.5%</div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Cible 2028</div>
                    <div className="text-3xl font-bold text-accent">12%</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Part du budget national
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container relative text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/30">
              Rejoignez-nous
            </Badge>
            
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white">
              Ensemble pour une Santé Meilleure
            </h2>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Découvrez nos services en ligne, consultez nos programmes nationaux ou accédez à votre espace professionnel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/login/patient">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-xl text-base px-8">
                  Services Patients
                  <Heart className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login/professional">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm text-base px-8">
                  Espace Professionnel
                  <Stethoscope className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/20">
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">238</div>
                <div className="text-sm text-white/80">Établissements</div>
              </div>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">2.4K</div>
                <div className="text-sm text-white/80">Professionnels</div>
              </div>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">1.8M</div>
                <div className="text-sm text-white/80">Bénéficiaires</div>
              </div>
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">9</div>
                <div className="text-sm text-white/80">Provinces</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-24 md:py-32 bg-gradient-to-br from-muted/30 to-muted/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container relative">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Informations */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge>Nous contacter</Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Restons en Contact
                </h2>
                <p className="text-lg text-muted-foreground">
                  Le Ministère de la Santé est à votre écoute pour toute information ou demande.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Adresse</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">Immeuble Alu-Suisse{'\n'}Libreville, Gabon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-7 w-7 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Téléphone</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">Standard : (+241) 01-72-26-61{'\n'}Urgences : (+241) 1730</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-7 w-7 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Email</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">contact@sante.gouv.ga{'\n'}info@sante.gouv.ga</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                        <Activity className="h-7 w-7 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Horaires</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">Lun - Ven : 08h00 - 16h00{'\n'}Sam - Dim : Fermé</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Réseau de Santé */}
            <div className="space-y-6">
              <Card className="h-full bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
                <CardContent className="pt-12 pb-12 h-full flex flex-col justify-center items-center text-center space-y-8">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary/80 flex items-center justify-center shadow-2xl">
                    <MapPin className="h-12 w-12 text-primary-foreground" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold">Réseau de Santé National</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      238 établissements de santé répartis sur l'ensemble du territoire gabonais
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                    <div className="text-center space-y-2">
                      <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">9</div>
                      <div className="text-sm text-muted-foreground font-medium">Provinces</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-secondary">238</div>
                      <div className="text-sm text-muted-foreground font-medium">Établissements</div>
                    </div>
                  </div>
                  
                  <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg mt-4">
                    Voir la Cartographie
                    <MapPin className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pied de Page */}
      <footer className="border-t bg-muted/30">
        <div className="container py-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* À propos */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <Shield className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-bold">République Gabonaise</div>
                  <div className="text-xs text-muted-foreground">Ministère de la Santé</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Garantir l'accès à des soins de santé de qualité pour tous les Gabonais dans le cadre de la Couverture Sanitaire Universelle.
              </p>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="h-10 w-10 hover:bg-primary/10 hover:text-primary">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-10 w-10 hover:bg-primary/10 hover:text-primary">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-10 w-10 hover:bg-primary/10 hover:text-primary">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Liens rapides */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Liens Rapides</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Organisation du Ministère</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Textes Législatifs</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Marchés Publics</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Carrières</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Services</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/login/patient" className="text-muted-foreground hover:text-primary transition-colors">Services en Ligne</Link></li>
                <li><Link to="/login/professional" className="text-muted-foreground hover:text-primary transition-colors">Espace Professionnel</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>Immeuble Alu-Suisse, Libreville</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>(+241) 01-72-26-61</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>contact@sante.gouv.ga</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Ministère de la Santé de la République Gabonaise. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Mentions Légales</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Confidentialité</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MinistryGouvPublic;
