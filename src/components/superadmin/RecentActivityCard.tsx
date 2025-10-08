import { LucideIcon } from "lucide-react";

interface RecentActivityCardProps {
  time: string;
  event: string;
  user: string;
  icon: LucideIcon;
  color: string;
}

export const RecentActivityCard = ({ time, event, user, icon: Icon, color }: RecentActivityCardProps) => {
  return (
    <div className="p-3 sm:p-4 rounded-xl hover:scale-[1.02] transition-all cursor-pointer bg-card/80 hover:bg-card/90 border border-border shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-card-foreground mb-1">{event}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">{user}</p>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground flex-shrink-0">{time}</p>
      </div>
    </div>
  );
};
