import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EstablishmentStatistics } from "@/types/establishment";
import {
  Building2,
  Users,
  BedDouble,
  Activity,
  TrendingUp,
  Heart,
  Clock,
  MapPin
} from "lucide-react";

interface EstablishmentStatsCardsProps {
  statistics: EstablishmentStatistics;
  loading?: boolean;
}

export const EstablishmentStatsCards = ({ statistics, loading }: EstablishmentStatsCardsProps) => {
  const cards = [
    {
      title: "Total Établissements",
      value: statistics.totalCount,
      subtitle: "Structures actives",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Capacité Totale",
      value: statistics.totalBeds.toLocaleString(),
      subtitle: "Lits disponibles",
      icon: BedDouble,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Personnel Médical",
      value: (statistics.totalDoctors + statistics.totalNurses).toLocaleString(),
      subtitle: `${statistics.totalDoctors} médecins, ${statistics.totalNurses} infirmiers`,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Taux d'Occupation",
      value: `${statistics.avgOccupancyRate.toFixed(0)}%`,
      subtitle: "Moyenne nationale",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Consultations/Mois",
      value: `${Math.round(statistics.totalConsultationsMonthly / 1000)}k`,
      subtitle: "Toutes structures",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      title: "Urgences/Mois",
      value: `${Math.round(statistics.totalEmergenciesMonthly / 1000)}k`,
      subtitle: "Cas d'urgence",
      icon: Clock,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Satisfaction Patients",
      value: statistics.avgPatientSatisfaction.toFixed(1),
      subtitle: "Sur 5.0",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Provinces Couvertes",
      value: Object.keys(statistics.byProvince).length,
      subtitle: "Sur 9 provinces",
      icon: MapPin,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.subtitle}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
