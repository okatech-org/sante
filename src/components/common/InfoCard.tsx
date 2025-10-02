import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export const InfoCard = ({
  title,
  description,
  icon: Icon,
  iconColor = "text-primary",
  children,
  className,
  interactive = false,
}: InfoCardProps) => {
  return (
    <Card className={cn(interactive && "card-interactive cursor-pointer", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm">{description}</CardDescription>
            )}
          </div>
          {Icon && (
            <div className={cn("rounded-lg bg-primary/10 p-2", iconColor)}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
};
