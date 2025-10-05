import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditMedicalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentData: {
    weight?: number;
    height?: number;
    bloodGroup?: string;
    cnamgsNumber?: string;
  };
}

export function EditMedicalInfoModal({ isOpen, onClose, userId, currentData }: EditMedicalInfoModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    weight: currentData.weight?.toString() || '',
    height: currentData.height?.toString() || '',
    bloodGroup: currentData.bloodGroup || '',
    cnamgsNumber: currentData.cnamgsNumber || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profile_change_requests')
        .insert({
          user_id: userId,
          change_type: 'medical_info',
          current_data: currentData,
          requested_data: formData,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Demande de modification envoyée", {
        description: "Un médecin examinera votre demande sous peu."
      });
      onClose();
    } catch (error) {
      console.error('Error submitting change request:', error);
      toast.error("Erreur lors de l'envoi de la demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier les informations médicales</DialogTitle>
          <DialogDescription>
            Vos modifications seront soumises pour validation médicale.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Taille (m)</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Groupe sanguin</Label>
            <Input
              id="bloodGroup"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              placeholder="Ex: O+, A-, B+..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnamgsNumber">N° CNAMGS</Label>
            <Input
              id="cnamgsNumber"
              value={formData.cnamgsNumber}
              onChange={(e) => setFormData({ ...formData, cnamgsNumber: e.target.value })}
              placeholder="GA..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Soumettre la demande
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}