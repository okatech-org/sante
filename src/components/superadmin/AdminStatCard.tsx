import { LucideIcon } from "lucide-react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend: string;
  color: string;
  onClick?: () => void;
}

export const AdminStatCard = ({ label, value, icon: Icon, trend, color, onClick }: AdminStatCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={`rounded-xl backdrop-blur-xl p-4 sm:p-6 text-center bg-card/80 border border-border shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-5 h-5 sm:w-7 sm:h-7" style={{ color }} />
      </div>
      <p className="text-xs sm:text-sm mb-2 text-muted-foreground font-medium">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-[10px] sm:text-xs text-muted-foreground">{trend}</p>
    </div>
  );
};
