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

const howItWorks = [
  {
    emoji: "🔍",
    title: "Trouvez votre prestataire",
    description: "Recherchez parmi des milliers de médecins, cliniques et pharmacies à Libreville et partout au Gabon",
    icon: MapPin,
  },
  {
    emoji: "📅",
    title: "Prenez rendez-vous en ligne",
    description: "Réservez votre consultation en quelques clics, 24h/24 et 7j/7",
    icon: Calendar,
  },
  {
    emoji: "💊",
    title: "Recevez vos ordonnances",
    description: "Accédez à vos ordonnances, résultats et documents médicaux depuis votre téléphone",
    icon: Bell,
  },
];

const services = [
  { icon: Stethoscope, title: "Consultation médicale", color: "text-primary" },
  { icon: Video, title: "Téléconsultation", color: "text-secondary" },
  { icon: FileText, title: "Pharmacies 24/7", color: "text-success" },
  { icon: TestTube, title: "Laboratoires", color: "text-warning" },
  { icon: Building2, title: "Hôpitaux & Cliniques", color: "text-destructive" },
  { icon: CreditCard, title: "Suivi CNAMGS/CNSS", color: "text-accent" },
];

export default function Landing() {
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
                <span className="text-sm font-medium text-success">100% Sécurisé et Gratuit</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  La santé de tous,
                  <span className="block text-primary mt-2">partout, tout le temps</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Plateforme e-santé du Gabon - Trouvez un médecin, prenez RDV, consultez vos résultats
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register?type=patient" className="flex-1">
                  <Button size="lg" className="btn-mobile-xxl w-full text-lg">
                    👤 Je suis Patient
                  </Button>
                </Link>
                <Link to="/register?type=pro" className="flex-1">
                  <Button size="lg" variant="outline" className="btn-mobile-xxl w-full text-lg">
                    👨‍⚕️ Je suis Professionnel
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
            <h2 className="text-3xl md:text-4xl font-bold">Comment ça marche ?</h2>
            <p className="text-lg text-muted-foreground">3 étapes simples pour gérer votre santé</p>
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
            <h2 className="text-3xl md:text-4xl font-bold">Services disponibles</h2>
            <p className="text-lg text-muted-foreground">Tout ce dont vous avez besoin pour votre santé</p>
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
              <h2 className="text-3xl md:text-4xl font-bold">Votre assurance santé</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Vérifiez vos droits et suivez vos remboursements en temps réel
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
                  Créer mon compte gratuit
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
            Prêt à prendre en main votre santé ?
          </h2>
          <p className="text-lg opacity-90">
            Rejoignez des milliers de Gabonais qui gèrent déjà leur santé en ligne
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?type=patient">
              <Button size="lg" variant="secondary" className="btn-mobile-xxl w-full sm:w-auto">
                Créer mon compte patient
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="btn-mobile-xxl w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Je me connecte
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
                Plateforme e-santé du Gabon pour un accès facilité aux soins
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">À propos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Notre mission</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">L'équipe</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Partenaires</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Confidentialité</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 SANTE.GA - Ministère de la Santé du Gabon</p>
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
