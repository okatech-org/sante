import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "info";
  children: React.ReactNode;
  className?: string;
}

const statusStyles = {
  success: "bg-success/10 text-success border-success/20 hover:bg-success/20",
  warning: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
  error: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
  info: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
};

export const StatusBadge = ({ status, children, className }: StatusBadgeProps) => {
  return (
    <Badge variant="outline" className={cn(statusStyles[status], "font-medium", className)}>
      {children}
    </Badge>
  );
};
