import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/MainLayout";
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
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Awareness() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

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
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section - Style Landing */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={awarenessHero} 
            alt="Sensibilisation santé" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/90" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white/10 backdrop-blur-sm border border-white/20 animate-scale-in">
            <Heart className="w-4 h-4 text-white" />
            <span className="text-white">Votre santé, notre priorité</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white animate-fade-in leading-tight">
            Sensibilisation Santé
          </h1>
          <p className="text-xl sm:text-2xl max-w-3xl mx-auto mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Actualités, conseils et formations pour prendre soin de votre santé
          </p>
          
          {/* Search Bar avec glassmorphism */}
          <div className="max-w-2xl mx-auto animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80 w-5 h-5" />
                  <Input 
                    placeholder="Rechercher un article, tutoriel, conseil..."
                    className="pl-10 bg-white/90 dark:bg-black/40 text-foreground dark:text-white h-12 border-white/40 dark:border-white/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="lg" className="shadow-lg hover:shadow-xl hover-scale bg-secondary hover:bg-secondary/90">
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 mb-12 bg-card/60 backdrop-blur-sm border border-border/40 p-1 h-auto">
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
                    className="hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-border/40 hover:-translate-y-1 group animate-fade-in"
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
                          <Badge variant="outline" className="border-primary/40">{article.category}</Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {article.date}
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">{article.title}</CardTitle>
                        <CardDescription className="text-base">{article.excerpt}</CardDescription>
                        <Button variant="link" className="px-0 mt-4 group-hover:gap-2 transition-all">
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
                    className="hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 group animate-fade-in"
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
                    className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in border-border/40"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary text-white mb-4 shadow-lg group-hover:scale-110 transition-transform">
                        <tip.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {tip.tips.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary mt-2 flex-shrink-0" />
                            <span className="text-foreground">{item}</span>
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
                      className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in border-border/40"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader>
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary text-white mb-4 shadow-lg group-hover:scale-110 transition-transform ${guide.color}`}>
                          <guide.icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{guide.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {guide.steps.map((step, idx) => (
                            <li key={idx} className="text-sm text-foreground">
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

      {/* Newsletter CTA - Style Landing */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent animate-aurora opacity-75" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Restez informé
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Inscrivez-vous à notre newsletter pour recevoir nos conseils santé et actualités
          </p>
          <div className="max-w-md mx-auto">
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-2">
              <div className="flex gap-2">
                <Input 
                  placeholder="Votre email"
                  className="bg-white/90 dark:bg-black/40 text-foreground dark:text-white border-white/40 dark:border-white/20"
                />
                <Button className="shadow-lg hover:shadow-xl hover-scale bg-white text-primary hover:bg-white/90">
                  S'abonner
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </MainLayout>
  );
}
