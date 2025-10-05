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
      className="group rounded-xl backdrop-blur-xl p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-card/40 border border-border/30 hover:bg-card/60 shadow-xl hover:shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
            <Icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{title}</h3>
            {badge && (
              <span className="inline-block mt-1.5 px-3 py-1 text-xs rounded-full bg-accent/20 text-accent border border-accent/30">
                {badge}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};