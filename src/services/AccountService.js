// services/AccountService.js
import { supabase } from '@/integrations/supabase/client';

class AccountService {
    /**
     * Create a new user account (patient or professional)
     */
    async createAccount(data) {
        const { email, password, profile_type, profile_data } = data;
        
        try {
            // Start transaction
            const { data: authUser, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        profile_type,
                        ...profile_data
                    }
                }
            });
            
            if (authError) throw authError;
            
            // Create profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .insert({
                    user_id: authUser.user.id,
                    email,
                    profile_type,
                    first_name: profile_data.first_name,
                    last_name: profile_data.last_name,
                    phone: profile_data.phone,
                    date_of_birth: profile_data.date_of_birth,
                    national_id: profile_data.national_id,
                    gender: profile_data.gender
                })
                .select()
                .single();
            
            if (profileError) throw profileError;
            
            // Create type-specific extension
            if (profile_type === 'patient') {
                await this.createPatientProfile(profile.id, data.patient_data);
            } else if (profile_type === 'professional') {
                await this.createProfessionalProfile(profile.id, data.professional_data);
            }
            
            return { success: true, profile };
        } catch (error) {
            console.error('Account creation error:', error);
            throw error;
        }
    }
    
    /**
     * Create patient profile extension
     */
    async createPatientProfile(profileId, patientData) {
        const { data, error } = await supabase
            .from('patients')
            .insert({
                profile_id: profileId,
                cnamgs_number: patientData.cnamgs_number,
                cnamgs_status: patientData.cnamgs_status || 'pending',
                cnss_number: patientData.cnss_number,
                blood_group: patientData.blood_group,
                emergency_contact_name: patientData.emergency_contact_name,
                emergency_contact_phone: patientData.emergency_contact_phone,
                emergency_contact_relationship: patientData.emergency_contact_relationship
            })
            .select()
            .single();
        
        if (error) throw error;
        
        // Create medical record
        await this.createMedicalRecord(data.id);
        
        return data;
    }
    
    /**
     * Create professional profile extension
     */
    async createProfessionalProfile(profileId, professionalData) {
        const { data, error } = await supabase
            .from('professionals')
            .insert({
                profile_id: profileId,
                profession_type: professionalData.profession_type,
                specializations: professionalData.specializations || [],
                ordre_number: professionalData.ordre_number,
                ordre_type: professionalData.ordre_type,
                ordre_registration_date: professionalData.ordre_registration_date,
                ordre_status: professionalData.ordre_status || 'active',
                years_of_experience: professionalData.years_of_experience,
                languages_spoken: professionalData.languages_spoken || ['French']
            })
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
    
    /**
     * Create medical record for patient
     */
    async createMedicalRecord(patientId) {
        const { data, error } = await supabase
            .from('medical_records')
            .insert({
                patient_id: patientId,
                default_sharing_consent: false,
                emergency_access_allowed: true
            })
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
    
    /**
     * Professional claims an establishment
     */
    async claimEstablishment(professionalId, establishmentId, claimData) {
        // Verify establishment is unclaimed
        const { data: establishment } = await supabase
            .from('establishments')
            .select('*')
            .eq('id', establishmentId)
            .single();
        
        if (!establishment) {
            throw new Error('Établissement non trouvé');
        }
        
        if (establishment.claim_status !== 'unclaimed') {
            throw new Error('Cet établissement a déjà été revendiqué');
        }
        
        // Update establishment status
        const { error: updateError } = await supabase
            .from('establishments')
            .update({ 
                claim_status: 'claim_pending',
                claimed_by: professionalId,
                claimed_at: new Date().toISOString()
            })
            .eq('id', establishmentId);
        
        if (updateError) throw updateError;
        
        // Create pending affiliation as owner
        const { data: affiliation, error: affiliationError } = await supabase
            .from('professional_affiliations')
            .insert({
                professional_id: professionalId,
                establishment_id: establishmentId,
                role: 'owner',
                status: 'pending',
                start_date: new Date().toISOString(),
                can_prescribe: true,
                can_admit_patients: true,
                can_access_all_patients: true,
                can_manage_staff: true,
                can_manage_inventory: true,
                can_view_financials: true,
                metadata: claimData
            })
            .select()
            .single();
        
        if (affiliationError) throw affiliationError;
        
        // TODO: Notify admins for review
        // await this.notifyAdminsOfClaim(affiliation);
        
        return affiliation;
    }
    
    /**
     * Add professional to establishment staff
     */
    async addStaffMember(establishmentId, professionalId, roleData, addedBy) {
        // Verify admin rights
        const hasAdminRights = await this.checkAdminRights(addedBy, establishmentId);
        if (!hasAdminRights) {
            throw new Error('Droits administrateur requis');
        }
        
        // Check if professional exists
        const { data: professional } = await supabase
            .from('professionals')
            .select('*')
            .eq('id', professionalId)
            .single();
        
        if (!professional) {
            throw new Error('Professionnel non trouvé');
        }
        
        // Create staff association
        const { data: staff, error } = await supabase
            .from('establishment_staff')
            .insert({
                establishment_id: establishmentId,
                professional_id: professionalId,
                role_title: roleData.role_title,
                role_category: roleData.role_category,
                department: roleData.department,
                service: roleData.service,
                schedule_type: roleData.schedule_type || 'full_time',
                contract_type: roleData.contract_type || 'permanent',
                contract_start_date: roleData.contract_start_date || new Date().toISOString(),
                permissions: roleData.permissions || [],
                created_by: addedBy,
                status: 'active'
            })
            .select()
            .single();
        
        if (error) throw error;
        
        return staff;
    }
    
    /**
     * Switch working context for multi-establishment professional
     */
    async switchContext(professionalId, establishmentId) {
        // Verify professional has access to this establishment
        const { data: staffRecord } = await supabase
            .from('establishment_staff')
            .select(`
                *,
                establishment:establishments(*)
            `)
            .eq('professional_id', professionalId)
            .eq('establishment_id', establishmentId)
            .eq('status', 'active')
            .single();
        
        if (!staffRecord) {
            // Check if using old affiliation system
            const { data: affiliation } = await supabase
                .from('professional_affiliations')
                .select(`
                    *,
                    establishment:establishments(*)
                `)
                .eq('professional_id', professionalId)
                .eq('establishment_id', establishmentId)
                .eq('status', 'active')
                .single();
            
            if (!affiliation) {
                throw new Error('Accès non autorisé à cet établissement');
            }
            
            // Use affiliation data
            return {
                establishment: affiliation.establishment,
                role: affiliation.role,
                permissions: [
                    affiliation.can_prescribe && 'write_prescription',
                    affiliation.can_admit_patients && 'admit_patient',
                    affiliation.can_access_all_patients && 'access_all_patients',
                    affiliation.can_manage_staff && 'manage_staff',
                    affiliation.can_manage_inventory && 'manage_inventory',
                    affiliation.can_view_financials && 'view_financials'
                ].filter(Boolean),
                department: affiliation.department
            };
        }
        
        // Store in session/localStorage
        localStorage.setItem('current_establishment', JSON.stringify({
            establishment_id: establishmentId,
            establishment: staffRecord.establishment,
            role: staffRecord.role_title,
            permissions: staffRecord.permissions,
            department: staffRecord.department
        }));
        
        return {
            establishment: staffRecord.establishment,
            role: staffRecord.role_title,
            permissions: staffRecord.permissions,
            department: staffRecord.department
        };
    }
    
    /**
     * Get all establishments where professional works
     */
    async getProfessionalEstablishments(professionalId) {
        // Get from new staff table
        const { data: staffRecords, error: staffError } = await supabase
            .from('establishment_staff')
            .select(`
                *,
                establishment:establishments(
                    *,
                    hospital:hospitals(*),
                    medical_cabinet:medical_cabinets(*),
                    pharmacy:pharmacies(*),
                    laboratory:laboratories(*),
                    imaging_center:imaging_centers(*)
                )
            `)
            .eq('professional_id', professionalId)
            .eq('status', 'active')
            .order('is_establishment_admin', { ascending: false });
        
        // Also check old affiliations table for backward compatibility
        const { data: affiliations, error: affiliationError } = await supabase
            .from('professional_affiliations')
            .select(`
                *,
                establishment:establishments(
                    *,
                    hospital:hospitals(*),
                    medical_cabinet:medical_cabinets(*),
                    pharmacy:pharmacies(*),
                    laboratory:laboratories(*),
                    imaging_center:imaging_centers(*)
                )
            `)
            .eq('professional_id', professionalId)
            .eq('status', 'active')
            .order('role', { ascending: false });
        
        // Combine results, prioritizing staff records
        const establishmentMap = new Map();
        
        if (staffRecords) {
            staffRecords.forEach(record => {
                establishmentMap.set(record.establishment_id, {
                    ...record,
                    source: 'staff'
                });
            });
        }
        
        if (affiliations) {
            affiliations.forEach(affiliation => {
                if (!establishmentMap.has(affiliation.establishment_id)) {
                    establishmentMap.set(affiliation.establishment_id, {
                        ...affiliation,
                        source: 'affiliation'
                    });
                }
            });
        }
        
        return Array.from(establishmentMap.values());
    }
    
    /**
     * Search for unclaimed establishments
     */
    async searchUnclaimedEstablishments(filters = {}) {
        let query = supabase
            .from('establishments')
            .select('*')
            .eq('claim_status', 'unclaimed')
            .eq('is_active', true);
        
        // Apply filters
        if (filters.type) {
            query = query.eq('establishment_type', filters.type);
        }
        if (filters.province) {
            query = query.eq('province', filters.province);
        }
        if (filters.city) {
            query = query.eq('city', filters.city);
        }
        if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
        }
        
        const { data, error } = await query
            .order('name')
            .limit(50);
        
        if (error) throw error;
        
        return data;
    }
    
    /**
     * Manage patient consent for DMP access
     */
    async managePatientConsent(patientId, targetId, targetType, consentData) {
        // Revoke existing consent if any
        await supabase
            .from('patient_consents')
            .update({ 
                is_active: false,
                revoked_at: new Date().toISOString(),
                revocation_reason: 'Replaced by new consent'
            })
            .eq('patient_id', patientId)
            .eq(targetType === 'professional' ? 'professional_id' : 'establishment_id', targetId)
            .eq('is_active', true);
        
        // Create new consent
        const { data: consent, error } = await supabase
            .from('patient_consents')
            .insert({
                patient_id: patientId,
                [targetType === 'professional' ? 'professional_id' : 'establishment_id']: targetId,
                consent_type: consentData.consent_type || 'read_only',
                access_scope: consentData.access_scope || {
                    consultations: true,
                    prescriptions: true,
                    lab_results: true,
                    imaging: true,
                    allergies: true,
                    medications: true
                },
                expires_at: consentData.expires_at,
                granted_via: consentData.granted_via || 'patient_portal',
                is_active: true
            })
            .select()
            .single();
        
        if (error) throw error;
        
        return consent;
    }
    
    /**
     * Check if user has admin rights for establishment
     */
    async checkAdminRights(userId, establishmentId) {
        // Check new staff table
        const { data: staffRecord } = await supabase
            .from('establishment_staff')
            .select('is_establishment_admin')
            .eq('professional_id', userId)
            .eq('establishment_id', establishmentId)
            .eq('status', 'active')
            .eq('is_establishment_admin', true)
            .single();
        
        if (staffRecord) return true;
        
        // Check old affiliations for backward compatibility
        const { data: affiliation } = await supabase
            .from('professional_affiliations')
            .select('role')
            .eq('professional_id', userId)
            .eq('establishment_id', establishmentId)
            .eq('status', 'active')
            .in('role', ['owner', 'director', 'administrator'])
            .single();
        
        return !!affiliation;
    }
    
    /**
     * Get current establishment context
     */
    getCurrentContext() {
        const stored = localStorage.getItem('current_establishment');
        return stored ? JSON.parse(stored) : null;
    }
    
    /**
     * Clear current context (on logout)
     */
    clearContext() {
        localStorage.removeItem('current_establishment');
    }
    
    /**
     * Log DMP access for audit trail
     */
    async logDMPAccess(patientId, resourceType, resourceId, action, reason) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
            .single();
        
        const context = this.getCurrentContext();
        
        const { error } = await supabase
            .from('dmp_access_logs')
            .insert({
                accessor_id: profile?.id,
                patient_id: patientId,
                establishment_context_id: context?.establishment_id,
                resource_type: resourceType,
                resource_id: resourceId,
                action: action,
                access_reason: reason,
                emergency_access: reason === 'emergency'
            });
        
        if (error) console.error('Failed to log DMP access:', error);
    }
}

export default new AccountService();
