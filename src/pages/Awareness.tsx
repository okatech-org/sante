import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  Baby
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={awarenessHero} 
            alt="Sensibilisation santé" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Sensibilisation Santé
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Actualités, conseils et formations pour prendre soin de votre santé
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  placeholder="Rechercher un article, tutoriel, conseil..."
                  className="pl-10 bg-white text-foreground h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="lg" variant="secondary">
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 mb-12">
              <TabsTrigger value="news" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Actualités</span>
              </TabsTrigger>
              <TabsTrigger value="tutorials" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Tutoriels</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Conseils</span>
              </TabsTrigger>
              <TabsTrigger value="firstaid" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Premiers Secours</span>
              </TabsTrigger>
            </TabsList>

            {/* News Tab */}
            <TabsContent value="news">
              <div className="space-y-6">
                {newsArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="grid md:grid-cols-3 gap-0">
                      <div className="relative h-48 md:h-auto">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-4 left-4">{article.badge}</Badge>
                      </div>
                      <div className="md:col-span-2 p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="outline">{article.category}</Badge>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {article.date}
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-3">{article.title}</CardTitle>
                        <CardDescription className="text-base">{article.excerpt}</CardDescription>
                        <Button variant="link" className="px-0 mt-4">
                          Lire la suite →
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tutorials Tab */}
            <TabsContent value="tutorials">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                    <div className="relative">
                      <img 
                        src={tutorial.thumbnail} 
                        alt={tutorial.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                          <Play className="w-8 h-8 text-primary-foreground ml-1" />
                        </div>
                      </div>
                      <Badge className="absolute top-4 right-4">{tutorial.duration}</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
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
            <TabsContent value="tips">
              <div className="grid md:grid-cols-2 gap-6">
                {healthTips.map((tip, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                        <tip.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {tip.tips.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
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
            <TabsContent value="firstaid">
              <div className="space-y-6">
                <Card className="bg-destructive/10 border-destructive/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-6 h-6" />
                      Numéros d'urgence au Gabon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-background rounded-lg">
                        <div className="text-3xl font-bold text-destructive mb-1">1300</div>
                        <div className="text-sm text-muted-foreground">SAMU</div>
                      </div>
                      <div className="p-4 bg-background rounded-lg">
                        <div className="text-3xl font-bold text-destructive mb-1">18</div>
                        <div className="text-sm text-muted-foreground">Pompiers</div>
                      </div>
                      <div className="p-4 bg-background rounded-lg">
                        <div className="text-3xl font-bold text-destructive mb-1">1730</div>
                        <div className="text-sm text-muted-foreground">Police</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {firstAidGuides.map((guide, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 ${guide.color} mb-4`}>
                          <guide.icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl">{guide.title}</CardTitle>
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

      {/* Newsletter CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Restez informé
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Inscrivez-vous à notre newsletter pour recevoir nos conseils santé et actualités
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input 
              placeholder="Votre email"
              className="bg-primary-foreground text-foreground"
            />
            <Button variant="secondary" size="lg">
              S'abonner
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
