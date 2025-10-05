import { LucideIcon } from "lucide-react";

interface MedicalDocumentCardProps {
  title: string;
  date: string;
  type: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export const MedicalDocumentCard = ({ title, date, type, icon: Icon, onClick }: MedicalDocumentCardProps) => {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-lg hover:scale-[1.02] transition-all cursor-pointer bg-muted/30 hover:bg-muted/50"
    >
      <Icon className="w-6 h-6 mb-3 text-muted-foreground" />
      <p className="text-sm font-medium mb-1 text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{date}</p>
      <p className="text-xs mt-1 text-muted-foreground">{type}</p>
    </div>
  );
};