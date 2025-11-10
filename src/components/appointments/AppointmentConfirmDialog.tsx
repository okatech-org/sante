import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, User, Phone, Mail, FileText, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

interface AppointmentConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  professionalId: string;
  professionalName: string;
  selectedDate: Date;
  selectedTime: string;
}

export function AppointmentConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  professionalId,
  professionalName,
  selectedDate,
  selectedTime
}: AppointmentConfirmDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: user?.email || "",
    appointmentType: "consultation",
    reason: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Vous devez être connecté pour prendre rendez-vous");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('appointments').insert({
        patient_id: user.id,
        professional_id: professionalId,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        duration_minutes: 30,
        status: 'scheduled',
        appointment_type: formData.appointmentType,
        reason: formData.reason,
        notes: formData.notes,
        patient_name: formData.patientName,
        patient_phone: formData.patientPhone,
        patient_email: formData.patientEmail
      });

      if (error) throw error;

      toast.success("Rendez-vous confirmé avec succès !");
      onConfirm();
    } catch (error: any) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      if (error.code === '23505') {
        toast.error("Ce créneau n'est plus disponible");
      } else {
        toast.error("Erreur lors de la confirmation du rendez-vous");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirmer votre rendez-vous</DialogTitle>
          <DialogDescription>
            Veuillez remplir les informations ci-dessous pour confirmer votre rendez-vous
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Résumé du RDV */}
          <div className="bg-primary/5 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span className="font-semibold">{professionalName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{selectedTime.substring(0, 5)} (30 minutes)</span>
            </div>
          </div>

          {/* Informations patient */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="patientName">Nom complet *</Label>
              <Input
                id="patientName"
                required
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="Votre nom complet"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="patientPhone">Téléphone *</Label>
                <Input
                  id="patientPhone"
                  required
                  type="tel"
                  value={formData.patientPhone}
                  onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                  placeholder="+241 XX XX XX XX"
                />
              </div>

              <div>
                <Label htmlFor="patientEmail">Email</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={formData.patientEmail}
                  onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="appointmentType">Type de consultation *</Label>
              <Select
                value={formData.appointmentType}
                onValueChange={(value) => setFormData({ ...formData, appointmentType: value })}
              >
                <SelectTrigger id="appointmentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="teleconsultation">Téléconsultation</SelectItem>
                  <SelectItem value="follow_up">Suivi</SelectItem>
                  <SelectItem value="emergency">Urgence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reason">Motif de la consultation *</Label>
              <Input
                id="reason"
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Ex: Consultation générale, contrôle, symptômes..."
              />
            </div>

            <div>
              <Label htmlFor="notes">Informations complémentaires</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Décrivez brièvement vos symptômes ou questions (optionnel)"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer le rendez-vous
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
