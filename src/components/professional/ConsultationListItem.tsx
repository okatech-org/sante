import { Pill, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ConsultationItem {
  id: number;
  date: string;
  time: string;
  patient: string;
  type: string;
  diagnosis: string;
  prescription: boolean;
  examens: string[];
  notes: string;
  nextVisit: string | null;
}

interface ConsultationListItemProps {
  consultation: ConsultationItem;
  onSelect: () => void;
}

export const ConsultationListItem = ({ consultation, onSelect }: ConsultationListItemProps) => {
  return (
    <div 
      className="p-4 rounded-xl bg-card/80 border border-border shadow-sm hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4 flex-1">
          <div className="flex flex-col items-center justify-center min-w-[80px]">
            <FileText className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="font-semibold text-sm">{consultation.time}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(consultation.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-semibold">{consultation.patient}</h4>
              <Badge variant="outline">{consultation.type}</Badge>
              {consultation.prescription && (
                <Badge className="bg-green-500/10 text-green-500">
                  <Pill className="h-3 w-3 mr-1" />
                  Ordonnance
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium text-foreground mb-1">{consultation.diagnosis}</p>
            <p className="text-sm text-muted-foreground">{consultation.notes}</p>
            {consultation.nextVisit && (
              <p className="text-xs text-muted-foreground mt-2">
                Prochain RDV: {new Date(consultation.nextVisit).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" className="ml-4">Voir détails</Button>
      </div>
    </div>
  );
};