import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, TestTube, CreditCard, Shield, Clock } from "lucide-react";
import { InfoCard } from "@/components/common/InfoCard";

const features = [
  {
    icon: Calendar,
    title: "Rendez-vous en ligne",
    description: "Prenez rendez-vous avec votre médecin en quelques clics",
  },
  {
    icon: FileText,
    title: "Ordonnances digitales",
    description: "Accédez à vos ordonnances depuis votre téléphone",
  },
  {
    icon: TestTube,
    title: "Résultats d'examens",
    description: "Consultez vos résultats médicaux en toute sécurité",
  },
  {
    icon: CreditCard,
    title: "Remboursements rapides",
    description: "Suivez vos demandes de remboursement facilement",
  },
  {
    icon: Shield,
    title: "Données sécurisées",
    description: "Vos informations médicales sont protégées",
  },
  {
    icon: Clock,
    title: "Disponible 24/7",
    description: "Accédez à vos services de santé à tout moment",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Votre santé digitale
              <span className="block text-primary mt-2">simplifiée au Gabon</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Gérez vos rendez-vous médicaux, ordonnances, résultats d'examens et remboursements en ligne, facilement et en toute sécurité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/register">
                <Button size="lg" className="btn-mobile-xxl w-full sm:w-auto">
                  Créer mon compte gratuit
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="btn-mobile-xxl w-full sm:w-auto">
                  Je me connecte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tout pour gérer votre santé
            </h2>
            <p className="text-lg text-muted-foreground">
              Des services simples et accessibles pour tous les Gabonais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <InfoCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                interactive
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Prêt à commencer ?
          </h2>
          <p className="text-lg text-muted-foreground">
            Rejoignez des milliers de Gabonais qui gèrent déjà leur santé en ligne
          </p>
          <Link to="/register">
            <Button size="lg" className="btn-mobile-xxl">
              Créer mon compte maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
