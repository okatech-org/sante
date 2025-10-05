import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
}

export const StatCard = ({ label, value, icon: Icon, trend }: StatCardProps) => {
  return (
    <div className="rounded-xl backdrop-blur-xl p-5 text-center bg-card/40 border border-border/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] group">
      <div className="w-12 h-12 rounded-xl mx-auto mb-3 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
        <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
      </div>
      <p className="text-xs mb-2 text-muted-foreground font-medium">{label}</p>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{trend}</p>
    </div>
  );
};