import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FileText, 
  TestTube, 
  CreditCard, 
  Shield, 
  Clock,
  MapPin,
  Bell,
  Stethoscope,
  Video,
  Building2,
  Heart,
  CheckCircle2
} from "lucide-react";
import { InfoCard } from "@/components/common/InfoCard";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Landing() {
  const { t } = useLanguage();

  const howItWorks = [
    {
      emoji: "🔍",
      title: t('landing.step1.title'),
      description: t('landing.step1.desc'),
      icon: MapPin,
    },
    {
      emoji: "📅",
      title: t('landing.step2.title'),
      description: t('landing.step2.desc'),
      icon: Calendar,
    },
    {
      emoji: "💊",
      title: t('landing.step3.title'),
      description: t('landing.step3.desc'),
      icon: Bell,
    },
  ];

  const services = [
    { icon: Stethoscope, title: t('landing.service.medical'), color: "text-primary" },
    { icon: Video, title: t('landing.service.telehealth'), color: "text-secondary" },
    { icon: FileText, title: t('landing.service.pharmacy'), color: "text-success" },
    { icon: TestTube, title: t('landing.service.lab'), color: "text-warning" },
    { icon: Building2, title: t('landing.service.hospital'), color: "text-destructive" },
    { icon: CreditCard, title: t('landing.service.insurance'), color: "text-accent" },
  ];
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-20 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">{t('landing.secure')}</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  {t('landing.hero.title')}
                  <span className="block text-primary mt-2">{t('landing.hero.titleHighlight')}</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  {t('landing.hero.subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register?type=patient" className="flex-1">
                  <Button size="lg" className="btn-mobile-xxl w-full text-lg">
                    👤 {t('landing.hero.patient')}
                  </Button>
                </Link>
                <Link to="/register?type=pro" className="flex-1">
                  <Button size="lg" variant="outline" className="btn-mobile-xxl w-full text-lg">
                    👨‍⚕️ {t('landing.hero.professional')}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                <Heart className="h-64 w-64 text-primary relative" fill="currentColor" strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 px-4 bg-card">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{t('landing.howItWorks')}</h2>
            <p className="text-lg text-muted-foreground">3 {t('landing.howItWorksSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.title} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="relative bg-background rounded-2xl p-8 border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                      {index + 1}
                    </div>
                    <span className="text-4xl">{step.emoji}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services disponibles */}
      <section className="py-20 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{t('landing.services')}</h2>
            <p className="text-lg text-muted-foreground">{t('landing.servicesSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="group bg-card rounded-xl p-6 border-2 hover:border-primary transition-all duration-300 hover:shadow-lg cursor-pointer"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4 group-hover:scale-110 transition-transform ${service.color}`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Votre assurance */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl p-8 md:p-12 border-2 shadow-xl">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">{t('landing.insurance.title')}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('landing.insurance.subtitle')}
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-8 py-8">
                <div className="text-center">
                  <div className="h-16 w-32 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-primary">CNAMGS</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-16 w-32 rounded-lg bg-secondary/10 flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-secondary">CNSS</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-16 w-32 rounded-lg bg-accent/10 flex items-center justify-center mb-2">
                    <span className="text-lg font-bold text-accent">Mutuelles</span>
                  </div>
                </div>
              </div>

              <Link to="/register?type=patient">
                <Button size="lg" className="btn-mobile-xxl">
                  {t('landing.insurance.create')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            {t('landing.cta.title')}
          </h2>
          <p className="text-lg opacity-90">
            {t('landing.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?type=patient">
              <Button size="lg" variant="secondary" className="btn-mobile-xxl w-full sm:w-auto">
                {t('landing.cta.patient')}
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="btn-mobile-xxl w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                {t('landing.cta.login')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" fill="currentColor" />
                <span className="text-lg font-bold">SANTE<span className="text-primary">.GA</span></span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('landing.footer.tagline')}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.about')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.mission')}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.team')}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.partners')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.support')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.helpCenter')}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.contact')}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.faq')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t('landing.footer.legal')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.terms')}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.cgu')}</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">{t('landing.footer.privacy')}</a></li>
              </ul>
            </div>
          </div>

          {/* Bouton Admin subtile */}
          <div className="border-t pt-6 pb-2 flex justify-center">
            <Link to="/superadmin">
              <button className="text-xs text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors duration-200 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>•</span>
              </button>
            </Link>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 {t('landing.footer.copyright')}</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">Facebook</a>
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
