import { Pill, QrCode, Download, CheckCircle } from "lucide-react";

interface PrescriptionsStatsProps {
  total: number | string;
  active: number | string;
  delivered: number | string;
  cnamgsRate: string;
}

export const PrescriptionsStats = ({ total, active, delivered, cnamgsRate }: PrescriptionsStatsProps) => {
  const items = [
    { label: "Ce mois", value: total, icon: Pill, color: "#00d4ff" },
    { label: "Actives", value: active, icon: CheckCircle, color: "#00c389" },
    { label: "Délivrées", value: delivered, icon: QrCode, color: "#0088ff" },
    { label: "Taux CNAMGS", value: cnamgsRate, icon: Download, color: "#ffaa00" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {items.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="text-center">
            <div
              className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: stat.color }} />
            </div>
            <p className="text-[10px] sm:text-xs mb-1 text-muted-foreground font-medium">{stat.label}</p>
            <p className="text-base sm:text-2xl font-bold text-foreground mb-0.5">{stat.value}</p>
            <p className="text-[9px] sm:text-xs text-transparent">•</p>
          </div>
        );
      })}
    </div>
  );
};