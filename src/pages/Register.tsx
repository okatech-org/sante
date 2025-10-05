import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserRound, Stethoscope, ArrowRight, Menu, MapPin, Mail, Clock, Shield, CheckCircle2, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import logoSante from "@/assets/logo_sante.png";

const Register = () => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link to="/" className="flex items-center gap-3 group">
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
              <Link to="/awareness" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
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
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                {t('landing.secure') || 'Plateforme E-Santé Nationale du Gabon'}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="text-white">{t('register.title') || "Rejoignez-nous"} </span>
              <span className="bg-gradient-to-r from-cyan-400 via-green-400 via-yellow-400 via-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                dès aujourd'hui
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
              {t('register.subtitle') || "Choisissez votre type de compte pour commencer"}
            </p>
          </div>

          {/* Registration Options - Glass Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            {/* Patient Card */}
            <Card className="hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:-translate-y-2 group border-gray-800/50 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl relative overflow-hidden">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
              
              <CardHeader className="text-center pb-3 relative z-10">
                <div className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/50">
                  <UserRound className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2 text-white">
                  {t('register.patient.title') || "Patient"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-400">
                  {t('register.patient.description') || "Gérez votre santé facilement"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <ul className="space-y-2 mb-5">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      {t('register.patient.feature1') || "Prendre des rendez-vous en ligne"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      {t('register.patient.feature2') || "Accéder à votre dossier médical"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      {t('register.patient.feature3') || "Consulter en ligne (téléconsultation)"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      {t('register.patient.feature4') || "Suivre vos prescriptions et résultats"}
                    </span>
                  </li>
                </ul>
                <Link to="/register/patient" className="block">
                  <Button className="w-full shadow-lg hover:shadow-xl hover-scale bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-sm py-5 group/btn border-0">
                    {t('register.patient.cta') || "S'inscrire en tant que Patient"}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Professional Card */}
            <Card className="hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:-translate-y-2 group border-gray-800/50 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl relative overflow-hidden">
              {/* Gradient border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
              
              <CardHeader className="text-center pb-3 relative z-10">
                <div className="mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 via-orange-500 to-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/50">
                  <Stethoscope className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2 text-white">
                  {t('register.professional.title') || "Professionnel de Santé"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-400">
                  {t('register.professional.description') || "Développez votre activité médicale"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 relative z-10">
                <ul className="space-y-2 mb-5">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      {t('register.professional.feature1') || "Gérer votre agenda en ligne"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      {t('register.professional.feature2') || "Accéder aux dossiers patients"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      {t('register.professional.feature3') || "Proposer des téléconsultations"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">
                      {t('register.professional.feature4') || "Augmenter votre visibilité"}
                    </span>
                  </li>
                </ul>
                <Link to="/register/pro" className="block">
                  <Button className="w-full shadow-lg hover:shadow-xl hover-scale bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white text-sm py-5 group/btn border-0">
                    {t('register.professional.cta') || "S'inscrire en tant que Professionnel"}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Already have account link */}
          <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-400 text-sm sm:text-base">
              {t('register.hasAccount') || "Vous avez déjà un compte ?"}{" "}
              <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors underline">
                {t('register.login') || "Se connecter"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-6 md:py-8 px-4 sm:px-6 lg:px-8 bg-black/30 backdrop-blur-sm border-t border-gray-800/50 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={logoSante} 
                  alt="SANTE.GA Logo" 
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    <span className="text-white">SANTE</span>
                    <span className="text-cyan-400">.GA</span>
                  </h2>
                  <p className="text-xs text-gray-400">{t('landing.footer.tagline') || "Votre santé, notre priorité"}</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                {t('landing.footer.description') || "La plateforme nationale e-santé du Gabon. Connectant patients, médecins et professionnels de santé pour un accès équitable aux soins partout au Gabon."}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-3 text-white">{t('landing.services') || "Services"}</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/providers" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {t('landing.footer.findDoctor') || "Trouver un médecin"}
                  </Link>
                </li>
                <li>
                  <Link to="/teleconsultation" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {t('landing.footer.teleconsultation') || "Téléconsultation"}
                  </Link>
                </li>
                <li>
                  <Link to="/medical-record" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {t('landing.footer.medicalRecord') || "Dossier médical"}
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                    {t('landing.footer.cnamgsRights') || "Droits CNAMGS"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-base mb-3 text-white">{t('landing.footer.support') || "Contact"}</h4>
              <ul className="space-y-2">
                <li className="flex items-start text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{t('landing.footer.location') || "Libreville, Gabon"}</span>
                </li>
                <li className="flex items-start text-gray-400 text-sm">
                  <Mail className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>support@sante.ga</span>
                </li>
                <li className="flex items-start text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{t('landing.footer.availability') || "24/7 Support disponible"}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800/50 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-500 text-sm text-center md:text-left">
                © 2025 SANTE.GA - Conçu et développé par ORGANÉUS Gabon. Tous droits réservés.
              </p>
              
              <Link to="/superadmin" className="opacity-30 hover:opacity-60 transition-opacity flex items-center gap-1 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                <span>Admin</span>
              </Link>
              
              <div className="flex space-x-4 text-sm">
                <Link to="/support" className="text-gray-500 hover:text-cyan-400 transition-colors">
                  {t('landing.footer.privacy') || 'Confidentialité'}
                </Link>
                <Link to="/support" className="text-gray-500 hover:text-cyan-400 transition-colors">
                  {t('landing.footer.terms') || "Conditions d'utilisation"}
                </Link>
                <Link to="/support" className="text-gray-500 hover:text-cyan-400 transition-colors">
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
