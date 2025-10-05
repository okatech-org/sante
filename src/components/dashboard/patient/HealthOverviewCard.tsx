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
    <div className="p-5 rounded-xl bg-muted/30 backdrop-blur-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{mainValue}</p>
          {subtitle && (
            <p className="text-xs mt-1 text-muted-foreground">{subtitle}</p>
          )}
          {details.map((detail, idx) => (
            <p key={idx} className="text-xs text-muted-foreground">
              {detail}
            </p>
          ))}
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted/50">
          <Icon className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
      
      {location && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{location}</span>
        </div>
      )}

      {showProgress && (
        <div className="h-2 rounded-full overflow-hidden bg-muted/50 mt-4">
          <div
            ref={progressRef}
            className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-foreground/60 to-foreground/80"
            style={{ width: '0%' }}
          />
        </div>
      )}
    </div>
  );
};