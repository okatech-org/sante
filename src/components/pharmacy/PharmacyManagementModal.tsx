// ============================================
// MODAL: Gestion Établissement Pharmacie
// Date: 3 novembre 2025
// Fonctionnel et complet
// ============================================

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Building2, 
  Clock, 
  Package, 
  Users, 
  CreditCard,
  Settings,
  Image as ImageIcon,
  Info
} from 'lucide-react';
import { usePharmacy, useUpdatePharmacy } from '@/hooks/usePharmacy';
import { usePharmacyEmployees } from '@/hooks/usePharmacyProfessionals';
import { PharmacyGeneralInfoForm } from './management/PharmacyGeneralInfoForm';
import { PharmacyHoursManager } from './management/PharmacyHoursManager';
import { PharmacyServicesManager } from './management/PharmacyServicesManager';
import { PharmacyTeamManager } from './management/PharmacyTeamManager';
import { PharmacyPaymentManager } from './management/PharmacyPaymentManager';
import { PharmacyMediaManager } from './management/PharmacyMediaManager';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PharmacyManagementModalProps {
  pharmacyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PharmacyManagementModal({
  pharmacyId,
  open,
  onOpenChange,
}: PharmacyManagementModalProps) {
  const [activeTab, setActiveTab] = useState('general');
  const { data: pharmacy, isLoading } = usePharmacy(pharmacyId);
  const { data: employees } = usePharmacyEmployees(pharmacyId);
  const { mutate: updatePharmacy } = useUpdatePharmacy();

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!pharmacy) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Gestion de l'Établissement
          </DialogTitle>
          <DialogDescription>
            {pharmacy.nom_commercial} • {pharmacy.code_pharmacie}
          </DialogDescription>
        </DialogHeader>

        {pharmacy.statut_verification !== 'verifie' && (
          <div className="px-6">
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Cette pharmacie est en attente de vérification. Certaines modifications peuvent être limitées.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6 border-b">
            <TabsList className="w-full grid grid-cols-6 h-auto p-1">
              <TabsTrigger value="general" className="flex items-center gap-2 py-2.5">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Général</span>
              </TabsTrigger>
              <TabsTrigger value="hours" className="flex items-center gap-2 py-2.5">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Horaires</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2 py-2.5">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Services</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2 py-2.5">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Paiement</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-2 py-2.5">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Médias</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2 py-2.5">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Équipe ({employees?.length || 0})</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[60vh]">
            <div className="px-6 py-6">
              <TabsContent value="general" className="mt-0">
                <PharmacyGeneralInfoForm 
                  pharmacy={pharmacy} 
                  onUpdate={updatePharmacy}
                />
              </TabsContent>

              <TabsContent value="hours" className="mt-0">
                <PharmacyHoursManager 
                  pharmacy={pharmacy} 
                  onUpdate={updatePharmacy}
                />
              </TabsContent>

              <TabsContent value="services" className="mt-0">
                <PharmacyServicesManager 
                  pharmacy={pharmacy} 
                  onUpdate={updatePharmacy}
                />
              </TabsContent>

              <TabsContent value="payment" className="mt-0">
                <PharmacyPaymentManager 
                  pharmacy={pharmacy} 
                  onUpdate={updatePharmacy}
                />
              </TabsContent>

              <TabsContent value="media" className="mt-0">
                <PharmacyMediaManager 
                  pharmacy={pharmacy} 
                  onUpdate={updatePharmacy}
                />
              </TabsContent>

              <TabsContent value="team" className="mt-0">
                <PharmacyTeamManager 
                  pharmacyId={pharmacyId}
                  pharmacy={pharmacy}
                  employees={employees || []}
                />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default PharmacyManagementModal;

