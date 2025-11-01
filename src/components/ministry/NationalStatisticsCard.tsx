import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Stethoscope, Video, TrendingUp } from "lucide-react";
import { NationalStatistics } from "@/types/ministry";

interface NationalStatisticsCardProps {
  statistics: NationalStatistics;
}

export const NationalStatisticsCard = ({ statistics }: NationalStatisticsCardProps) => {
  const stats = [
    {
      title: "Population Couverte CNAMGS",
      value: `${(statistics.population_couverte_cnamgs / 1000000).toFixed(1)}M`,
      subtitle: `Taux: ${statistics.taux_couverture}`,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Établissements Opérationnels",
      value: statistics.etablissements_operationnels,
      subtitle: "Hôpitaux et centres",
      icon: Building2,
      color: "text-green-600"
    },
    {
      title: "Médecins Actifs",
      value: statistics.professionnels_actifs.medecins.toLocaleString(),
      subtitle: `${statistics.professionnels_actifs.infirmiers.toLocaleString()} infirmiers`,
      icon: Stethoscope,
      color: "text-purple-600"
    },
    {
      title: "Consultations Mensuelles",
      value: `${Math.round(statistics.consultations_mensuelles / 1000)}k`,
      subtitle: `${Math.round(statistics.teleconsultations_mensuelles / 1000)}k téléconsultations`,
      icon: Video,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.subtitle}
            </p>
            <div className="flex items-center mt-2 text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              En progression
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

