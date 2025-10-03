import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { Appointment } from "./AppointmentCard";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface CancelAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onConfirm: (reason: string, details?: string) => void;
}

export const CancelAppointmentModal = ({
  open,
  onClose,
  appointment,
  onConfirm,
}: CancelAppointmentModalProps) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  if (!appointment) return null;

  const getRefundInfo = () => {
    const now = new Date();
    const hoursUntil = (appointment.date.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntil > 24) {
      return { percentage: 100, amount: appointment.payment.amount };
    } else if (hoursUntil > 2) {
      return { percentage: 50, amount: Math.round(appointment.payment.amount * 0.5) };
    } else {
      return { percentage: 0, amount: 0 };
    }
  };

  const refundInfo = getRefundInfo();
  const timeUntil = () => {
    const now = new Date();
    const diff = appointment.date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 24) return `Dans ${hours} heures`;
    return `Dans ${days} jours`;
  };

  const handleConfirm = () => {
    onConfirm(reason, details);
    setReason("");
    setDetails("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle>Êtes-vous sûr de vouloir annuler ?</DialogTitle>
          </div>
          <DialogDescription>
            Cette action ne peut pas être annulée. Veuillez vérifier les informations ci-dessous.
          </DialogDescription>
        </DialogHeader>

        {/* Appointment Summary */}
        <div className="rounded-lg border p-4 space-y-3 bg-muted/50">
          <div>
            <p className="text-sm font-medium">RDV : {appointment.provider.name}</p>
            <p className="text-sm text-muted-foreground">
              {format(appointment.date, "EEEE dd MMMM, HH:mm", { locale: fr })}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Politique de remboursement :</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Annulation &gt; 24h : 100%</li>
              <li>• Annulation &lt; 24h : 50%</li>
              <li>• Annulation &lt; 2h : 0%</li>
            </ul>
          </div>

          <div className="pt-3 border-t">
            <p className="text-sm">
              <span className="font-medium">Votre annulation :</span> {timeUntil()}
            </p>
            <p className="text-sm font-semibold text-primary mt-1">
              → Remboursement : {refundInfo.amount.toLocaleString()} FCFA ({refundInfo.percentage}%)
            </p>
          </div>
        </div>

        {/* Cancellation Reason */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Motif d'annulation (optionnel)</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Sélectionnez un motif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Empêchement personnel</SelectItem>
                <SelectItem value="health">Problème de santé</SelectItem>
                <SelectItem value="wrong-date">Mauvaise date choisie</SelectItem>
                <SelectItem value="transport">Problème de transport</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reason === "other" && (
            <div className="space-y-2">
              <Label htmlFor="details">Précisez le motif</Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Décrivez brièvement la raison de votre annulation..."
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Non, garder mon RDV
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="flex-1"
          >
            Oui, annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
