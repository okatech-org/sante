import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Loader2, Shield, AlertCircle, CheckCircle, CreditCard, User, Calendar, Phone, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  RendezVous, 
  DossierAccueilHDJ, 
  DroitsCNAMGS,
  CalculResteCharge,
  formatNumeroDossier,
  TARIFS_CONVENTIONNES,
  TAUX_PRISE_EN_CHARGE,
  calculateAge
} from '@/types/accueil.types';
import { toast } from 'sonner';

interface PatientCheckInModalProps {
  open: boolean;
  onClose: () => void;
  rendezVous: RendezVous;
  onCheckInComplete: (dossier: DossierAccueilHDJ) => void;
}

export function PatientCheckInModal({ 
  open, 
  onClose, 
  rendezVous, 
  onCheckInComplete 
}: PatientCheckInModalProps) {
  const [isVerifyingCNAMGS, setIsVerifyingCNAMGS] = useState(false);
  const [droitsCNAMGS, setDroitsCNAMGS] = useState<DroitsCNAMGS | null>(null);
  const [resteACharge, setResteACharge] = useState<CalculResteCharge | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const verifierDroitsCNAMGS = async () => {
    setIsVerifyingCNAMGS(true);
    
    try {
      // Simuler un appel API CNAMGS
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Données mock selon le patient
      let mockDroits: DroitsCNAMGS;
      
      // Cas spécial femme enceinte (Sophie KOMBILA)
      if (rendezVous.patient.nom === 'KOMBILA' && rendezVous.service === 'Gynécologie') {
        mockDroits = {
          statutAssure: 'actif',
          fond: 'femme_enceinte',
          plafondAnnuel: 5000000,
          consomme: 250000,
          tauxPriseEnCharge: 100,
          droitsSpeciaux: {
            maternite: true,
            ald: false
          },
          dateVerification: new Date().toISOString()
        };
      } else if (Math.random() > 0.9) {
        // 10% de cas : assuré suspendu
        mockDroits = {
          statutAssure: 'suspendu',
          fond: 'public',
          plafondAnnuel: 0,
          consomme: 0,
          tauxPriseEnCharge: 80,
          droitsSpeciaux: {},
          dateVerification: new Date().toISOString()
        };
      } else {
        // Cas normal
        const fonds = ['public', 'prive', 'gef'] as const;
        const fond = fonds[Math.floor(Math.random() * fonds.length)];
        
        mockDroits = {
          statutAssure: 'actif',
          fond,
          plafondAnnuel: 2000000,
          consomme: Math.floor(Math.random() * 500000),
          tauxPriseEnCharge: fond === 'gef' ? 90 : 80,
          droitsSpeciaux: {
            ald: Math.random() > 0.8
          },
          dateVerification: new Date().toISOString()
        };
      }

      setDroitsCNAMGS(mockDroits);
      
      // Calculer automatiquement le reste à charge
      if (mockDroits.statutAssure === 'actif') {
        calculerResteACharge(mockDroits);
      }
    } catch (error) {
      toast.error("Erreur lors de la vérification CNAMGS");
    } finally {
      setIsVerifyingCNAMGS(false);
    }
  };

  const calculerResteACharge = (droits: DroitsCNAMGS) => {
    // Déterminer le type de consultation
    const isSpecialiste = rendezVous.service !== 'Médecine Générale';
    const tarifConventionne = isSpecialiste 
      ? TARIFS_CONVENTIONNES.consultation_specialisee 
      : TARIFS_CONVENTIONNES.consultation_generale;
    
    // Tarif pratiqué (avec un GAP de 10000 FCFA en moyenne)
    const tarifPratique = tarifConventionne + 10000;
    
    // Calcul de la prise en charge
    const tauxPriseEnCharge = droits.tauxPriseEnCharge;
    const priseEnChargeAssurance = Math.floor(tarifConventionne * (tauxPriseEnCharge / 100));
    const ticketModerateur = tarifConventionne - priseEnChargeAssurance;
    const gap = tarifPratique - tarifConventionne;
    
    // Pour les femmes enceintes, pas de reste à charge
    const resteACharge = droits.fond === 'femme_enceinte' ? 0 : ticketModerateur + gap;

    setResteACharge({
      tarifConventionne,
      tarifPratique,
      priseEnChargeAssurance,
      ticketModerateur,
      gap,
      resteACharge,
      detailCalcul: droits.fond === 'femme_enceinte' 
        ? 'Tiers-payant intégral - Maternité' 
        : `Ticket modérateur (${100 - tauxPriseEnCharge}%) + GAP`
      });
  };

  // Vérifier automatiquement les droits CNAMGS à l'ouverture
  useEffect(() => {
    if (open && rendezVous.patient.numeroAssureCNAMGS) {
      verifierDroitsCNAMGS();
    }
  }, [open]);

  const handleConfirmCheckIn = async () => {
    setIsProcessing(true);
    
    try {
      // Simuler la création du dossier
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Générer un numéro de dossier
      const sequence = Math.floor(Math.random() * 999) + 1;
      const numeroDossier = formatNumeroDossier('HDJ', new Date(), sequence);
      
      // Créer le dossier d'accueil
      const dossier: DossierAccueilHDJ = {
        id: `dossier-${Date.now()}`,
        numeroDossier,
        rendezVous,
        patient: rendezVous.patient,
        heureArrivee: new Date().toISOString(),
        droitsVerifies: droitsCNAMGS || undefined,
        resteACharge: resteACharge || undefined,
        serviceDestination: rendezVous.service,
        statutFileAttente: 'en_attente',
        tempsAttenteEstime: Math.floor(Math.random() * 30) + 10, // 10-40 minutes
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Appeler le callback
      onCheckInComplete(dossier);
      
      // Envoyer une notification SMS (simulé)
      toast.success("SMS de confirmation envoyé au patient");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const age = calculateAge(rendezVous.patient.dateNaissance);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Enregistrement arrivée patient
          </DialogTitle>
          <DialogDescription>
            Vérification des droits CNAMGS et création du dossier d'accueil.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations patient */}
          <Card className="p-6 bg-muted/30">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {rendezVous.patient.nom} {rendezVous.patient.prenom}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1 mt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(rendezVous.patient.dateNaissance), 'dd/MM/yyyy', { locale: fr })}
                      ({age} ans) • {rendezVous.patient.sexe === 'M' ? 'Homme' : 'Femme'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {rendezVous.patient.telephone}
                    </div>
                    {rendezVous.patient.numeroAssureCNAMGS && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        N° CNAMGS : {rendezVous.patient.numeroAssureCNAMGS}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {format(new Date(rendezVous.dateHeure), 'HH:mm')}
              </Badge>
            </div>
          </Card>

          {/* Détails consultation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Service</label>
              <p className="font-semibold">{rendezVous.service}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Médecin</label>
              <p className="font-semibold">Dr. {rendezVous.medecin.nom} {rendezVous.medecin.prenom}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Motif</label>
              <p className="font-semibold">{rendezVous.motif}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type consultation</label>
              <p className="font-semibold">
                {rendezVous.service === 'Médecine Générale' ? 'Consultation générale' : 'Consultation spécialisée'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Vérification droits CNAMGS */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Vérification des droits CNAMGS
            </h4>

            {isVerifyingCNAMGS ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3">Vérification en cours...</span>
              </div>
            ) : droitsCNAMGS ? (
              <div className="space-y-3">
                {droitsCNAMGS.statutAssure === 'actif' ? (
                  <>
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Droits valides</strong> - Assuré actif
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <label className="text-xs text-muted-foreground">Fond</label>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold capitalize">
                            {droitsCNAMGS.fond === 'femme_enceinte' ? 'Femme enceinte' : droitsCNAMGS.fond}
                          </p>
                          {droitsCNAMGS.fond === 'femme_enceinte' && (
                            <Badge variant="success" className="text-xs">100% Maternité</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Taux prise en charge</label>
                        <p className="font-semibold">{droitsCNAMGS.tauxPriseEnCharge}%</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Plafond annuel</label>
                        <p className="font-semibold">{formatCurrency(droitsCNAMGS.plafondAnnuel)}</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Consommé</label>
                        <p className="font-semibold">{formatCurrency(droitsCNAMGS.consomme)}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Droits suspendus</strong> - Cotisations impayées
                      <p className="text-sm mt-1">Le patient devra régler l'intégralité de la consultation</p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : rendezVous.patient.numeroAssureCNAMGS ? (
              <Button onClick={verifierDroitsCNAMGS} variant="outline">
                Vérifier les droits
              </Button>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Aucun numéro CNAMGS renseigné
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Separator />

          {/* Calcul reste à charge */}
          {resteACharge && (
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Calcul du reste à charge
              </h4>

              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tarif conventionné CNAMGS</span>
                  <span className="font-semibold">{formatCurrency(resteACharge.tarifConventionne)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tarif pratiqué (établissement)</span>
                  <span className="font-semibold">{formatCurrency(resteACharge.tarifPratique)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-sm">Prise en charge assurance ({droitsCNAMGS?.tauxPriseEnCharge}%)</span>
                  <span className="font-semibold">- {formatCurrency(resteACharge.priseEnChargeAssurance)}</span>
                </div>
                
                {resteACharge.ticketModerateur > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ticket modérateur</span>
                    <span className="font-semibold">{formatCurrency(resteACharge.ticketModerateur)}</span>
                  </div>
                )}
                
                {resteACharge.gap > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">GAP (dépassement)</span>
                    <span className="font-semibold">{formatCurrency(resteACharge.gap)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total à payer par le patient</span>
                  <span className="font-bold text-xl">
                    {formatCurrency(resteACharge.resteACharge)}
                  </span>
                </div>

                {droitsCNAMGS?.fond === 'femme_enceinte' && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertDescription className="text-blue-800">
                      <strong>Tiers-payant intégral</strong> - Prise en charge maternité 100%
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* Alerte si droits suspendus */}
          {droitsCNAMGS?.statutAssure === 'suspendu' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Paiement comptant requis</strong>
                <p>Montant total : {formatCurrency(
                  rendezVous.service === 'Médecine Générale' 
                    ? TARIFS_CONVENTIONNES.consultation_generale + 10000
                    : TARIFS_CONVENTIONNES.consultation_specialisee + 10000
                )}</p>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleConfirmCheckIn}
            disabled={isProcessing || isVerifyingCNAMGS}
          >
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmer l'enregistrement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
