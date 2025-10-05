import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, FileText } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Consultation {
  id: string;
  consultation_date: string;
  consultation_type: string;
  doctor_name: string;
  reason: string;
  diagnosis?: string;
  notes?: string;
  documents?: any;
}

interface ConsultationDetailsModalProps {
  consultation: Consultation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsultationDetailsModal({
  consultation,
  open,
  onOpenChange,
}: ConsultationDetailsModalProps) {
  if (!consultation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de la Consultation</DialogTitle>
          <DialogDescription>
            Consultation du {format(new Date(consultation.consultation_date), "dd MMMM yyyy", { locale: fr })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(new Date(consultation.consultation_date), "dd/MM/yyyy", { locale: fr })}
              </span>
            </div>
            <Badge variant="outline">{consultation.consultation_type}</Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Praticien</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {consultation.doctor_name}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Motif de consultation</h3>
              </div>
              <p className="text-sm pl-6">{consultation.reason}</p>
            </div>

            {consultation.diagnosis && (
              <div>
                <h3 className="font-semibold mb-2">Diagnostic</h3>
                <p className="text-sm text-muted-foreground pl-6">
                  {consultation.diagnosis}
                </p>
              </div>
            )}

            {consultation.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground pl-6 whitespace-pre-wrap">
                  {consultation.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
