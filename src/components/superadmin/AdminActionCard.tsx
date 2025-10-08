import { LucideIcon, ChevronRight } from "lucide-react";

interface AdminActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export const AdminActionCard = ({ title, description, icon: Icon, color, onClick }: AdminActionCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="group rounded-xl backdrop-blur-xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-card/80 border border-border hover:bg-card/90 shadow-xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color }} />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground text-sm sm:text-lg mb-1">{title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
      </div>
    </div>
  );
};
