import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRound, Stethoscope, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const Register = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/90 animate-aurora" />
      
      {/* Header */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                <img src="/logo_sante.png" alt="Logo" className="w-8 h-8" />
              </div>
              <span className="text-2xl font-bold text-white">SantéGabon</span>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              {t('register.title') || "Rejoignez-nous"}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto">
              {t('register.subtitle') || "Choisissez votre type de compte pour commencer"}
            </p>
          </div>

          {/* Registration Options */}
          <div className="grid md:grid-cols-2 gap-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            {/* Patient Card */}
            <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border-border/40 bg-card/90 backdrop-blur-xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserRound className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl mb-2">
                  {t('register.patient.title') || "Patient"}
                </CardTitle>
                <CardDescription className="text-lg">
                  {t('register.patient.description') || "Gérez votre santé facilement"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {t('register.patient.feature1') || "Prendre des rendez-vous en ligne"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {t('register.patient.feature2') || "Accéder à votre dossier médical"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {t('register.patient.feature3') || "Consulter en ligne (téléconsultation)"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {t('register.patient.feature4') || "Suivre vos prescriptions et résultats"}
                    </span>
                  </li>
                </ul>
                <Link to="/register/patient" className="block">
                  <Button className="w-full shadow-lg hover:shadow-xl hover-scale bg-gradient-to-r from-primary to-secondary text-lg py-6 group">
                    {t('register.patient.cta') || "S'inscrire en tant que Patient"}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Professional Card */}
            <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border-border/40 bg-card/90 backdrop-blur-xl">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-6 w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary via-accent to-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Stethoscope className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl mb-2">
                  {t('register.professional.title') || "Professionnel de Santé"}
                </CardTitle>
                <CardDescription className="text-lg">
                  {t('register.professional.description') || "Développez votre activité médicale"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-secondary to-accent mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {t('register.professional.feature1') || "Gérer votre agenda en ligne"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-secondary to-accent mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {t('register.professional.feature2') || "Accéder aux dossiers patients"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-secondary to-accent mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {t('register.professional.feature3') || "Proposer des téléconsultations"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-secondary to-accent mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      {t('register.professional.feature4') || "Augmenter votre visibilité"}
                    </span>
                  </li>
                </ul>
                <Link to="/register/pro" className="block">
                  <Button className="w-full shadow-lg hover:shadow-xl hover-scale bg-gradient-to-r from-secondary to-accent text-lg py-6 group">
                    {t('register.professional.cta') || "S'inscrire en tant que Professionnel"}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Footer Link */}
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-white/90 text-lg">
              {t('register.hasAccount') || "Vous avez déjà un compte ?"}{" "}
              <Link to="/login" className="font-semibold underline hover:text-white transition-colors">
                {t('register.login') || "Se connecter"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
