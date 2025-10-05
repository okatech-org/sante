import { LucideIcon, ChevronRight } from "lucide-react";

interface ReminderCardProps {
  time: string;
  event: string;
  location: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export const ReminderCard = ({ time, event, location, icon: Icon, onClick }: ReminderCardProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-lg hover:scale-[1.01] transition-all cursor-pointer bg-muted/30 hover:bg-muted/50"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted/50">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{event}</p>
          <p className="text-xs text-muted-foreground">
            {time} • {location}
          </p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </div>
  );
};