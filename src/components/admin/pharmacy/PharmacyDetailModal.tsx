import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePharmacyActions } from '@/hooks/usePharmacyManagement';
import { useOfflineAuth } from '@/contexts/OfflineAuthContext';
import { PharmacyActionDialog } from './PharmacyActionDialog';
import { 
  MapPin, Phone, Mail, Clock, Shield, CreditCard, 
  Building2, Users, CheckCircle, XCircle, Ban, RefreshCw 
} from 'lucide-react';
import type { Pharmacie } from '@/types/pharmacy';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';

interface PharmacyDetailModalProps {
  pharmacy: Pharmacie;
  open: boolean;
  onClose: () => void;
}

export function PharmacyDetailModal({ pharmacy, open, onClose }: PharmacyDetailModalProps) {
  const { user } = useOfflineAuth();
  const { approvePharmacy, rejectPharmacy, suspendPharmacy, reactivatePharmacy } = usePharmacyActions();
  const [actionDialog, setActionDialog] = useState<{
    type: 'approve' | 'reject' | 'suspend' | 'reactivate' | null;
    open: boolean;
  }>({ type: null, open: false });

  const handleAction = async (reason?: string) => {
    if (!user?.id || !actionDialog.type) return;

    let success = false;
    switch (actionDialog.type) {
      case 'approve':
        success = await approvePharmacy(pharmacy.id, user.id);
        break;
      case 'reject':
        if (reason) success = await rejectPharmacy(pharmacy.id, reason, user.id);
        break;
      case 'suspend':
        if (reason) success = await suspendPharmacy(pharmacy.id, reason, user.id);
        break;
      case 'reactivate':
        success = await reactivatePharmacy(pharmacy.id, user.id);
        break;
    }

    if (success) {
      setActionDialog({ type: null, open: false });
      onClose();
    }
  };

  const getStatusBadge = () => {
    const config = {
      en_attente: { label: 'En attente', className: 'bg-orange-100 text-orange-800' },
      verifie: { label: 'Vérifiée', className: 'bg-green-100 text-green-800' },
      refuse: { label: 'Refusée', className: 'bg-red-100 text-red-800' },
      suspendu: { label: 'Suspendue', className: 'bg-yellow-100 text-yellow-800' },
    };
    const status = config[pharmacy.statut_verification];
    return <Badge className={status.className}>{status.label}</Badge>;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl">{pharmacy.nom_commercial}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Code: {pharmacy.code_pharmacie}
                </p>
              </div>
              {getStatusBadge()}
            </div>
          </DialogHeader>

          <Tabs defaultValue="infos" className="mt-4">
            <TabsList>
              <TabsTrigger value="infos">Informations</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="horaires">Horaires</TabsTrigger>
              <TabsTrigger value="equipements">Équipements</TabsTrigger>
            </TabsList>

            <TabsContent value="infos" className="space-y-6 mt-4">
              {/* Localisation */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Localisation
                </h3>
                <div className="space-y-2 text-sm">
                  <p>{pharmacy.adresse_complete}</p>
                  {pharmacy.quartier && <p>Quartier: {pharmacy.quartier}</p>}
                  <p>{pharmacy.ville}, {pharmacy.province}</p>
                  {pharmacy.reperes_geographiques && (
                    <p className="text-muted-foreground">{pharmacy.reperes_geographiques}</p>
                  )}
                  <p className="text-muted-foreground">
                    Coordonnées: {pharmacy.latitude}, {pharmacy.longitude}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Contact */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact
                </h3>
                <div className="space-y-2 text-sm">
                  <p>Tél. principal: {pharmacy.telephone_principal}</p>
                  {pharmacy.telephone_secondaire && (
                    <p>Tél. secondaire: {pharmacy.telephone_secondaire}</p>
                  )}
                  {pharmacy.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {pharmacy.email}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Informations administratives */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Informations administratives
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type de structure</p>
                    <p className="font-medium capitalize">{pharmacy.type_structure.replace('_', ' ')}</p>
                  </div>
                  {pharmacy.numero_autorisation_ouverture && (
                    <div>
                      <p className="text-muted-foreground">N° autorisation</p>
                      <p className="font-medium">{pharmacy.numero_autorisation_ouverture}</p>
                    </div>
                  )}
                  {pharmacy.numero_inscription_onpg && (
                    <div>
                      <p className="text-muted-foreground">N° ONPG</p>
                      <p className="font-medium">{pharmacy.numero_inscription_onpg}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Statut ONPG</p>
                    <p className="font-medium capitalize">{pharmacy.statut_onpg}</p>
                  </div>
                </div>
              </div>

              {pharmacy.motif_refus && (
                <>
                  <Separator />
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2">Motif de refus/suspension</h4>
                    <p className="text-sm text-red-800">{pharmacy.motif_refus}</p>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="services" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold mb-3">Services disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {pharmacy.services_disponibles.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Modes de paiement
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pharmacy.modes_paiement.map((mode) => (
                    <Badge key={mode} variant="outline">
                      {mode.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
                {pharmacy.mobile_money_providers && pharmacy.mobile_money_providers.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">Opérateurs Mobile Money:</p>
                    <div className="flex flex-wrap gap-2">
                      {pharmacy.mobile_money_providers.map((provider) => (
                        <Badge key={provider} variant="secondary" className="text-xs">
                          {provider.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Assurances
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={pharmacy.conventionnement_cnamgs ? 'default' : 'secondary'}>
                      CNAMGS: {pharmacy.conventionnement_cnamgs ? 'Oui' : 'Non'}
                    </Badge>
                    {pharmacy.numero_convention_cnamgs && (
                      <span className="text-sm text-muted-foreground">
                        ({pharmacy.numero_convention_cnamgs})
                      </span>
                    )}
                  </div>
                  {pharmacy.autres_assurances_acceptees && pharmacy.autres_assurances_acceptees.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Autres assurances:</p>
                      <div className="flex flex-wrap gap-2">
                        {pharmacy.autres_assurances_acceptees.map((assurance, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {assurance}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="horaires" className="mt-4">
              <div className="space-y-4">
                {pharmacy.ouvert_24_7 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-lg font-semibold">Ouvert 24h/24, 7j/7</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(pharmacy.horaires).map(([jour, horaire]) => (
                      <div key={jour} className="flex items-center justify-between py-2 border-b">
                        <span className="font-medium capitalize">{jour}</span>
                        {horaire.ouvert ? (
                          <div className="flex gap-2">
                            {horaire.horaires.map((plage, i) => (
                              <Badge key={i} variant="secondary">
                                {plage.debut} - {plage.fin}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="outline">Fermé</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="equipements" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${pharmacy.dispose_chambre_froide ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                  <p className="font-medium">Chambre froide</p>
                  <p className="text-sm text-muted-foreground">
                    {pharmacy.dispose_chambre_froide ? 'Disponible' : 'Non disponible'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg border ${pharmacy.dispose_armoire_securisee ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                  <p className="font-medium">Armoire sécurisée</p>
                  <p className="text-sm text-muted-foreground">
                    {pharmacy.dispose_armoire_securisee ? 'Disponible' : 'Non disponible'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg border ${pharmacy.dispose_balance_electronique ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                  <p className="font-medium">Balance électronique</p>
                  <p className="text-sm text-muted-foreground">
                    {pharmacy.dispose_balance_electronique ? 'Disponible' : 'Non disponible'}
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-gray-50">
                  <p className="font-medium">Employés</p>
                  <p className="text-2xl font-bold">{pharmacy.nombre_employes}</p>
                </div>
                {pharmacy.surface_m2 && (
                  <div className="p-4 rounded-lg border bg-gray-50">
                    <p className="font-medium">Surface</p>
                    <p className="text-2xl font-bold">{pharmacy.surface_m2} m²</p>
                  </div>
                )}
                {pharmacy.capacite_stockage_medicaments && (
                  <div className="p-4 rounded-lg border bg-gray-50">
                    <p className="font-medium">Capacité stockage</p>
                    <p className="text-2xl font-bold">{pharmacy.capacite_stockage_medicaments}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Créée le {format(new Date(pharmacy.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
            </div>
            <div className="flex gap-2">
              {pharmacy.statut_verification === 'en_attente' && (
                <>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setActionDialog({ type: 'reject', open: true })}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Refuser
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setActionDialog({ type: 'approve', open: true })}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver
                  </Button>
                </>
              )}
              {pharmacy.statut_verification === 'verifie' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setActionDialog({ type: 'suspend', open: true })}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Suspendre
                </Button>
              )}
              {pharmacy.statut_verification === 'suspendu' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setActionDialog({ type: 'reactivate', open: true })}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réactiver
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PharmacyActionDialog
        open={actionDialog.open}
        type={actionDialog.type}
        pharmacyName={pharmacy.nom_commercial}
        onClose={() => setActionDialog({ type: null, open: false })}
        onConfirm={handleAction}
      />
    </>
  );
}
