// Service simplifié de revendication d'établissements
// Note: Ce service est temporairement désactivé car les tables nécessaires n'existent pas encore

import { supabase } from '@/integrations/supabase/client';

export enum ClaimStatus {
  UNCLAIMED = 'unclaimed',
  CLAIM_PENDING = 'claim_pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

export interface Establishment {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'cabinet' | 'pharmacy' | 'laboratory';
  sector: 'public' | 'private' | 'confessional' | 'military';
  city: string;
  province: string;
}

export interface EstablishmentClaim {
  id: string;
  establishment_id: string;
  claimant_user_id: string;
  claimant_role: string;
  claimant_phone: string;
  claimant_email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export class EstablishmentClaimService {
  static async getUnclaimedEstablishments(): Promise<Establishment[]> {
    // Simplified - return empty array
    return [];
  }

  static async claimEstablishment(establishmentId: string, claimData: any): Promise<any> {
    throw new Error('Claim functionality not yet implemented - database tables missing');
  }

  static async getEstablishmentById(establishmentId: string): Promise<Establishment | null> {
    return null;
  }

  static async canUserClaimEstablishment(establishmentId: string): Promise<boolean> {
    return false;
  }

  static async getUserClaimedEstablishments(): Promise<Establishment[]> {
    return [];
  }
}

export default EstablishmentClaimService;
