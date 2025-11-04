import { PharmacySearch } from "@/components/pharmacy/PharmacySearch";
import { Badge } from "@/components/ui/badge";
import { Pill, MapPin, Search } from "lucide-react";

export default function Pharmacies() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero */}
      <section className="pt-20 pb-8 md:pt-24 md:pb-10 px-4 sm:px-6 lg:px-8 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                <Pill className="h-3.5 w-3.5" />
                Structures Pharmacies
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Trouvez une pharmacie près de chez vous
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
                Recherchez les pharmacies au Gabon par ville, province, disponibilité 24/7 ou
                conventionnement CNAMGS. Accédez rapidement aux contacts et services.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  Recherche avancée
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Proche de moi
                </Badge>
                <Badge variant="outline">24/7</Badge>
                <Badge variant="outline">CNAMGS</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-4 md:py-8">
        <div className="max-w-7xl mx-auto">
          <PharmacySearch />
        </div>
      </section>
    </div>
  );
}


