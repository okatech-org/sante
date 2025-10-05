import { LucideIcon, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";

interface HealthOverviewCardProps {
  title: string;
  mainValue: string;
  subtitle?: string;
  location?: string;
  details?: string[];
  icon: LucideIcon;
  showProgress?: boolean;
  progressValue?: number;
}

export const HealthOverviewCard = ({
  title,
  mainValue,
  subtitle,
  location,
  details = [],
  icon: Icon,
  showProgress = false,
  progressValue = 0,
}: HealthOverviewCardProps) => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showProgress && progressRef.current) {
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.width = `${progressValue}%`;
        }
      }, 100);
    }
  }, [showProgress, progressValue]);

  return (
    <div className="p-6 rounded-xl bg-card/40 backdrop-blur-xl border border-border/30 shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2 text-foreground">{mainValue}</p>
          {subtitle && (
            <p className="text-sm mt-2 text-muted-foreground font-medium">{subtitle}</p>
          )}
          {details.map((detail, idx) => (
            <p key={idx} className="text-xs text-muted-foreground mt-1">
              {detail}
            </p>
          ))}
        </div>
        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
          <Icon className="w-7 h-7 text-primary" />
        </div>
      </div>
      
      {location && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 bg-muted/20 px-3 py-2 rounded-lg">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{location}</span>
        </div>
      )}

      {showProgress && (
        <div className="h-2.5 rounded-full overflow-hidden bg-muted/30 mt-4">
          <div
            ref={progressRef}
            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-primary to-secondary"
            style={{ width: '0%' }}
          />
        </div>
      )}
    </div>
  );
};