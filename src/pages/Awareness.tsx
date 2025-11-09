import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import awarenessHero from "@/assets/awareness-hero.jpg";
import doctorImage from "@/assets/doctor-consultation.jpg";
import familyImage from "@/assets/family-health.jpg";
import { 
  Heart, 
  Video, 
  BookOpen,
  AlertCircle,
  Search,
  Calendar,
  Play,
  FileText,
  Droplet,
  Activity,
  Brain,
  Baby,
  ChevronRight,
  Menu,
  MapPin,
  Mail,
  ShieldCheck
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import logoSante from "@/assets/logo_sante.png";

export default function Awareness() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const newsArticles = [
    {
      id: 1,
      title: "Nouvelle campagne de vaccination contre la fièvre jaune",
      category: "Actualité",
      date: "15 Mars 2025",
      excerpt: "Le Ministère de la Santé lance une grande campagne de vaccination dans toutes les provinces du Gabon...",
      image: doctorImage,
      badge: "Important"
    },
    {
      id: 2,
      title: "Semaine de sensibilisation au diabète",
      category: "Événement",
      date: "10 Mars 2025",
      excerpt: "Du 15 au 22 mars, participez à notre semaine de dépistage gratuit du diabète dans les principaux centres de santé...",
      image: familyImage,
      badge: "Gratuit"
    },
    {
      id: 3,
      title: "Nouveaux centres de téléconsultation ouverts",
      category: "Actualité",
      date: "5 Mars 2025",
      excerpt: "Trois nouveaux centres équipés pour la téléconsultation viennent d'ouvrir à Port-Gentil, Franceville et Oyem...",
      image: doctorImage,
      badge: "Nouveau"
    }
  ];

  const tutorials = [
    {
      id: 1,
      title: "Comment prendre rendez-vous en ligne",
      duration: "3 min",
      views: "1.2k vues",
      thumbnail: doctorImage,
      category: "Tutoriel"
    },
    {
      id: 2,
      title: "Utiliser la téléconsultation",
      duration: "5 min",
      views: "856 vues",
      thumbnail: familyImage,
      category: "Tutoriel"
    },
    {
      id: 3,
      title: "Gérer votre dossier médical",
      duration: "4 min",
      views: "2.1k vues",
      thumbnail: doctorImage,
      category: "Tutoriel"
    }
  ];

  const healthTips = [
    {
      icon: Heart,
      title: "Santé Cardiovasculaire",
      tips: [
        "Pratiquez 30 minutes d'activité physique par jour",
        "Limitez votre consommation de sel",
        "Contrôlez régulièrement votre tension artérielle",
        "Évitez le tabac et l'alcool en excès"
      ]
    },
    {
      icon: Droplet,
      title: "Hydratation",
      tips: [
        "Buvez au moins 1.5L d'eau par jour",
        "Augmentez votre consommation en cas de chaleur",
        "Privilégiez l'eau aux boissons sucrées",
        "Hydratez-vous avant, pendant et après l'effort"
      ]
    },
    {
      icon: Activity,
      title: "Activité Physique",
      tips: [
        "Marchez 30 minutes par jour minimum",
        "Variez les activités sportives",
        "Étirez-vous régulièrement",
        "Adaptez l'intensité à votre condition physique"
      ]
    },
    {
      icon: Brain,
      title: "Santé Mentale",
      tips: [
        "Dormez 7 à 8 heures par nuit",
        "Prenez du temps pour vous détendre",
        "N'hésitez pas à consulter un professionnel",
        "Maintenez un lien social régulier"
      ]
    }
  ];

  const firstAidGuides = [
    {
      icon: AlertCircle,
      title: "Arrêt Cardiaque",
      steps: [
        "1. Appelez immédiatement les secours (1300)",
        "2. Vérifiez la respiration",
        "3. Commencez le massage cardiaque",
        "4. 30 compressions, 2 insufflations",
        "5. Continuez jusqu'à l'arrivée des secours"
      ],
      color: "text-red-500"
    },
    {
      icon: Activity,
      title: "Hémorragie",
      steps: [
        "1. Allongez la victime",
        "2. Comprimez la plaie avec un tissu propre",
        "3. Maintenez la pression 10 minutes minimum",
        "4. Surélevez le membre si possible",
        "5. Appelez les secours si l'hémorragie persiste"
      ],
      color: "text-orange-500"
    },
    {
      icon: Baby,
      title: "Étouffement",
      steps: [
        "1. Encouragez la personne à tousser",
        "2. Donnez 5 claques dans le dos",
        "3. Effectuez 5 compressions abdominales",
        "4. Alternez jusqu'à dégagement",
        "5. Appelez les secours si nécessaire"
      ],
      color: "text-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px), radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Header/Navigation */}
      <header className="fixed top-0 w-full z-[1100] border-b bg-card/95 border-border/60 shadow-lg backdrop-blur-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logoSante} alt="Logo" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">
                  <span className="text-foreground">SANTE</span>
                  <span className="text-primary">.GA</span>
                </span>
                <span className="text-[10px] text-muted-foreground">Votre santé, notre priorité</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/for-professionals" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Professionnels
              </Link>
              <Link to="/awareness" className="text-primary font-medium text-sm">
                Sensibilisation
              </Link>
              <div className="flex items-center gap-3 ml-4">
                <ThemeToggle />
                <LanguageToggle />
                <Link to="/demo">
                  <Button variant="outline" size="sm">
                    Démo
                  </Button>
                </Link>
                <Link to="/login/patient">
                  <Button variant="ghost" size="sm">
                    Patient
                  </Button>
                </Link>
                <Link to="/login/professional">
                  <Button size="sm" className="bg-gradient-to-r from-accent to-accent/90">
                    Professionnel
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link to="/for-professionals" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                      Professionnels
                    </Link>
                    <Link to="/awareness" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-primary">
                      Sensibilisation
                    </Link>
                    <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
                      <Link to="/demo" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">Démo</Button>
                      </Link>
                      <Link to="/login/patient" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">Patient</Button>
                      </Link>
                      <Link to="/login/professional" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full">Professionnel</Button>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 backdrop-blur-sm animate-scale-in">
            <Heart className="w-5 h-5 text-secondary" />
            <span className="text-sm font-semibold text-foreground">
              Votre santé, notre priorité
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Sensibilisation </span>
            <span className="bg-gradient-to-r from-secondary via-warning to-accent bg-clip-text text-transparent">
              Santé
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Actualités, conseils et formations pour prendre soin de votre santé
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <Card className="p-2 shadow-xl backdrop-blur-xl">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input 
                    placeholder="Rechercher un article, tutoriel, conseil..."
                    className="pl-10 h-12 border-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="lg" className="shadow-lg">
                  Rechercher
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="relative py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 mb-12 bg-card border border-border p-1 h-auto shadow-lg">
              <TabsTrigger value="news" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-12">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Actualités</span>
              </TabsTrigger>
              <TabsTrigger value="tutorials" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-12">
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Tutoriels</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-12">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Conseils</span>
              </TabsTrigger>
              <TabsTrigger value="firstaid" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-12">
                <AlertCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Premiers Secours</span>
              </TabsTrigger>
            </TabsList>

            {/* News Tab */}
            <TabsContent value="news" className="animate-fade-in">
              <div className="space-y-6">
                {newsArticles.map((article, index) => (
                  <Card 
                    key={article.id} 
                    className="hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 group animate-fade-in backdrop-blur-xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="grid md:grid-cols-3 gap-0">
                      <div className="relative h-48 md:h-auto overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Badge className="absolute top-4 left-4 shadow-lg bg-gradient-to-r from-secondary to-accent">{article.badge}</Badge>
                      </div>
                      <div className="md:col-span-2 p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="outline" className="border-primary/40 text-primary">{article.category}</Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {article.date}
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">{article.title}</CardTitle>
                        <CardDescription className="text-base">{article.excerpt}</CardDescription>
                        <Button variant="link" className="px-0 mt-4 text-primary group-hover:gap-2 transition-all">
                          Lire la suite <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tutorials Tab */}
            <TabsContent value="tutorials" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map((tutorial, index) => (
                  <Card 
                    key={tutorial.id} 
                    className="hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 group animate-fade-in backdrop-blur-xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={tutorial.thumbnail} 
                        alt={tutorial.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      <Badge className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border-white/20">{tutorial.duration}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{tutorial.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        {tutorial.views}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Health Tips Tab */}
            <TabsContent value="tips" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-6">
                {healthTips.map((tip, index) => (
                  <Card 
                    key={index} 
                    className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in backdrop-blur-xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground mb-4 shadow-lg group-hover:scale-110 transition-transform">
                        <tip.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {tip.tips.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* First Aid Tab */}
            <TabsContent value="firstaid" className="animate-fade-in">
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-destructive/10 to-orange-500/10 border-destructive/30 shadow-lg backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-6 h-6" />
                      Numéros d'urgence au Gabon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-card rounded-lg hover:shadow-xl transition-shadow border">
                        <div className="text-3xl font-bold bg-gradient-to-r from-destructive to-orange-500 bg-clip-text text-transparent mb-1">1300</div>
                        <div className="text-sm text-muted-foreground">SAMU</div>
                      </div>
                      <div className="p-4 bg-card rounded-lg hover:shadow-xl transition-shadow border">
                        <div className="text-3xl font-bold bg-gradient-to-r from-destructive to-orange-500 bg-clip-text text-transparent mb-1">18</div>
                        <div className="text-sm text-muted-foreground">Pompiers</div>
                      </div>
                      <div className="p-4 bg-card rounded-lg hover:shadow-xl transition-shadow border">
                        <div className="text-3xl font-bold bg-gradient-to-r from-destructive to-orange-500 bg-clip-text text-transparent mb-1">1730</div>
                        <div className="text-sm text-muted-foreground">Police</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {firstAidGuides.map((guide, index) => (
                    <Card 
                      key={index} 
                      className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in backdrop-blur-xl"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader>
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                          <guide.icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl group-hover:text-orange-500 transition-colors">{guide.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {guide.steps.map((step, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">
                              {step}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto text-center p-12 shadow-2xl backdrop-blur-xl">
            <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Restez informé
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
              Inscrivez-vous à notre newsletter pour recevoir nos conseils santé et actualités
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input 
                  placeholder="Votre email"
                  type="email"
                  className="h-12"
                />
                <Button size="lg" className="shadow-lg">
                  S'abonner
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t backdrop-blur-xl bg-card/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 group">
                <img src={logoSante} alt="Logo" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold">
                    <span className="text-foreground">SANTE</span>
                    <span className="text-primary">.GA</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">Votre santé, notre priorité</span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground">
                La plateforme nationale de santé digitale au Gabon
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/teleconsultation" className="text-muted-foreground hover:text-primary transition-colors">Téléconsultation</Link></li>
                <li><Link to="/appointments" className="text-muted-foreground hover:text-primary transition-colors">Rendez-vous</Link></li>
                <li><Link to="/find-providers" className="text-muted-foreground hover:text-primary transition-colors">Trouver un médecin</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">À propos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/for-professionals" className="text-muted-foreground hover:text-primary transition-colors">Professionnels</Link></li>
                <li><Link to="/awareness" className="text-muted-foreground hover:text-primary transition-colors">Sensibilisation</Link></li>
                <li><Link to="/demo" className="text-muted-foreground hover:text-primary transition-colors">Démo</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Libreville, Gabon
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  contact@sante.ga
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 SANTE.GA - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
