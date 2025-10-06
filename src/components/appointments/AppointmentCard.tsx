import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  MapPin, 
  Phone, 
  Video, 
  Calendar,
  FileText,
  X,
  Edit,
  CreditCard,
  Navigation,
  Pill,
  FileCheck,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

export interface Appointment {
  id: string;
  date: Date;
  timeSlot: string;
  type: "consultation" | "telemedicine" | "exam";
  status: "upcoming" | "past" | "cancelled";
  provider: {
    name: string;
    specialty: string;
    photo?: string;
  };
  reason: string;
  location?: string;
  payment: {
    status: "paid" | "unpaid";
    amount: number;
    method?: string;
  };
  documents?: {
    type: "prescription" | "report" | "results";
    label: string;
  }[];
  prescribedBy?: string;
  instructions?: string;
  cancellation?: {
    date: Date;
    by: "patient" | "provider";
    refund?: number;
    refundStatus?: "pending" | "completed";
  };
}

interface AppointmentCardProps {
  appointment: Appointment;
  variant?: "full" | "compact";
  onViewDetails?: () => void;
  onCancel?: () => void;
  onModify?: () => void;
  onPay?: () => void;
  onCall?: () => void;
  onGetDirections?: () => void;
}

export const AppointmentCard = ({
  appointment,
  variant = "full",
  onViewDetails,
  onCancel,
  onModify,
  onPay,
  onCall,
  onGetDirections,
}: AppointmentCardProps) => {
  const getTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 0) return null;
    if (hours < 2) return `Dans ${hours}h`;
    if (hours < 24) return `Dans ${hours} heures`;
    return `Dans ${days} jours`;
  };

  const isToday = format(appointment.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const isSoon = appointment.date.getTime() - new Date().getTime() < 2 * 60 * 60 * 1000;
  const timeUntil = getTimeUntil(appointment.date);

  const getTypeIcon = () => {
    switch (appointment.type) {
      case "telemedicine":
        return <Video className="h-5 w-5" />;
      case "exam":
        return <FileCheck className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (appointment.type) {
      case "telemedicine":
        return "TÉLÉCONSULTATION";
      case "exam":
        return "EXAMEN";
      default:
        return "CONSULTATION";
    }
  };

  if (variant === "compact") {
    return (
      <div className="p-5 rounded-xl bg-card border border-border hover:shadow-md transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {appointment.status === "past" && (
                <CheckCircle2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
              )}
              {appointment.status === "cancelled" && (
                <X className="h-4 w-4 text-pink-600 dark:text-pink-400 flex-shrink-0" />
              )}
              <p className="font-medium truncate text-foreground">
                {format(appointment.date, "dd/MM", { locale: fr })} - {appointment.timeSlot.split(" - ")[0]} | {appointment.provider.name}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {getTypeLabel()} | {appointment.provider.specialty}
            </p>
            {appointment.cancellation && (
              <p className="text-xs text-muted-foreground mt-1">
                Annulé le {format(appointment.cancellation.date, "dd/MM", { locale: fr })} ({appointment.cancellation.by === "patient" ? "vous" : "praticien"})
                {appointment.cancellation.refund && (
                  <span className="block">
                    Remboursement : {appointment.cancellation.refund.toLocaleString()} FCFA ({appointment.cancellation.refundStatus === "completed" ? "Remboursé" : "En cours"})
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {appointment.documents && appointment.documents.length > 0 && (
              <Button variant="outline" size="sm" onClick={onViewDetails}>
                <FileText className="h-4 w-4" />
                {appointment.documents.length}
              </Button>
            )}
            {onViewDetails && (
              <Button variant="ghost" size="sm" onClick={onViewDetails}>
                Détails
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-6 rounded-xl bg-card border border-border hover:shadow-md transition-all",
      isSoon && appointment.status === "upcoming" && "border-cyan-400 dark:border-cyan-500 shadow-lg"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              appointment.type === "telemedicine" && "bg-cyan-100 dark:bg-cyan-950/30",
              appointment.type === "exam" && "bg-amber-100 dark:bg-amber-950/30",
              appointment.type === "consultation" && "bg-blue-100 dark:bg-blue-950/30"
            )}
          >
            <div className={cn(
              appointment.type === "telemedicine" && "text-cyan-600 dark:text-cyan-400",
              appointment.type === "exam" && "text-amber-600 dark:text-amber-400",
              appointment.type === "consultation" && "text-blue-600 dark:text-blue-400"
            )}>
              {getTypeIcon()}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {format(appointment.date, "EEEE dd MMMM yyyy", { locale: fr })}
            </p>
            <p className="font-semibold text-lg text-foreground">{appointment.timeSlot}</p>
            {appointment.type === "telemedicine" && (
              <Badge variant="outline" className="mt-1 bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-800">
                <Video className="h-3 w-3 mr-1" />
                {getTypeLabel()}
              </Badge>
            )}
          </div>
        </div>
        {isToday && appointment.status === "upcoming" && (
          <Badge className="bg-pink-500 text-white animate-pulse">
            AUJOURD'HUI
          </Badge>
        )}
        {isSoon && !isToday && appointment.status === "upcoming" && (
          <Badge className="bg-pink-50 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400">
            BIENTÔT
          </Badge>
        )}
      </div>

      {/* Provider Info */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-1 flex items-center gap-2 text-foreground">
          👨‍⚕️ {appointment.provider.name}
        </h3>
        <p className="text-muted-foreground ml-6">{appointment.provider.specialty}</p>
      </div>

      {/* Reason */}
      <div className="mb-4 flex items-start gap-2">
        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
        <p className="text-sm text-foreground">{appointment.reason}</p>
      </div>

      {/* Location or Telemedicine */}
      {appointment.location && appointment.type !== "telemedicine" && (
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-foreground">{appointment.location}</p>
              {onGetDirections && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 mt-1"
                  onClick={onGetDirections}
                >
                  🗺️ Voir itinéraire
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prescribed By (for exams) */}
      {appointment.prescribedBy && (
        <div className="mb-4 flex items-start gap-2">
          <Pill className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p className="text-sm text-foreground">Prescrit par : {appointment.prescribedBy}</p>
        </div>
      )}

      {/* Instructions */}
      {appointment.instructions && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">{appointment.instructions}</p>
        </div>
      )}

      {/* Payment Status */}
      <div className="mb-4">
        {appointment.payment.status === "paid" ? (
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">
              Payé : {appointment.payment.amount.toLocaleString()} FCFA
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              À payer : {appointment.payment.amount.toLocaleString()} FCFA
            </span>
            {appointment.payment.method && (
              <span className="text-xs text-muted-foreground">
                (Paiement sur place sélectionné)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Time Until */}
      {timeUntil && appointment.status === "upcoming" && (
        <div className={cn(
          "mb-4 flex items-center gap-2 p-2 rounded-lg",
          isSoon ? "bg-pink-50 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400" : "bg-muted text-foreground"
        )}>
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">{timeUntil}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        {appointment.status === "upcoming" && (
          <>
            {appointment.type === "telemedicine" && isSoon && (
              <Button size="sm" className="flex-1 sm:flex-none">
                <Video className="h-4 w-4 mr-2" />
                Rejoindre
              </Button>
            )}
            {onCall && appointment.type !== "telemedicine" && (
              <Button variant="outline" size="sm" onClick={onCall}>
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
            )}
            {onGetDirections && appointment.type !== "telemedicine" && (
              <Button variant="outline" size="sm" onClick={onGetDirections}>
                <Navigation className="h-4 w-4 mr-2" />
                Itinéraire
              </Button>
            )}
            {appointment.payment.status === "unpaid" && onPay && (
              <Button size="sm" onClick={onPay}>
                <CreditCard className="h-4 w-4 mr-2" />
                Payer
              </Button>
            )}
            {onModify && (
              <Button variant="outline" size="sm" onClick={onModify}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            {onCancel && (
              <Button variant="outline" size="sm" onClick={onCancel} className="text-destructive hover:text-destructive">
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            )}
          </>
        )}
        {appointment.status === "past" && appointment.documents && (
          <>
            {appointment.documents.map((doc, idx) => (
              <Button key={idx} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                {doc.label}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
