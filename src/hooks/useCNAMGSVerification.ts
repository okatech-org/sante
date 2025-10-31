import { useState } from 'react';
import { DroitsCNAMGS, CalculResteCharge } from '@/types/accueil.types';
import { toast } from 'sonner';

export function useCNAMGSVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [droits, setDroits] = useState<DroitsCNAMGS | null>(null);
  const [resteACharge, setResteACharge] = useState<CalculResteCharge | null>(null);

  const verifierDroits = async (numeroAssure: string) => {
    setIsLoading(true);
    
    try {
      // Simuler un appel API CNAMGS
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Générer des données mock réalistes
      const random = Math.random();
      let mockDroits: DroitsCNAMGS;
      
      if (random < 0.05) {
        // 5% de cas : assuré suspendu
        mockDroits = {
          statutAssure: 'suspendu',
          fond: 'public',
          plafondAnnuel: 0,
          consomme: 0,
          tauxPriseEnCharge: 0,
          droitsSpeciaux: {},
          dateVerification: new Date().toISOString()
        };
      } else if (random < 0.10) {
        // 5% de cas : femme enceinte
        mockDroits = {
          statutAssure: 'actif',
          fond: 'femme_enceinte',
          plafondAnnuel: 5000000,
          consomme: Math.floor(Math.random() * 1000000),
          tauxPriseEnCharge: 100,
          droitsSpeciaux: {
            maternite: true,
            ald: false
          },
          dateVerification: new Date().toISOString()
        };
      } else if (random < 0.25) {
        // 15% de cas : secteur privé
        mockDroits = {
          statutAssure: 'actif',
          fond: 'prive',
          plafondAnnuel: 2000000,
          consomme: Math.floor(Math.random() * 500000),
          tauxPriseEnCharge: 80,
          droitsSpeciaux: {
            ald: Math.random() > 0.9
          },
          dateVerification: new Date().toISOString()
        };
      } else if (random < 0.35) {
        // 10% de cas : GEF
        mockDroits = {
          statutAssure: 'actif',
          fond: 'gef',
          plafondAnnuel: 3000000,
          consomme: Math.floor(Math.random() * 750000),
          tauxPriseEnCharge: 80,
          droitsSpeciaux: {},
          dateVerification: new Date().toISOString()
        };
      } else {
        // 65% de cas : secteur public
        mockDroits = {
          statutAssure: 'actif',
          fond: 'public',
          plafondAnnuel: 2000000,
          consomme: Math.floor(Math.random() * 500000),
          tauxPriseEnCharge: 80,
          droitsSpeciaux: {
            ald: Math.random() > 0.85
          },
          dateVerification: new Date().toISOString()
        };
      }

      // Si ALD, augmenter le taux de prise en charge
      if (mockDroits.droitsSpeciaux?.ald) {
        mockDroits.tauxPriseEnCharge = 90;
      }

      setDroits(mockDroits);
      
      // Notification selon le statut
      if (mockDroits.statutAssure === 'actif') {
        toast.success('Droits CNAMGS vérifiés', {
          description: `Assuré ${mockDroits.fond === 'femme_enceinte' ? 'Maternité 100%' : `${mockDroits.fond} - ${mockDroits.tauxPriseEnCharge}%`}`
        });
      } else if (mockDroits.statutAssure === 'suspendu') {
        toast.error('Droits suspendus', {
          description: 'Cotisations impayées - Paiement comptant requis'
        });
      }

      return mockDroits;
    } catch (error) {
      toast.error('Erreur lors de la vérification CNAMGS');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const calculerResteACharge = (
    droits: DroitsCNAMGS,
    tarifConventionne: number,
    tarifPratique: number
  ): CalculResteCharge => {
    // Calcul de la prise en charge
    const tauxPriseEnCharge = droits.tauxPriseEnCharge;
    const priseEnChargeAssurance = Math.floor(tarifConventionne * (tauxPriseEnCharge / 100));
    const ticketModerateur = tarifConventionne - priseEnChargeAssurance;
    const gap = tarifPratique - tarifConventionne;
    
    // Pour les femmes enceintes et GEF à 100%, pas de reste à charge
    let resteACharge = ticketModerateur + gap;
    let detailCalcul = `Ticket modérateur (${100 - tauxPriseEnCharge}%) + GAP`;
    
    if (droits.fond === 'femme_enceinte') {
      resteACharge = 0;
      detailCalcul = 'Tiers-payant intégral - Maternité';
    } else if (droits.fond === 'gef' && tauxPriseEnCharge === 100) {
      resteACharge = gap; // L'État paie le ticket modérateur
      detailCalcul = 'État prend en charge 100% du tarif conventionné, patient paie le GAP';
    }

    const result: CalculResteCharge = {
      tarifConventionne,
      tarifPratique,
      priseEnChargeAssurance,
      ticketModerateur,
      gap,
      resteACharge,
      detailCalcul
    };

    setResteACharge(result);
    return result;
  };

  const reset = () => {
    setDroits(null);
    setResteACharge(null);
    setIsLoading(false);
  };

  return {
    isLoading,
    droits,
    resteACharge,
    verifierDroits,
    calculerResteACharge,
    reset
  };
}
