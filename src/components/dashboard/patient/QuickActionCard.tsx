import { LucideIcon, ChevronRight } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  badge?: string;
  onClick?: () => void;
}

export const QuickActionCard = ({ icon: Icon, title, badge, onClick }: QuickActionCardProps) => {
  return (
    <div
      onClick={onClick}
      className="rounded-xl backdrop-blur-lg p-5 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-card/70 border border-border/40 hover:bg-card/90 shadow-md hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted/50">
            <Icon className="w-6 h-6 text-foreground/70" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            {badge && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                {badge}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </div>
  );
};