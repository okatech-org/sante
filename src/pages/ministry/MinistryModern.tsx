import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, Shield, Users, Activity, Building2, MapPin, Phone, Mail, Clock,
  Target, TrendingUp, CheckCircle2, ArrowRight, Stethoscope, FileText,
  Eye, ChevronLeft, ChevronRight, Sparkles, Zap, Award, Globe,
  HeartHandshake, Menu, Home, Info, Briefcase, FileBarChart, BookOpen, Contact
} from "lucide-react";
import heroImage from "@/assets/ministry-hero.jpg";
import consultationImage from "@/assets/ministry-consultation.jpg";
import maternalImage from "@/assets/ministry-maternal.jpg";
import strategyImage from "@/assets/ministry-strategy.jpg";
import { GabonHealthMap } from "@/components/ministry/GabonHealthMap";
import { cn } from "@/lib/utils";

// Composant pour les cartes avec effet 3D
const Card3D = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setRotateX(((y - centerY) / centerY) * -10);
    setRotateY(((x - centerX) / centerX) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={cn("relative preserve-3d", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
};

const MinistryModern = () => {
  const { scrollYProgress } = useScroll();
  const [currentPublication, setCurrentPublication] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  
  // Navbar background opacity based on scroll
  const navBgOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 0.95]);


  const publications = [
    {
      title: "Rapport Performance 2024",
      type: "Annuel",
      description: "Analyse complète de la performance du système de santé gabonais",
      date: "15 Jan 2025",
      icon: FileText,
      color: "primary",
      image: strategyImage
    },
    {
      title: "Bulletin Épidémiologique T3",
      type: "Trimestriel",
      description: "Surveillance des maladies prioritaires au 3ème trimestre 2025",
      date: "05 Oct 2025",
      icon: Activity,
      color: "secondary",
      image: consultationImage
    },
    {
      title: "Télémédecine SANTE.GA",
      type: "Spécial",
      description: "Bilan du déploiement de la plateforme de télémédecine",
      date: "15 Sep 2025",
      icon: Stethoscope,
      color: "accent",
      image: maternalImage
    }
  ];

  const strategicAxes = [
    { icon: Target, title: "Gouvernance & Leadership", desc: "Renforcement du secteur santé", delay: 0.1 },
    { icon: Building2, title: "Offre de Soins", desc: "Infrastructures & qualité", delay: 0.2 },
    { icon: Users, title: "Ressources Humaines", desc: "Formation & gestion", delay: 0.3 },
    { icon: TrendingUp, title: "Financement", desc: "Couverture Universelle", delay: 0.4 },
    { icon: Shield, title: "Promotion & Prévention", desc: "Santé publique", delay: 0.5 }
  ];

  const menuItems = [
    { icon: Home, label: "Accueil", href: "#" },
    { icon: Info, label: "À propos", href: "#vision" },
    { icon: Briefcase, label: "Programmes", href: "#programmes" },
    { icon: FileBarChart, label: "Publications", href: "#publications" },
    { icon: MapPin, label: "Cartographie", href: "#cartographie" },
    { icon: Contact, label: "Contact", href: "#contact" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      
      {/* Navbar Horizontale Moderne */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50"
        style={{ 
          backgroundColor: `rgba(255, 255, 255, ${navBgOpacity})`,
          backdropFilter: "blur(10px)"
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Titre */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div className="hidden md:block">
                <div className="font-bold text-lg text-foreground">Ministère de la Santé</div>
                <div className="text-xs text-muted-foreground">République Gabonaise</div>
              </div>
            </motion.div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/10 transition-all"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -2 }}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </motion.a>
                );
              })}
            </div>

            {/* Bouton CTA */}
            <motion.div 
              className="hidden md:flex items-center gap-3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/ministry'}
                className="border-2"
              >
                <Shield className="h-4 w-4 mr-2" />
                Administration
              </Button>
            </motion.div>

            {/* Menu Mobile */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-background/95 backdrop-blur-xl border-t"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-4">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* Hero Section avec Parallax et Animations */}
      <motion.section 
        className="relative h-screen overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        >
          <img 
            src={heroImage} 
            alt="Ministère de la Santé - Gabon" 
            className="w-full h-full object-cover brightness-110"
          />
        </motion.div>
        
        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                className="flex flex-wrap gap-4 justify-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
              >
                <Button 
                  size="lg" 
                  className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-6 text-lg"
                >
                  Explorer nos Services
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="backdrop-blur-sm border-2 px-8 py-6 text-lg hover:bg-background/50"
                >
                  En savoir plus
                </Button>
              </motion.div>

              {/* Stats intégrées dans le Hero - Design Compact avec Glass Morphism */}
              <motion.div
                className="mt-32 md:mt-16 max-w-5xl mx-auto"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <div className="bg-background/30 backdrop-blur-2xl border border-white/30 rounded-2xl p-6 shadow-2xl">
                  <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { icon: Users, value: "1.8M", label: "Population", color: "text-blue-500" },
                      { icon: HeartHandshake, value: "78%", label: "Couverture", color: "text-green-500" },
                      { icon: Building2, value: "238", label: "Établissements", color: "text-purple-500" },
                      { icon: Stethoscope, value: "8.4K", label: "Professionnels", color: "text-orange-500" },
                      { icon: Activity, value: "145K", label: "Consultations", color: "text-pink-500" },
                      { icon: Globe, value: "12K", label: "Téléconsultations", color: "text-indigo-500" }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        className="text-center group"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.6 + index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <stat.icon className={cn("h-6 w-6", stat.color)} />
                          <div className="font-bold text-2xl text-foreground" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                            {stat.value}
                          </div>
                          <div className="text-xs text-foreground/70 font-medium">{stat.label}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Vision & Mission avec Layout Split Moderne */}
      <section id="vision" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-4 mb-4">
              <Badge className="mb-2 md:mb-0 self-center bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
                <Target className="w-4 h-4 mr-2" />
                PNDS 2024-2028
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Notre Vision Stratégique
              </h2>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Améliorer l'état de santé et le bien-être de la population gabonaise en assurant l'accès universel à des services de santé de qualité
            </p>
          </motion.div>

          {/* Image avec bloc d'informations unifié */}
          <motion.div 
            className="relative h-[700px] rounded-3xl overflow-hidden shadow-2xl max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={strategyImage} 
              alt="Stratégie de santé au Gabon" 
              className="w-full h-full object-cover"
            />
            
            {/* Bloc unique avec toutes les informations */}
            <div className="absolute bottom-6 left-6 right-6">
              <motion.div 
                className="bg-background/95 backdrop-blur-xl rounded-xl p-6 shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Titre principal */}
                <div className="text-center mb-5">
                  <h3 className="text-2xl font-bold mb-2">Plan National de Développement Sanitaire</h3>
                </div>

                {/* Axes stratégiques */}
                <div className="flex lg:grid lg:grid-cols-5 gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20">
                  {strategicAxes.map((axis, index) => (
                    <motion.div
                      key={index}
                      className="group flex items-center gap-2 p-2.5 rounded-lg hover:bg-primary/10 transition-all cursor-pointer min-w-[200px] lg:min-w-0"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <motion.div 
                        className="bg-gradient-to-br from-primary to-secondary w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <axis.icon className="h-4 w-4 text-white" />
                      </motion.div>
                      <div className="flex-1 text-left">
                        <h4 className="font-bold text-[11px] mb-0.5 group-hover:text-primary transition-colors leading-tight">
                          {axis.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground leading-snug">{axis.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programmes Prioritaires - Bento Grid Moderne */}
      <section id="programmes" className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-success/10 to-success/20 text-success border-success/20">
              <Award className="w-4 h-4 mr-2" />
              Programmes Prioritaires
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Actions Concrètes pour la Santé
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des initiatives majeures pour améliorer la santé de tous les Gabonais
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Programme Paludisme */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card3D>
                <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={consultationImage} 
                      alt="Lutte contre le paludisme" 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-success text-white border-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        72% accompli
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-success/20 to-success/10 rounded-xl flex items-center justify-center">
                        <Shield className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Lutte contre le Paludisme</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Distribution de 500,000 moustiquaires imprégnées dans toutes les provinces pour réduire l'incidence du paludisme de 30%.
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-semibold">72%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-success to-success/80"
                          initial={{ width: 0 }}
                          whileInView={{ width: "72%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-primary">15 Mds</div>
                        <div className="text-xs text-muted-foreground">Budget FCFA</div>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-primary">9/9</div>
                        <div className="text-xs text-muted-foreground">Provinces</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Card3D>
            </motion.div>

            {/* Programme Santé Maternelle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card3D>
                <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={maternalImage} 
                      alt="Santé maternelle et infantile" 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-white border-0">
                        <Activity className="h-3 w-3 mr-1" />
                        68% accompli
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center">
                        <Heart className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Santé Maternelle et Infantile</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Réduction de la mortalité maternelle à moins de 150 pour 100,000 naissances vivantes à travers un renforcement des capacités.
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-semibold">68%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-accent to-accent/80"
                          initial={{ width: 0 }}
                          whileInView={{ width: "68%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-primary">25 Mds</div>
                        <div className="text-xs text-muted-foreground">Budget FCFA</div>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-primary">-50%</div>
                        <div className="text-xs text-muted-foreground">Objectif 2028</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Card3D>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cartographie Interactive Modernisée */}
      <section id="cartographie" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Map Section - 2/3 de l'espace */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <Badge className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
                  <MapPin className="w-4 h-4 mr-2" />
                  Cartographie Nationale
                </Badge>
                <h2 className="text-4xl font-bold">Réseau de Santé National</h2>
              </div>
              
              <Card className="border-0 shadow-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-[500px]">
                    <GabonHealthMap />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Section avec Glass Effect - 1/3 de l'espace */}
            <motion.div
              className="lg:col-span-1"
              id="contact"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <Badge className="mb-4 bg-gradient-to-r from-secondary/10 to-primary/10 text-secondary border-secondary/20">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Direct
                </Badge>
                <h2 className="text-4xl font-bold">Nous Contacter</h2>
              </div>

              {/* Bloc unique de contact avec même hauteur que la carte */}
              <Card className="border-0 shadow-2xl overflow-hidden h-[500px] bg-gradient-to-br from-background to-muted/20">
                <CardContent className="p-8 h-full flex flex-col">
                  {/* Informations de contact */}
                  <div className="flex-1 space-y-6">
                    {/* Adresse */}
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl text-white flex-shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg mb-2">Adresse</div>
                        <div className="text-muted-foreground leading-relaxed">
                          À côté de l'immeuble Alu-Suisse<br />
                          Libreville, Gabon
                        </div>
                      </div>
                    </div>

                    {/* Téléphone */}
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl text-white flex-shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg mb-2">Téléphone</div>
                        <div className="text-muted-foreground leading-relaxed">
                          +241 01-72-26-61<br />
                          +241 06 47 74 83
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl text-white flex-shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg mb-2">Email</div>
                        <div className="text-muted-foreground leading-relaxed">
                          contact@sante.gouv.ga
                        </div>
                      </div>
                    </div>

                    {/* Horaires */}
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl text-white flex-shrink-0">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg mb-2">Horaires</div>
                        <div className="text-muted-foreground leading-relaxed">
                          Lundi - Vendredi: 08h00 - 17h00<br />
                          Weekend: Fermé
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Publications avec Carousel Moderne */}
      <section id="publications" className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
              <FileText className="w-4 h-4 mr-2" />
              Documentation
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Publications Récentes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Accédez aux derniers rapports et documents officiels
            </p>
          </motion.div>

          {/* Carousel Container */}
          <div className="relative max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPublication((prev) => (prev - 1 + publications.length) % publications.length)}
                className="p-3 rounded-full bg-background shadow-lg border-2 hover:border-primary/30 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>

              {/* Publications Cards */}
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPublication}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="grid md:grid-cols-3 gap-6"
                  >
                    {publications.map((pub, index) => {
                      const Icon = pub.icon;
                      const isActive = index === currentPublication;
                      
                      return (
                        <motion.div
                          key={index}
                          whileHover={{ y: -5 }}
                          className={cn(
                            "transition-all duration-300",
                            !isActive && "opacity-60 scale-95"
                          )}
                        >
                          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all h-full overflow-hidden group">
                            {/* Image de couverture */}
                            <div className="relative h-48 overflow-hidden">
                              <img 
                                src={pub.image} 
                                alt={pub.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                              
                              {/* Badge type en overlay */}
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-background/90 backdrop-blur-sm border-0">
                                  {pub.type}
                                </Badge>
                              </div>
                              
                              {/* Icône en overlay */}
                              <div className="absolute bottom-4 right-4">
                                <div className={`bg-gradient-to-br from-${pub.color}/90 to-${pub.color}/80 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}>
                                  <Icon className="h-6 w-6 text-white" />
                                </div>
                              </div>
                            </div>

                            {/* Contenu */}
                            <CardContent className="p-6">
                              <h3 className="font-bold text-lg mb-2 line-clamp-2">{pub.title}</h3>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {pub.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                <Clock className="h-3 w-3" />
                                <span>{pub.date}</span>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full group hover:bg-primary hover:text-primary-foreground transition-all"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Consulter
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPublication((prev) => (prev + 1) % publications.length)}
                className="p-3 rounded-full bg-background shadow-lg border-2 hover:border-primary/30 transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {publications.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPublication(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentPublication 
                      ? "w-8 bg-primary" 
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />
        
        <motion.div 
          className="container mx-auto px-4 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 px-6 py-2 text-base bg-gradient-to-r from-primary to-secondary text-white border-0">
                <Zap className="w-4 h-4 mr-2" />
                Ensemble pour la santé
              </Badge>
            </motion.div>
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Rejoignez la Transformation Digitale
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Participez à l'amélioration du système de santé gabonais grâce à la plateforme SANTE.GA
            </p>
            
            <motion.div 
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all group"
              >
                Découvrir SANTE.GA
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-10 py-6 text-lg border-2 hover:bg-primary hover:text-primary-foreground transition-all"
                onClick={() => window.location.href = '/ministry'}
              >
                <Shield className="mr-2 h-5 w-5" />
                Espace Administration
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer Moderne */}
      <footer className="bg-gradient-to-br from-secondary via-secondary/95 to-secondary text-secondary-foreground py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Ministère de la Santé publique et de la Population
              </h3>
              <p className="text-secondary-foreground/80 mb-6">
                République Gabonaise
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Accessibilité</a>
              <a href="#" className="hover:text-white transition-colors">Plan du site</a>
            </div>
            
            <div className="pt-6 border-t border-secondary-foreground/20">
              <p className="text-sm text-secondary-foreground/70">
                © 2025 Ministère de la Santé - Tous droits réservés
              </p>
              <p className="text-sm text-secondary-foreground/70 mt-2">
                Propulsé par{" "}
                <span className="font-semibold text-white">SANTE.GA</span>
              </p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default MinistryModern;
