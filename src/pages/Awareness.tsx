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
    <div className="min-h-screen relative overflow-hidden bg-[#0A0E1A]">
      {/* Animated starfield background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0A0E1A] to-[#0A0E1A]" />
        <div className="stars-container absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `twinkle ${Math.random() * 3 + 2}s infinite ${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header/Navigation */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center -gap-1 group">
              <img src={logoSante} alt="Logo" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">
                  <span className="text-white">SANTE</span>
                  <span className="text-cyan-400">.GA</span>
                </span>
                <span className="text-[10px] text-gray-400">Votre santé, notre priorité</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/services" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                {t('landing.services') || 'Services'}
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                {t('nav.about') || 'À propos'}
              </Link>
              <Link to="/for-professionals" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Professionnels
              </Link>
              <Link to="/awareness" className="text-white transition-colors text-sm font-medium">
                Sensibilisation
              </Link>
              <div className="flex items-center gap-3 ml-4">
                <ThemeToggle />
                <LanguageToggle />
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
                    {t('landing.cta.login') || 'Se connecter'}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg">
                    {t('landing.hero.patient') || "S'inscrire"}
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
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                      {t('landing.services') || 'Services'}
                    </Link>
                    <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                      {t('nav.about') || 'À Propos'}
                    </Link>
                    <Link to="/for-professionals" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                      Professionnels
                    </Link>
                    <Link to="/awareness" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-primary transition-colors">
                      Sensibilisation
                    </Link>
                    <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          {t('landing.cta.login') || 'Se connecter'}
                        </Button>
                      </Link>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Heart className="w-5 h-5 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              Votre santé, notre priorité
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-white">Votre </span>
            <span className="bg-gradient-to-r from-cyan-400 via-green-400 via-yellow-400 via-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              Sensibilisation Santé
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-8 animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Actualités, conseils et formations pour prendre soin de votre santé
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800/50 p-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    placeholder="Rechercher un article, tutoriel, conseil..."
                    className="pl-10 bg-white/5 text-white h-12 border-white/10 placeholder:text-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg">
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="relative z-10 py-8 md:py-10">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 mb-12 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-800/50 p-1 h-auto">
              <TabsTrigger value="news" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400 h-12">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Actualités</span>
              </TabsTrigger>
              <TabsTrigger value="tutorials" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400 h-12">
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Tutoriels</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400 h-12">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Conseils</span>
              </TabsTrigger>
              <TabsTrigger value="firstaid" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-400 h-12">
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
                    className="hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer overflow-hidden border-gray-800/50 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl hover:-translate-y-1 group animate-fade-in"
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
                          <Badge variant="outline" className="border-cyan-500/40 text-cyan-400">{article.category}</Badge>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {article.date}
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-3 text-white group-hover:text-cyan-400 transition-colors">{article.title}</CardTitle>
                        <CardDescription className="text-base text-gray-300">{article.excerpt}</CardDescription>
                        <Button variant="link" className="px-0 mt-4 text-cyan-400 hover:text-cyan-300 group-hover:gap-2 transition-all">
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
                    className="hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 group animate-fade-in border-gray-800/50 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl"
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
                      <CardTitle className="text-lg text-white group-hover:text-pink-400 transition-colors">{tutorial.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-gray-400">
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
                    className="hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 group animate-fade-in border-gray-800/50 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white mb-4 shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform">
                        <tip.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-cyan-400 transition-colors">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {tip.tips.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 mt-2 flex-shrink-0" />
                            <span className="text-gray-300">{item}</span>
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
                <Card className="bg-gradient-to-r from-destructive/10 to-orange-500/10 border-destructive/30 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-6 h-6" />
                      Numéros d'urgence au Gabon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-card rounded-lg hover:shadow-xl transition-shadow border border-border/40">
                        <div className="text-3xl font-bold bg-gradient-to-r from-destructive to-orange-500 bg-clip-text text-transparent mb-1">1300</div>
                        <div className="text-sm text-muted-foreground">SAMU</div>
                      </div>
                      <div className="p-4 bg-card rounded-lg hover:shadow-xl transition-shadow border border-border/40">
                        <div className="text-3xl font-bold bg-gradient-to-r from-destructive to-orange-500 bg-clip-text text-transparent mb-1">18</div>
                        <div className="text-sm text-muted-foreground">Pompiers</div>
                      </div>
                      <div className="p-4 bg-card rounded-lg hover:shadow-xl transition-shadow border border-border/40">
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
                      className="hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 group animate-fade-in border-gray-800/50 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader>
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white mb-4 shadow-lg shadow-orange-500/50 group-hover:scale-110 transition-transform`}>
                          <guide.icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-white group-hover:text-orange-400 transition-colors">{guide.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {guide.steps.map((step, idx) => (
                            <li key={idx} className="text-sm text-gray-300">
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
      <section className="relative z-10 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-12 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
              Restez informé
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-400">
              Inscrivez-vous à notre newsletter pour recevoir nos conseils santé et actualités
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input 
                  placeholder="Votre email"
                  className="bg-white/5 text-white border-white/10 placeholder:text-gray-500"
                />
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg">
                  S'abonner
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <Link to="/" className="flex items-center -gap-1 group">
                <img src={logoSante} alt="Logo" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold">
                    <span className="text-white">SANTE</span>
                    <span className="text-cyan-400">.GA</span>
                  </span>
                  <span className="text-[10px] text-gray-400">Votre santé, notre priorité</span>
                </div>
              </Link>
              <p className="text-sm text-gray-400">
                La plateforme nationale de santé digitale au Gabon
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services" className="text-gray-400 hover:text-cyan-400 transition-colors">Téléconsultation</Link></li>
                <li><Link to="/services" className="text-gray-400 hover:text-cyan-400 transition-colors">Rendez-vous</Link></li>
                <li><Link to="/providers" className="text-gray-400 hover:text-cyan-400 transition-colors">Trouver un médecin</Link></li>
                <li><Link to="/cartography" className="text-gray-400 hover:text-cyan-400 transition-colors">Cartographie</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">À propos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-gray-400 hover:text-cyan-400 transition-colors">Notre mission</Link></li>
                <li><Link to="/for-professionals" className="text-gray-400 hover:text-cyan-400 transition-colors">Professionnels</Link></li>
                <li><Link to="/awareness" className="text-gray-400 hover:text-cyan-400 transition-colors">Sensibilisation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  Libreville, Gabon
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  contact@sante.ga
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800/50 text-center text-sm text-gray-400">
            <p>© 2025 SANTE.GA - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
