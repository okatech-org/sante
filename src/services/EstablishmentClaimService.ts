// ============================================================================
// Service de Gestion des Revendications d'Établissements
// ============================================================================

import { supabase } from '@/integrations/supabase/client';

// Types
export enum ClaimStatus {
  UNCLAIMED = 'unclaimed',
  CLAIM_PENDING = 'claim_pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

export enum ClaimRequestStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

export enum VerificationStep {
  IDENTITY_VERIFIED = 'identity_verified',
  DOCUMENTS_UPLOADED = 'documents_uploaded',
  AUTHORITY_VERIFIED = 'authority_verified',
  PROFESSIONAL_ORDER_CHECKED = 'professional_order_checked',
  MINISTRY_APPROVED = 'ministry_approved',
  FINAL_VALIDATION = 'final_validation'
}

export interface EstablishmentClaim {
  id: string;
  establishment_id: string;
  claimant_user_id: string;
  claimant_role: string;
  claimant_phone: string;
  claimant_email: string;
  claimant_title?: string;
  documents: {
    official_letter?: string;
    identity_proof?: string;
    authority_proof?: string;
    rccm_document?: string;
    msp_authorization?: string;
    other_documents?: string[];
  };
  verification_code: string;
  status: ClaimRequestStatus;
  verification_steps: VerificationStep[];
  reviewer_id?: string;
  review_notes?: string;
  rejection_reason?: string;
  created_at: Date;
  submitted_at?: Date;
  reviewed_at?: Date;
  approved_at?: Date;
  rejected_at?: Date;
  expires_at: Date;
  updated_at: Date;
}

export interface Establishment {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'cabinet' | 'pharmacy' | 'laboratory';
  sector: 'public' | 'private' | 'confessional' | 'military';
  province: string;
  city: string;
  address?: string;
  claim_status: ClaimStatus;
  claimed_by?: string;
  claimed_at?: Date;
  is_pre_registered: boolean;
  public_contact_email?: string;
  public_contact_phone?: string;
  services?: string[];
  capacity?: {
    beds?: number;
    operating_rooms?: number;
    consultation_rooms?: number;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingDocuments: string[];
  nextSteps: string[];
}

// ============================================================================
// Service Principal
// ============================================================================

export class EstablishmentClaimService {
  private static instance: EstablishmentClaimService;
  
  private constructor() {}
  
  public static getInstance(): EstablishmentClaimService {
    if (!EstablishmentClaimService.instance) {
      EstablishmentClaimService.instance = new EstablishmentClaimService();
    }
    return EstablishmentClaimService.instance;
  }

  // --------------------------------------------------------------------------
  // Récupération des établissements
  // --------------------------------------------------------------------------

  /**
   * Récupère tous les établissements non-revendiqués
   */
  async getUnclaimedEstablishments(filters?: {
    type?: string;
    province?: string;
    city?: string;
    search?: string;
  }): Promise<Establishment[]> {
    try {
      let query = supabase
        .from('establishments')
        .select('*')
        .eq('claim_status', ClaimStatus.UNCLAIMED)
        .order('name');

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.province) {
        query = query.eq('province', filters.province);
      }
      if (filters?.city) {
        query = query.eq('city', filters.city);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching unclaimed establishments:', error);
      throw error;
    }
  }

