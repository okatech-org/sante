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
  id: number | string;
  date?: string;
  time?: string;
  patient?: string;
  type?: string;
  diagnosis?: string;
  prescription?: boolean;
  examens?: string[];
  notes?: string;
  nextVisit?: string | null;
  consultation_date?: string;
  consultation_type?: string;
  doctor_name?: string;
  reason?: string;
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

  const consultationDate = consultation.consultation_date || consultation.date;
  const consultationType = consultation.consultation_type || consultation.type;
  const doctorName = consultation.doctor_name || "Praticien";
  const patientName = consultation.patient;
  const reason = consultation.reason || "Consultation";

  if (!consultationDate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de la Consultation</DialogTitle>
          <DialogDescription>
            Consultation du {format(new Date(consultationDate), "dd MMMM yyyy", { locale: fr })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(new Date(consultationDate), "dd/MM/yyyy", { locale: fr })}
                {consultation.time && ` à ${consultation.time}`}
              </span>
            </div>
            <Badge variant="outline">{consultationType}</Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            {patientName && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Patient</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {patientName}
                </p>
              </div>
            )}

            {doctorName && !patientName && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Praticien</h3>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {doctorName}
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Motif de consultation</h3>
              </div>
              <p className="text-sm pl-6">{reason}</p>
            </div>

            {consultation.diagnosis && (
              <div>
                <h3 className="font-semibold mb-2">Diagnostic</h3>
                <p className="text-sm text-muted-foreground pl-6">
                  {consultation.diagnosis}
                </p>
              </div>
            )}

            {consultation.examens && consultation.examens.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Examens prescrits</h3>
                <ul className="text-sm text-muted-foreground pl-6 list-disc list-inside">
                  {consultation.examens.map((exam, idx) => (
                    <li key={idx}>{exam}</li>
                  ))}
                </ul>
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

            {consultation.nextVisit && (
              <div>
                <h3 className="font-semibold mb-2">Prochain rendez-vous</h3>
                <p className="text-sm text-muted-foreground pl-6">
                  {format(new Date(consultation.nextVisit), "dd MMMM yyyy", { locale: fr })}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
