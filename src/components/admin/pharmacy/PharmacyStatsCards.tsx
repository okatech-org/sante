import { Card } from '@/components/ui/card';
import { Building2, Clock, CheckCircle2, XCircle, AlertCircle, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PharmacyStats {
  total: number;
  en_attente: number;
  verifie: number;
  refuse: number;
  suspendu: number;
  actives_24_7: number;
  cnamgs: number;
}

interface PharmacyStatsCardsProps {
  stats: PharmacyStats;
  loading: boolean;
}

export function PharmacyStatsCards({ stats, loading }: PharmacyStatsCardsProps) {
  const cards = [
    {
      title: 'Total Pharmacies',
      value: stats.total,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'En attente',
      value: stats.en_attente,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Vérifiées',
      value: stats.verifie,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Refusées',
      value: stats.refuse,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Suspendues',
      value: stats.suspendu,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'CNAMGS',
      value: stats.cnamgs,
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
