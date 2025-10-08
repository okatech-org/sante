import { Mail, Star, Archive, Send } from "lucide-react";

interface MessagesStatsProps {
  unread: number | string;
  today: number | string;
  starred: number | string;
  archived: number | string;
}

export const MessagesStats = ({ unread, today, starred, archived }: MessagesStatsProps) => {
  const items = [
    { label: "Non lus", value: unread, icon: Mail, color: "#00d4ff" },
    { label: "Reçus aujourd'hui", value: today, icon: Send, color: "#0088ff" },
    { label: "Favoris", value: starred, icon: Star, color: "#ffaa00" },
    { label: "Archives", value: archived, icon: Archive, color: "#8b8b8b" },
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