  /**
   * Récupère les détails d'un établissement
   */
  async getEstablishmentDetails(establishmentId: string): Promise<Establishment | null> {
    try {
      const { data, error } = await supabase
        .from('establishments')
        .select(`
          *,
          claimed_by:users!claimed_by(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('id', establishmentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching establishment details:', error);
      throw error;
    }
  }

  // --------------------------------------------------------------------------
  // Gestion des revendications
  // --------------------------------------------------------------------------

  /**
   * Vérifie si un utilisateur peut revendiquer un établissement
   */
  async canUserClaimEstablishment(
    userId: string, 
    establishmentId: string
  ): Promise<{ canClaim: boolean; reason?: string }> {
    try {
      const { data, error } = await supabase
        .rpc('can_user_claim_establishment', {
          p_user_id: userId,
          p_establishment_id: establishmentId
        });

      if (error) throw error;

      if (!data) {
        // Déterminer la raison
        const establishment = await this.getEstablishmentDetails(establishmentId);
        
        if (establishment?.claim_status !== ClaimStatus.UNCLAIMED) {
          return { 
            canClaim: false, 
            reason: 'Cet établissement a déjà été revendiqué ou est en cours de vérification.' 
          };
        }

        // Vérifier les revendications existantes
        const { data: existingClaims } = await supabase
          .from('establishment_claims')
          .select('id')
          .eq('establishment_id', establishmentId)
          .eq('claimant_user_id', userId)
          .in('status', [ClaimRequestStatus.PENDING, ClaimRequestStatus.IN_REVIEW]);

        if (existingClaims && existingClaims.length > 0) {
          return { 
            canClaim: false, 
            reason: 'Vous avez déjà une revendication en cours pour cet établissement.' 
          };
        }

        return { 
          canClaim: false, 
          reason: 'Vous avez atteint la limite de revendications pour aujourd\'hui.' 
        };
      }

      return { canClaim: true };
    } catch (error) {
      console.error('Error checking claim eligibility:', error);
      throw error;
    }
  }

  /**
   * Initie une nouvelle revendication
   */
  async initiateClai

m(
    establishmentId: string,
    claimData: {
      claimant_role: string;
      claimant_phone: string;
      claimant_email: string;
      claimant_title?: string;
    }
  ): Promise<EstablishmentClaim> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('establishment_claims')
        .insert({
          establishment_id: establishmentId,
          claimant_user_id: user.id,
          ...claimData,
          status: ClaimRequestStatus.DRAFT
        })
        .select()
        .single();

      if (error) throw error;

      // Ajouter à l'historique
      await this.addClaimHistory(data.id, 'created', {
        establishment_id: establishmentId,
        claimant_role: claimData.claimant_role
      });

      return data;
    } catch (error) {
      console.error('Error initiating claim:', error);
      throw error;
    }
  }

  /**
   * Upload des documents de vérification
   */
  async uploadVerificationDocument(
    claimId: string,
    documentType: string,
    file: File
  ): Promise<string> {
    try {
      // Vérifier que la revendication appartient à l'utilisateur
      const { data: claim } = await supabase
        .from('establishment_claims')
        .select('claimant_user_id, documents')
        .eq('id', claimId)
        .single();

      const { data: { user } } = await supabase.auth.getUser();
      if (claim.claimant_user_id !== user?.id) {
        throw new Error('Unauthorized');
      }

      // Upload du fichier
      const fileExt = file.name.split('.').pop();
      const fileName = `${claimId}/${documentType}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('claim-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Récupérer l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('claim-documents')
        .getPublicUrl(fileName);

      // Mettre à jour les documents dans la revendication
      const currentDocuments = claim.documents || {};
      
      if (documentType === 'other') {
        currentDocuments.other_documents = [
          ...(currentDocuments.other_documents || []),
          publicUrl
        ];
      } else {
        currentDocuments[documentType] = publicUrl;
      }

      const { error: updateError } = await supabase
        .from('establishment_claims')
        .update({ 
          documents: currentDocuments,
          updated_at: new Date().toISOString()
        })
        .eq('id', claimId);

      if (updateError) throw updateError;

      // Ajouter à l'historique
      await this.addClaimHistory(claimId, 'document_added', {
        document_type: documentType,
        file_name: file.name
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  /**
   * Valide les documents d'une revendication
   */
  async validateDocuments(claimId: string): Promise<ValidationResult> {
    try {
      const { data: claim } = await supabase
        .from('establishment_claims')
        .select('*')
        .eq('id', claimId)
        .single();

      const { data: establishment } = await supabase
        .from('establishments')
        .select('type, sector')
        .eq('id', claim.establishment_id)
        .single();

      const result: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: [],
        missingDocuments: [],
        nextSteps: []
      };

      // Documents requis selon le type d'établissement
      const requiredDocuments = ['official_letter', 'identity_proof', 'authority_proof'];
      
      if (establishment.sector === 'private') {
        requiredDocuments.push('rccm_document');
      }
      
      if (establishment.type === 'hospital' || establishment.type === 'clinic') {
        requiredDocuments.push('msp_authorization');
      }

      // Vérifier les documents manquants
      for (const doc of requiredDocuments) {
        if (!claim.documents?.[doc]) {
          result.missingDocuments.push(doc);
          result.isValid = false;
        }
      }

      // Vérifier le rôle du demandeur
      const validRoles = ['Directeur', 'Administrateur', 'Propriétaire', 'Gérant'];
      if (!validRoles.includes(claim.claimant_role)) {
        result.warnings.push('Le rôle indiqué pourrait nécessiter une vérification supplémentaire');
      }

      // Définir les prochaines étapes
      if (result.missingDocuments.length > 0) {
        result.nextSteps.push(`Télécharger les documents manquants: ${result.missingDocuments.join(', ')}`);
      } else {
        result.nextSteps.push('Soumettre la revendication pour examen');
      }

      return result;
    } catch (error) {
      console.error('Error validating documents:', error);
      throw error;
    }
  }

  /**
   * Soumet une revendication pour examen
   */
  async submitClaimForReview(claimId: string): Promise<boolean> {
    try {
      // Valider d'abord les documents
      const validation = await this.validateDocuments(claimId);
      
      if (!validation.isValid) {
        throw new Error(`Documents manquants: ${validation.missingDocuments.join(', ')}`);
      }

      const { data, error } = await supabase
        .rpc('submit_establishment_claim', {
          p_claim_id: claimId
        });

      if (error) throw error;

      // Envoyer une notification (à implémenter)
      await this.sendClaimNotification(claimId, 'submitted');

      return data;
    } catch (error) {
      console.error('Error submitting claim:', error);
      throw error;
    }
  }

  /**
   * Récupère les revendications d'un utilisateur
   */
  async getUserClaims(userId?: string): Promise<EstablishmentClaim[]> {
    try {
      const actualUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      if (!actualUserId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('establishment_claims')
        .select(`
          *,
          establishment:establishments(
            name,
            type,
            city,
            province
          )
        `)
        .eq('claimant_user_id', actualUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user claims:', error);
      throw error;
    }
  }

  /**
   * Récupère le statut d'une revendication
   */
  async getClaimStatus(claimId: string): Promise<{
    status: ClaimRequestStatus;
    progress: number;
    currentStep: string;
    estimatedCompletion?: Date;
  }> {
    try {
      const { data: claim } = await supabase
        .from('establishment_claims')
        .select('status, verification_steps, submitted_at')
        .eq('id', claimId)
        .single();

      const allSteps = Object.values(VerificationStep);
      const completedSteps = claim.verification_steps || [];
      const progress = (completedSteps.length / allSteps.length) * 100;

      let currentStep = 'Préparation des documents';
      if (claim.status === ClaimRequestStatus.PENDING) {
        currentStep = 'En attente d\'examen';
      } else if (claim.status === ClaimRequestStatus.IN_REVIEW) {
        currentStep = 'Examen en cours';
      } else if (claim.status === ClaimRequestStatus.APPROVED) {
        currentStep = 'Approuvé';
      } else if (claim.status === ClaimRequestStatus.REJECTED) {
        currentStep = 'Rejeté';
      }

      // Estimer la date de completion (48h après soumission)
      let estimatedCompletion;
      if (claim.submitted_at) {
        estimatedCompletion = new Date(claim.submitted_at);
        estimatedCompletion.setHours(estimatedCompletion.getHours() + 48);
      }

      return {
        status: claim.status,
        progress,
        currentStep,
        estimatedCompletion
      };
    } catch (error) {
      console.error('Error fetching claim status:', error);
      throw error;
    }
  }

  // --------------------------------------------------------------------------
  // Méthodes Admin
  // --------------------------------------------------------------------------

  /**
   * Récupère les revendications en attente (admin)
   */
  async getPendingClaims(): Promise<EstablishmentClaim[]> {
    try {
      const { data, error } = await supabase
        .from('v_active_claims')
        .select('*')
        .order('submitted_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pending claims:', error);
      throw error;
    }
  }

  /**
   * Approuve une revendication (admin)
   */
  async approveClaim(
    claimId: string, 
    reviewerId: string, 
    notes?: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('approve_establishment_claim', {
          p_claim_id: claimId,
          p_reviewer_id: reviewerId,
          p_notes: notes
        });

      if (error) throw error;

      // Envoyer notification d'approbation
      await this.sendClaimNotification(claimId, 'approved');

      return data;
    } catch (error) {
      console.error('Error approving claim:', error);
      throw error;
    }
  }

  /**
   * Rejette une revendication (admin)
   */
  async rejectClaim(
    claimId: string,
    reviewerId: string,
    reason: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('establishment_claims')
        .update({
          status: ClaimRequestStatus.REJECTED,
          reviewer_id: reviewerId,
          rejection_reason: reason,
          rejected_at: new Date().toISOString(),
          reviewed_at: new Date().toISOString()
        })
        .eq('id', claimId);

      if (error) throw error;

      // Remettre l'établissement en statut non-revendiqué
      const { data: claim } = await supabase
        .from('establishment_claims')
        .select('establishment_id')
        .eq('id', claimId)
        .single();

      await supabase
        .from('establishments')
        .update({ claim_status: ClaimStatus.UNCLAIMED })
        .eq('id', claim.establishment_id);

      // Ajouter à l'historique
      await this.addClaimHistory(claimId, 'rejected', { reason });

      // Envoyer notification de rejet
      await this.sendClaimNotification(claimId, 'rejected', reason);

      return true;
    } catch (error) {
      console.error('Error rejecting claim:', error);
      throw error;
    }
  }

  // --------------------------------------------------------------------------
  // Méthodes utilitaires
  // --------------------------------------------------------------------------

  /**
   * Ajoute une entrée à l'historique des revendications
   */
  private async addClaimHistory(
    claimId: string,
    action: string,
    details: any = {}
  ): Promise<void> {
    try {
      const { data: claim } = await supabase
        .from('establishment_claims')
        .select('establishment_id, claimant_user_id')
        .eq('id', claimId)
        .single();

      await supabase
        .from('claim_history')
        .insert({
          claim_id: claimId,
          establishment_id: claim.establishment_id,
          user_id: claim.claimant_user_id,
          action,
          details
        });
    } catch (error) {
      console.error('Error adding claim history:', error);
    }
  }

  /**
   * Envoie une notification pour une revendication
   */
  private async sendClaimNotification(
    claimId: string,
    type: 'submitted' | 'approved' | 'rejected',
    additionalInfo?: string
  ): Promise<void> {
    try {
      const { data: claim } = await supabase
        .from('establishment_claims')
        .select(`
          claimant_email,
          establishment:establishments(name)
        `)
        .eq('id', claimId)
        .single();

      // Ici, intégrer avec votre service de notification (email, SMS, etc.)
      console.log(`Notification sent: ${type} for ${claim.establishment.name} to ${claim.claimant_email}`);
      
      // TODO: Implémenter l'envoi réel d'email/SMS
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Vérifie automatiquement les revendications simples
   */
  async autoVerifyClaim(claimId: string): Promise<boolean> {
    try {
      const { data: claim } = await supabase
        .from('establishment_claims')
        .select(`
          *,
          establishment:establishments(type),
          claimant:users!claimant_user_id(
            user_type,
            professional_profiles(
              ordre_number,
              verification_status
            )
          )
        `)
        .eq('id', claimId)
        .single();

      // Auto-approuver si:
      // 1. C'est un cabinet médical
      // 2. Le demandeur est un professionnel vérifié
      // 3. Il a un numéro d'ordre valide
      if (
        claim.establishment.type === 'cabinet' &&
        claim.claimant.user_type === 'professional' &&
        claim.claimant.professional_profiles?.[0]?.verification_status === 'verified' &&
        claim.claimant.professional_profiles?.[0]?.ordre_number
      ) {
        // Auto-approuver
        const { data: { user } } = await supabase.auth.getUser();
        return await this.approveClaim(claimId, user!.id, 'Auto-approuvé: Professionnel vérifié');
      }

      return false;
    } catch (error) {
      console.error('Error auto-verifying claim:', error);
      return false;
    }
  }
}

// Export singleton
export const claimService = EstablishmentClaimService.getInstance();
