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
  AlertCircle,
  CheckCircle,
  Target,
  TrendingUp,
  Calendar,
  Facebook,
  Twitter,
  Linkedin,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const MinistryGouvPublic = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête et Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success">
              <Shield className="h-6 w-6 text-success-foreground" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-foreground">République Gabonaise</div>
              <div className="text-xs text-muted-foreground">Ministère de la Santé</div>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#missions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Nos Missions
            </a>
            <a href="#vision" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Notre Vision
            </a>
            <a href="#actualites" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Actualités
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>

          {/* CTA Header */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/ministry/login">
              <Button variant="outline" size="sm">
                Espace Administration
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4">
            <nav className="flex flex-col gap-4">
              <a href="#missions" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Nos Missions
              </a>
              <a href="#vision" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Notre Vision
              </a>
              <a href="#actualites" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Actualités
              </a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </a>
              <Link to="/ministry/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Espace Administration
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Section Héro */}
      <section className="relative overflow-hidden bg-gradient-to-br from-success/5 via-warning/5 to-secondary/5">
        <div className="container py-16 md:py-24 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <Badge className="bg-success/10 text-success hover:bg-success/20">
                République Gabonaise
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                La Santé pour Tous,{" "}
                <span className="text-success">Notre Priorité</span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Mettre en œuvre la politique de santé pour garantir le bien-être physique, mental et social de la population gabonaise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-success hover:bg-success/90 text-success-foreground">
                  Découvrir nos Programmes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline">
                  Services en Ligne
                </Button>
              </div>
            </div>

            {/* Statistiques visuelles */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-success">78%</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Taux de couverture CNAMGS
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-warning">238</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Établissements opérationnels
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-secondary">1.8M</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Population couverte
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-accent">2,450</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Professionnels de santé
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Vague décorative */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background">
          <svg className="absolute bottom-0 w-full h-16" preserveAspectRatio="none" viewBox="0 0 1440 54">
            <path fill="currentColor" className="text-background" d="M0,0 C480,54 960,54 1440,0 L1440,54 L0,54 Z" />
          </svg>
        </div>
      </section>

      {/* Section Missions Fondamentales */}
      <section id="missions" className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4">Nos Attributions</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Nos Missions Fondamentales
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Au cœur de notre action, quatre piliers stratégiques pour un système de santé performant et équitable
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Mission 1 */}
            <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4 group-hover:bg-success/20 transition-colors">
                  <Building2 className="h-6 w-6 text-success" />
                </div>
                <CardTitle className="text-xl">Gouvernance et Régulation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Élaborer et coordonner la politique nationale de santé en garantissant une gouvernance transparente et efficace.
                </p>
              </CardContent>
            </Card>

            {/* Mission 2 */}
            <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4 group-hover:bg-warning/20 transition-colors">
                  <Heart className="h-6 w-6 text-warning" />
                </div>
                <CardTitle className="text-xl">Offre de Soins et Infrastructures</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Veiller à la qualité des prestations sanitaires et définir les normes d'équipement des structures de santé.
                </p>
              </CardContent>
            </Card>

            {/* Mission 3 */}
            <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                  <GraduationCap className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Formation et Ressources Humaines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gérer les carrières et contrôler la formation des personnels de santé pour garantir l'excellence.
                </p>
              </CardContent>
            </Card>

            {/* Mission 4 */}
            <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Prévention et Santé Publique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Concevoir les actions de santé prioritaires et les programmes de prévention des maladies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section Vision et Politique Nationale */}
      <section id="vision" className="py-16 md:py-24 bg-gradient-to-br from-success/5 to-secondary/5">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <Badge className="bg-success/10 text-success">PNDS 2024-2028</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Notre Vision : La Couverture Sanitaire Universelle
              </h2>
              <div className="prose prose-lg">
                <blockquote className="text-xl italic text-muted-foreground border-l-4 border-success pl-4">
                  "Accélérer les progrès vers la Couverture Sanitaire Universelle (CSU) pour garantir l'accès à des soins de santé de qualité pour tous les Gabonais."
                </blockquote>
              </div>
              <p className="text-lg text-muted-foreground">
                Découvrez les axes stratégiques de notre Plan National de Développement Sanitaire (PNDS) 2024-2028, feuille de route pour un système de santé plus équitable et performant.
              </p>
              <Button size="lg" className="bg-success hover:bg-success/90 text-success-foreground">
                Consulter le PNDS 2024-2028
                <FileText className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Axes stratégiques */}
            <div className="space-y-4">
              <Card className="border-l-4 border-l-success">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Target className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Gouvernance et Leadership</h3>
                      <p className="text-sm text-muted-foreground">
                        Renforcement de la gouvernance du secteur de la santé
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-warning">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Offre de Soins</h3>
                      <p className="text-sm text-muted-foreground">
                        Amélioration de l'offre de soins et des services de santé
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Ressources Humaines</h3>
                      <p className="text-sm text-muted-foreground">
                        Développement des ressources humaines en santé
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Financement de la Santé</h3>
                      <p className="text-sm text-muted-foreground">
                        Financement durable de la santé
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-success">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Activity className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Promotion et Prévention</h3>
                      <p className="text-sm text-muted-foreground">
                        Promotion de la santé et prévention des maladies
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section Actualités et Événements */}
      <section id="actualites" className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4">Informations</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Actualités et Communiqués
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Restez informés des dernières nouvelles et initiatives du Ministère de la Santé
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Actualité 1 */}
            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">15 Octobre 2025</span>
                </div>
                <Badge className="w-fit mb-3 bg-accent/10 text-accent">Campagne</Badge>
                <CardTitle className="text-xl group-hover:text-success transition-colors">
                  Octobre Rose 2025 : Appel au dépistage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Campagne nationale de sensibilisation et de dépistage gratuit du cancer du sein dans tous les centres de santé du pays.
                </p>
                <Button variant="link" className="p-0 text-success">
                  En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Actualité 2 */}
            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">8 Octobre 2025</span>
                </div>
                <Badge className="w-fit mb-3 bg-warning/10 text-warning">Inauguration</Badge>
                <CardTitle className="text-xl group-hover:text-success transition-colors">
                  Réhabilitation du CHR de Mouila
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Réception officielle des travaux de réhabilitation et modernisation du Centre Hospitalier Régional de Mouila.
                </p>
                <Button variant="link" className="p-0 text-success">
                  En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Actualité 3 */}
            <Card className="group hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">21 Juillet 2024</span>
                </div>
                <Badge className="w-fit mb-3 bg-secondary/10 text-secondary">Législation</Badge>
                <CardTitle className="text-xl group-hover:text-success transition-colors">
                  Nouveau décret ministériel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Décret N° 0292/PR/MS du 21/07/2024 portant attributions et organisation du Ministère de la Santé.
                </p>
                <Button variant="link" className="p-0 text-success">
                  Télécharger <FileText className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Voir toutes les Actualités
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Section Contact et Localisation */}
      <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Informations de contact */}
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">Nous contacter</Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  Restons en Contact
                </h2>
                <p className="text-lg text-muted-foreground">
                  Le Ministère de la Santé est à votre écoute pour toute information ou demande.
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Adresse</h3>
                        <p className="text-muted-foreground">
                          Immeuble Alu-Suisse<br />
                          Libreville, Gabon
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Téléphone</h3>
                        <p className="text-muted-foreground">
                          Standard : (+241) 01-72-26-61<br />
                          Urgences : (+241) 1730
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">
                          contact@sante.gouv.ga<br />
                          info@sante.gouv.ga
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Horaires</h3>
                        <p className="text-muted-foreground">
                          Lun - Ven : 08h00 - 16h00<br />
                          Sam - Dim : Fermé
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Carte ou visuel */}
            <div className="space-y-6">
              <Card className="h-full">
                <CardContent className="pt-6 h-full flex flex-col justify-center items-center bg-gradient-to-br from-success/5 to-secondary/5">
                  <div className="text-center space-y-4">
                    <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                      <MapPin className="h-10 w-10 text-success" />
                    </div>
                    <h3 className="text-2xl font-bold">Réseau de Santé National</h3>
                    <p className="text-muted-foreground">
                      238 établissements de santé répartis sur l'ensemble du territoire gabonais
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-success">9</div>
                        <div className="text-sm text-muted-foreground">Provinces</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-warning">238</div>
                        <div className="text-sm text-muted-foreground">Établissements</div>
                      </div>
                    </div>
                    <Button className="mt-6 bg-success hover:bg-success/90 text-success-foreground">
                      Voir la Cartographie
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pied de Page */}
      <footer className="border-t bg-muted/30">
        <div className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* À propos */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success">
                  <Shield className="h-6 w-6 text-success-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold">République Gabonaise</div>
                  <div className="text-xs text-muted-foreground">Ministère de la Santé</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Garantir l'accès à des soins de santé de qualité pour tous les Gabonais dans le cadre de la Couverture Sanitaire Universelle.
              </p>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Liens rapides */}
            <div className="space-y-4">
              <h3 className="font-semibold">Liens Rapides</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Organisation du Ministère
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Textes Législatifs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Marchés Publics
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Carrières
                  </a>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="font-semibold">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/login/patient" className="text-muted-foreground hover:text-foreground transition-colors">
                    Services en Ligne
                  </Link>
                </li>
                <li>
                  <Link to="/login/professional" className="text-muted-foreground hover:text-foreground transition-colors">
                    Espace Professionnel
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Immeuble Alu-Suisse, Libreville</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>(+241) 01-72-26-61</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
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
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Mentions Légales
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Confidentialité
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MinistryGouvPublic;
