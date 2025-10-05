import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
}

export const StatCard = ({ label, value, icon: Icon, trend }: StatCardProps) => {
  return (
    <div className="rounded-xl backdrop-blur-lg p-4 text-center bg-card/70 border border-border/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <Icon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
      <p className="text-xs mb-2 text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs mt-1 text-muted-foreground">{trend}</p>
    </div>
  );
};