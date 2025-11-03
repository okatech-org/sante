import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PharmacyActionDialogProps {
  open: boolean;
  type: 'approve' | 'reject' | 'suspend' | 'reactivate' | null;
  pharmacyName: string;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
}

export function PharmacyActionDialog({
  open,
  type,
  pharmacyName,
  onClose,
  onConfirm,
}: PharmacyActionDialogProps) {
  const [reason, setReason] = useState('');

  const needsReason = type === 'reject' || type === 'suspend';

  const config = {
    approve: {
      title: 'Approuver la pharmacie',
      description: `Êtes-vous sûr de vouloir approuver "${pharmacyName}" ? Elle sera visible sur la plateforme.`,
      confirmText: 'Approuver',
      variant: 'default' as const,
    },
    reject: {
      title: 'Refuser la pharmacie',
      description: `Veuillez indiquer le motif du refus de "${pharmacyName}".`,
      confirmText: 'Refuser',
      variant: 'destructive' as const,
    },
    suspend: {
      title: 'Suspendre la pharmacie',
      description: `Veuillez indiquer le motif de suspension de "${pharmacyName}". Elle ne sera plus visible sur la plateforme.`,
      confirmText: 'Suspendre',
      variant: 'destructive' as const,
    },
    reactivate: {
      title: 'Réactiver la pharmacie',
      description: `Êtes-vous sûr de vouloir réactiver "${pharmacyName}" ? Elle sera à nouveau visible sur la plateforme.`,
      confirmText: 'Réactiver',
      variant: 'default' as const,
    },
  };

  if (!type) return null;

  const currentConfig = config[type];

  const handleConfirm = () => {
    if (needsReason && !reason.trim()) return;
    onConfirm(reason || undefined);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{currentConfig.title}</AlertDialogTitle>
          <AlertDialogDescription>{currentConfig.description}</AlertDialogDescription>
        </AlertDialogHeader>

        {needsReason && (
          <div className="space-y-2">
            <Label htmlFor="reason">Motif *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Indiquez le motif..."
              rows={4}
              required
            />
          </div>
        )}

        <AlertDialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant={currentConfig.variant}
            onClick={handleConfirm}
            disabled={needsReason && !reason.trim()}
          >
            {currentConfig.confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
