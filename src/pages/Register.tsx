import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserRound, Stethoscope, ArrowRight, Menu, MapPin, Mail, Clock, Shield, CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import logoSante from "@/assets/logo_sante.png";

const Register = () => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background with Aurora Glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/90 animate-aurora" />
      
      {/* Header/Navigation */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                <img src={logoSante} alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-2xl font-bold text-white">SANTE<span className="text-white/90">.GA</span></span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/services" className="text-white/90 hover:text-white transition-colors font-medium">
                {t('landing.services') || 'Services'}
              </Link>
              <Link to="/how-it-works" className="text-white/90 hover:text-white transition-colors font-medium">
                {t('landing.howItWorks') || 'Comment ça marche'}
              </Link>
              <Link to="/about" className="text-white/90 hover:text-white transition-colors font-medium">
                {t('nav.about') || 'À Propos'}
              </Link>
              <Link to="/awareness" className="text-white/90 hover:text-white transition-colors font-medium">
                Sensibilisation
              </Link>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
                <ThemeToggle />
                <LanguageToggle />
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                    {t('landing.cta.login') || 'Se connecter'}
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
                    <Link 
                      to="/services" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {t('landing.services') || 'Services'}
                    </Link>
                    <Link 
                      to="/how-it-works" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {t('landing.howItWorks') || 'Comment ça marche'}
                    </Link>
                    <Link 
                      to="/about" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      {t('nav.about') || 'À Propos'}
                    </Link>
                    <Link 
                      to="/awareness" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
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
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-4">
              <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium animate-scale-in">
                {t('landing.secure') || 'Plateforme E-Santé Nationale du Gabon'}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('register.title') || "Rejoignez-nous"}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {t('register.subtitle') || "Choisissez votre type de compte pour commencer"}
            </p>
          </div>

          {/* Registration Options - Aurora Glass Cards */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            {/* Patient Card */}
            <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border-border/40 bg-card/80 backdrop-blur-xl relative overflow-hidden">
              {/* Glass shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="text-center pb-4 relative">
                <div className="mx-auto mb-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <UserRound className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t('register.patient.title') || "Patient"}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('register.patient.description') || "Gérez votre santé facilement"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {t('register.patient.feature1') || "Prendre des rendez-vous en ligne"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {t('register.patient.feature2') || "Accéder à votre dossier médical"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {t('register.patient.feature3') || "Consulter en ligne (téléconsultation)"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {t('register.patient.feature4') || "Suivre vos prescriptions et résultats"}
                    </span>
                  </li>
                </ul>
                <Link to="/register/patient" className="block">
                  <Button className="w-full shadow-lg hover:shadow-xl hover-scale bg-gradient-to-r from-primary to-secondary text-white text-base py-6 group/btn">
                    {t('register.patient.cta') || "S'inscrire en tant que Patient"}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Professional Card */}
            <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border-border/40 bg-card/80 backdrop-blur-xl relative overflow-hidden">
              {/* Glass shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="text-center pb-4 relative">
                <div className="mx-auto mb-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary via-accent to-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Stethoscope className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl mb-2 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  {t('register.professional.title') || "Professionnel de Santé"}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('register.professional.description') || "Développez votre activité médicale"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {t('register.professional.feature1') || "Gérer votre agenda en ligne"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {t('register.professional.feature2') || "Accéder aux dossiers patients"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {t('register.professional.feature3') || "Proposer des téléconsultations"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {t('register.professional.feature4') || "Augmenter votre visibilité"}
                    </span>
                  </li>
                </ul>
                <Link to="/register/pro" className="block">
                  <Button className="w-full shadow-lg hover:shadow-xl hover-scale bg-gradient-to-r from-secondary to-accent text-white text-base py-6 group/btn">
                    {t('register.professional.cta') || "S'inscrire en tant que Professionnel"}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Already have account link */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-white/90 text-base sm:text-lg">
              {t('register.hasAccount') || "Vous avez déjà un compte ?"}{" "}
              <Link to="/login" className="font-semibold underline hover:text-white transition-colors">
                {t('register.login') || "Se connecter"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm border-t border-white/10 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={logoSante} 
                  alt="SANTE.GA Logo" 
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    SANTE<span className="text-white/90">.GA</span>
                  </h2>
                  <p className="text-xs text-white/70">{t('landing.footer.tagline') || "Votre santé, notre priorité"}</p>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed text-sm">
                {t('landing.footer.description') || "La plateforme nationale e-santé du Gabon. Connectant patients, médecins et professionnels de santé pour un accès équitable aux soins partout au Gabon."}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-3 text-white">{t('landing.services') || "Services"}</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/providers" className="text-white/80 hover:text-white transition-colors text-sm">
                    {t('landing.footer.findDoctor') || "Trouver un médecin"}
                  </Link>
                </li>
                <li>
                  <Link to="/teleconsultation" className="text-white/80 hover:text-white transition-colors text-sm">
                    {t('landing.footer.teleconsultation') || "Téléconsultation"}
                  </Link>
                </li>
                <li>
                  <Link to="/medical-record" className="text-white/80 hover:text-white transition-colors text-sm">
                    {t('landing.footer.medicalRecord') || "Dossier médical"}
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-white/80 hover:text-white transition-colors text-sm">
                    {t('landing.footer.cnamgsRights') || "Droits CNAMGS"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-3 text-white">{t('landing.footer.support') || "Contact"}</h4>
              <ul className="space-y-2">
                <li className="flex items-start text-white/80 text-sm">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{t('landing.footer.location') || "Libreville, Gabon"}</span>
                </li>
                <li className="flex items-start text-white/80 text-sm">
                  <Mail className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>support@sante.ga</span>
                </li>
                <li className="flex items-start text-white/80 text-sm">
                  <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{t('landing.footer.availability') || "24/7 Support disponible"}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-white/70 text-sm text-center md:text-left">
                © 2025 SANTE.GA - Conçu et développé par ORGANÉUS Gabon. Tous droits réservés.
              </p>
              
              <Link to="/superadmin" className="opacity-30 hover:opacity-60 transition-opacity flex items-center gap-1 text-xs text-white/70">
                <Shield className="h-3 w-3" />
                <span>Admin</span>
              </Link>
              
              <div className="flex space-x-4 text-sm">
                <Link to="/support" className="text-white/70 hover:text-white transition-colors">
                  {t('landing.footer.privacy') || 'Confidentialité'}
                </Link>
                <Link to="/support" className="text-white/70 hover:text-white transition-colors">
                  {t('landing.footer.terms') || "Conditions d'utilisation"}
                </Link>
                <Link to="/support" className="text-white/70 hover:text-white transition-colors">
                  {t('landing.footer.helpCenter') || 'Aide'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;
