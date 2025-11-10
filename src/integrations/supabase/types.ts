export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          created_at: string | null
          duration_minutes: number
          id: string
          notes: string | null
          patient_id: string
          professional_id: string
          reason: string | null
          reminder_sent: boolean | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          created_at?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          patient_id: string
          professional_id: string
          reason?: string | null
          reminder_sent?: boolean | null
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          created_at?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          patient_id?: string
          professional_id?: string
          reason?: string | null
          reminder_sent?: boolean | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      cnamgs_verifications: {
        Row: {
          cnamgs_number: string
          created_at: string | null
          fund: string
          id: string
          updated_at: string | null
          user_id: string
          verification_notes: string | null
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          cnamgs_number: string
          created_at?: string | null
          fund: string
          id?: string
          updated_at?: string | null
          user_id: string
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          cnamgs_number?: string
          created_at?: string | null
          fund?: string
          id?: string
          updated_at?: string | null
          user_id?: string
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      cnom_verifications: {
        Row: {
          created_at: string | null
          id: string
          inscription_date: string | null
          numero_ordre: string
          professional_id: string
          specialty: string | null
          updated_at: string | null
          verification_notes: string | null
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          inscription_date?: string | null
          numero_ordre: string
          professional_id: string
          specialty?: string | null
          updated_at?: string | null
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          inscription_date?: string | null
          numero_ordre?: string
          professional_id?: string
          specialty?: string | null
          updated_at?: string | null
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cnom_verifications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          consultation_date: string
          consultation_type: string
          created_at: string
          diagnosis: string | null
          doctor_name: string
          documents: Json | null
          id: string
          notes: string | null
          reason: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consultation_date: string
          consultation_type: string
          created_at?: string
          diagnosis?: string | null
          doctor_name: string
          documents?: Json | null
          id?: string
          notes?: string | null
          reason: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consultation_date?: string
          consultation_type?: string
          created_at?: string
          diagnosis?: string | null
          doctor_name?: string
          documents?: Json | null
          id?: string
          notes?: string | null
          reason?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_sessions: {
        Row: {
          created_at: string | null
          focus_depth: number | null
          focus_mode: boolean | null
          focus_started_at: string | null
          focus_topic: string | null
          id: string
          is_active: boolean | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          focus_depth?: number | null
          focus_mode?: boolean | null
          focus_started_at?: string | null
          focus_topic?: string | null
          id?: string
          is_active?: boolean | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          focus_depth?: number | null
          focus_mode?: boolean | null
          focus_started_at?: string | null
          focus_topic?: string | null
          id?: string
          is_active?: boolean | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      electronic_prescriptions: {
        Row: {
          additional_notes: string | null
          consultation_id: string | null
          created_at: string | null
          delivery_status: string | null
          diagnosis: string | null
          digital_signature: string | null
          dispensed_at: string | null
          expiry_date: string | null
          id: string
          issued_date: string
          medications: Json
          patient_id: string
          pharmacy_id: string | null
          prescription_number: string
          professional_id: string
          qr_code_data: string | null
          sent_at: string | null
          sent_to_pharmacy: boolean | null
          sent_to_pharmacy_id: string | null
          signature_data: string | null
          signature_timestamp: string | null
          status: string
          teleconsultation_id: string | null
          updated_at: string | null
        }
        Insert: {
          additional_notes?: string | null
          consultation_id?: string | null
          created_at?: string | null
          delivery_status?: string | null
          diagnosis?: string | null
          digital_signature?: string | null
          dispensed_at?: string | null
          expiry_date?: string | null
          id?: string
          issued_date?: string
          medications: Json
          patient_id: string
          pharmacy_id?: string | null
          prescription_number: string
          professional_id: string
          qr_code_data?: string | null
          sent_at?: string | null
          sent_to_pharmacy?: boolean | null
          sent_to_pharmacy_id?: string | null
          signature_data?: string | null
          signature_timestamp?: string | null
          status?: string
          teleconsultation_id?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_notes?: string | null
          consultation_id?: string | null
          created_at?: string | null
          delivery_status?: string | null
          diagnosis?: string | null
          digital_signature?: string | null
          dispensed_at?: string | null
          expiry_date?: string | null
          id?: string
          issued_date?: string
          medications?: Json
          patient_id?: string
          pharmacy_id?: string | null
          prescription_number?: string
          professional_id?: string
          qr_code_data?: string | null
          sent_at?: string | null
          sent_to_pharmacy?: boolean | null
          sent_to_pharmacy_id?: string | null
          signature_data?: string | null
          signature_timestamp?: string | null
          status?: string
          teleconsultation_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "electronic_prescriptions_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "electronic_prescriptions_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "electronic_prescriptions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "electronic_prescriptions_teleconsultation_id_fkey"
            columns: ["teleconsultation_id"]
            isOneToOne: false
            referencedRelation: "teleconsultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      equivalences_therapeutiques: {
        Row: {
          bioequivalence_validee: boolean | null
          created_at: string | null
          id: string
          medicament_generique_id: string | null
          medicament_princeps_id: string | null
        }
        Insert: {
          bioequivalence_validee?: boolean | null
          created_at?: string | null
          id?: string
          medicament_generique_id?: string | null
          medicament_princeps_id?: string | null
        }
        Update: {
          bioequivalence_validee?: boolean | null
          created_at?: string | null
          id?: string
          medicament_generique_id?: string | null
          medicament_princeps_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equivalences_therapeutiques_medicament_generique_id_fkey"
            columns: ["medicament_generique_id"]
            isOneToOne: false
            referencedRelation: "medicaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equivalences_therapeutiques_medicament_princeps_id_fkey"
            columns: ["medicament_princeps_id"]
            isOneToOne: false
            referencedRelation: "medicaments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_departments: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          establishment_id: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          establishment_id: string
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          establishment_id?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishment_departments_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_equipment: {
        Row: {
          annee_installation: number | null
          categorie: string
          created_at: string | null
          derniere_maintenance: string | null
          disponible_24h: boolean | null
          establishment_id: string
          etat_fonctionnement: string | null
          id: string
          marque: string | null
          modele: string | null
          prochaine_maintenance: string | null
          type_equipement: string
          updated_at: string | null
        }
        Insert: {
          annee_installation?: number | null
          categorie: string
          created_at?: string | null
          derniere_maintenance?: string | null
          disponible_24h?: boolean | null
          establishment_id: string
          etat_fonctionnement?: string | null
          id?: string
          marque?: string | null
          modele?: string | null
          prochaine_maintenance?: string | null
          type_equipement: string
          updated_at?: string | null
        }
        Update: {
          annee_installation?: number | null
          categorie?: string
          created_at?: string | null
          derniere_maintenance?: string | null
          disponible_24h?: boolean | null
          establishment_id?: string
          etat_fonctionnement?: string | null
          id?: string
          marque?: string | null
          modele?: string | null
          prochaine_maintenance?: string | null
          type_equipement?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishment_equipment_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_services: {
        Row: {
          actif: boolean | null
          code: string
          created_at: string | null
          establishment_id: string
          horaires: Json | null
          id: string
          nom: string
          nombre_infirmiers: number | null
          nombre_lits: number | null
          nombre_medecins: number | null
          responsable_nom: string | null
          updated_at: string | null
        }
        Insert: {
          actif?: boolean | null
          code: string
          created_at?: string | null
          establishment_id: string
          horaires?: Json | null
          id?: string
          nom: string
          nombre_infirmiers?: number | null
          nombre_lits?: number | null
          nombre_medecins?: number | null
          responsable_nom?: string | null
          updated_at?: string | null
        }
        Update: {
          actif?: boolean | null
          code?: string
          created_at?: string | null
          establishment_id?: string
          horaires?: Json | null
          id?: string
          nom?: string
          nombre_infirmiers?: number | null
          nombre_lits?: number | null
          nombre_medecins?: number | null
          responsable_nom?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishment_services_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_staff: {
        Row: {
          created_at: string | null
          created_by: string | null
          department: string | null
          department_id: string | null
          end_date: string | null
          establishment_id: string
          id: string
          is_admin: boolean | null
          is_department_head: boolean | null
          job_position: string | null
          matricule: string | null
          permissions: string[] | null
          professional_id: string
          role_in_establishment: string
          schedule: Json | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          department_id?: string | null
          end_date?: string | null
          establishment_id: string
          id?: string
          is_admin?: boolean | null
          is_department_head?: boolean | null
          job_position?: string | null
          matricule?: string | null
          permissions?: string[] | null
          professional_id: string
          role_in_establishment: string
          schedule?: Json | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          department_id?: string | null
          end_date?: string | null
          establishment_id?: string
          id?: string
          is_admin?: boolean | null
          is_department_head?: boolean | null
          job_position?: string | null
          matricule?: string | null
          permissions?: string[] | null
          professional_id?: string
          role_in_establishment?: string
          schedule?: Json | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "establishment_staff_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establishment_staff_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establishment_staff_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_staff_requests: {
        Row: {
          created_at: string | null
          establishment_id: string
          id: string
          professional_id: string
          rejection_reason: string | null
          request_message: string | null
          requested_role: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          establishment_id: string
          id?: string
          professional_id: string
          rejection_reason?: string | null
          request_message?: string | null
          requested_role: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          establishment_id?: string
          id?: string
          professional_id?: string
          rejection_reason?: string | null
          request_message?: string | null
          requested_role?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "establishment_staff_requests_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "establishment_staff_requests_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_statistics: {
        Row: {
          consultations_jour: number | null
          created_at: string | null
          date: string
          establishment_id: string
          hospitalisations_jour: number | null
          id: string
          lits_occupes: number | null
          operations_jour: number | null
          recettes_assurances: number | null
          recettes_cnamgs: number | null
          recettes_especes: number | null
          recettes_jour: number | null
          taux_occupation: number | null
          urgences_jour: number | null
        }
        Insert: {
          consultations_jour?: number | null
          created_at?: string | null
          date: string
          establishment_id: string
          hospitalisations_jour?: number | null
          id?: string
          lits_occupes?: number | null
          operations_jour?: number | null
          recettes_assurances?: number | null
          recettes_cnamgs?: number | null
          recettes_especes?: number | null
          recettes_jour?: number | null
          taux_occupation?: number | null
          urgences_jour?: number | null
        }
        Update: {
          consultations_jour?: number | null
          created_at?: string | null
          date?: string
          establishment_id?: string
          hospitalisations_jour?: number | null
          id?: string
          lits_occupes?: number | null
          operations_jour?: number | null
          recettes_assurances?: number | null
          recettes_cnamgs?: number | null
          recettes_especes?: number | null
          recettes_jour?: number | null
          taux_occupation?: number | null
          urgences_jour?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "establishment_statistics_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_users: {
        Row: {
          actif: boolean | null
          created_at: string | null
          establishment_id: string
          id: string
          permissions: Json | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actif?: boolean | null
          created_at?: string | null
          establishment_id: string
          id?: string
          permissions?: Json | null
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actif?: boolean | null
          created_at?: string | null
          establishment_id?: string
          id?: string
          permissions?: Json | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "establishment_users_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments: {
        Row: {
          account_claimed: boolean | null
          adresse_arrondissement: string | null
          adresse_quartier: string | null
          adresse_rue: string | null
          capital: number | null
          claimed_at: string | null
          claimed_by: string | null
          cnamgs_conventionne: boolean | null
          cnamgs_date_debut: string | null
          cnamgs_date_fin: string | null
          cnamgs_numero_convention: string | null
          cnamgs_tiers_payant_actif: boolean | null
          code_postal: string | null
          created_at: string | null
          date_inscription: string | null
          directeur_general_email: string | null
          directeur_general_nom: string | null
          directeur_general_telephone: string | null
          directeur_medical_nom: string | null
          directeur_medical_numero_ordre: string | null
          email: string | null
          forme_juridique: string | null
          id: string
          invitation_token: string | null
          latitude: number | null
          longitude: number | null
          nombre_avis: number | null
          nombre_blocs_operatoires: number | null
          nombre_lits_total: number | null
          nombre_salles_consultation: number | null
          numero_autorisation: string
          numero_rccm: string | null
          province: string
          raison_sociale: string
          repere_geographique: string | null
          satisfaction_moyenne: number | null
          secteur: Database["public"]["Enums"]["establishment_sector"]
          service_urgences_actif: boolean | null
          site_web: string | null
          statut: Database["public"]["Enums"]["establishment_status"] | null
          taux_occupation: number | null
          telephone_standard: string | null
          telephone_urgences: string | null
          type_etablissement: Database["public"]["Enums"]["establishment_type"]
          updated_at: string | null
          ville: string
          whatsapp_business: string | null
        }
        Insert: {
          account_claimed?: boolean | null
          adresse_arrondissement?: string | null
          adresse_quartier?: string | null
          adresse_rue?: string | null
          capital?: number | null
          claimed_at?: string | null
          claimed_by?: string | null
          cnamgs_conventionne?: boolean | null
          cnamgs_date_debut?: string | null
          cnamgs_date_fin?: string | null
          cnamgs_numero_convention?: string | null
          cnamgs_tiers_payant_actif?: boolean | null
          code_postal?: string | null
          created_at?: string | null
          date_inscription?: string | null
          directeur_general_email?: string | null
          directeur_general_nom?: string | null
          directeur_general_telephone?: string | null
          directeur_medical_nom?: string | null
          directeur_medical_numero_ordre?: string | null
          email?: string | null
          forme_juridique?: string | null
          id?: string
          invitation_token?: string | null
          latitude?: number | null
          longitude?: number | null
          nombre_avis?: number | null
          nombre_blocs_operatoires?: number | null
          nombre_lits_total?: number | null
          nombre_salles_consultation?: number | null
          numero_autorisation: string
          numero_rccm?: string | null
          province: string
          raison_sociale: string
          repere_geographique?: string | null
          satisfaction_moyenne?: number | null
          secteur: Database["public"]["Enums"]["establishment_sector"]
          service_urgences_actif?: boolean | null
          site_web?: string | null
          statut?: Database["public"]["Enums"]["establishment_status"] | null
          taux_occupation?: number | null
          telephone_standard?: string | null
          telephone_urgences?: string | null
          type_etablissement: Database["public"]["Enums"]["establishment_type"]
          updated_at?: string | null
          ville: string
          whatsapp_business?: string | null
        }
        Update: {
          account_claimed?: boolean | null
          adresse_arrondissement?: string | null
          adresse_quartier?: string | null
          adresse_rue?: string | null
          capital?: number | null
          claimed_at?: string | null
          claimed_by?: string | null
          cnamgs_conventionne?: boolean | null
          cnamgs_date_debut?: string | null
          cnamgs_date_fin?: string | null
          cnamgs_numero_convention?: string | null
          cnamgs_tiers_payant_actif?: boolean | null
          code_postal?: string | null
          created_at?: string | null
          date_inscription?: string | null
          directeur_general_email?: string | null
          directeur_general_nom?: string | null
          directeur_general_telephone?: string | null
          directeur_medical_nom?: string | null
          directeur_medical_numero_ordre?: string | null
          email?: string | null
          forme_juridique?: string | null
          id?: string
          invitation_token?: string | null
          latitude?: number | null
          longitude?: number | null
          nombre_avis?: number | null
          nombre_blocs_operatoires?: number | null
          nombre_lits_total?: number | null
          nombre_salles_consultation?: number | null
          numero_autorisation?: string
          numero_rccm?: string | null
          province?: string
          raison_sociale?: string
          repere_geographique?: string | null
          satisfaction_moyenne?: number | null
          secteur?: Database["public"]["Enums"]["establishment_sector"]
          service_urgences_actif?: boolean | null
          site_web?: string | null
          statut?: Database["public"]["Enums"]["establishment_status"] | null
          taux_occupation?: number | null
          telephone_standard?: string | null
          telephone_urgences?: string | null
          type_etablissement?: Database["public"]["Enums"]["establishment_type"]
          updated_at?: string | null
          ville?: string
          whatsapp_business?: string | null
        }
        Relationships: []
      }
      interactions_medicamenteuses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          medicament_a_id: string | null
          medicament_b_id: string | null
          niveau_gravite: string
          recommandation: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          medicament_a_id?: string | null
          medicament_b_id?: string | null
          niveau_gravite: string
          recommandation?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          medicament_a_id?: string | null
          medicament_b_id?: string | null
          niveau_gravite?: string
          recommandation?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interactions_medicamenteuses_medicament_a_id_fkey"
            columns: ["medicament_a_id"]
            isOneToOne: false
            referencedRelation: "medicaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_medicamenteuses_medicament_b_id_fkey"
            columns: ["medicament_b_id"]
            isOneToOne: false
            referencedRelation: "medicaments"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_entries: {
        Row: {
          content: string
          conversations_sources: string[] | null
          created_at: string | null
          id: string
          keywords: string[] | null
          nb_references: number | null
          relevance_score: number | null
          themes: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          conversations_sources?: string[] | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          nb_references?: number | null
          relevance_score?: number | null
          themes?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversations_sources?: string[] | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          nb_references?: number | null
          relevance_score?: number | null
          themes?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      medical_history: {
        Row: {
          condition_name: string
          created_at: string
          diagnosed_date: string | null
          id: string
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          condition_name: string
          created_at?: string
          diagnosed_date?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          condition_name?: string
          created_at?: string
          diagnosed_date?: string | null
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medicaments: {
        Row: {
          classe_therapeutique: string | null
          code_atc: string | null
          code_cip: string | null
          conditionnement: string | null
          date_ajout: string | null
          date_amm: string | null
          date_modification: string | null
          dci: string | null
          dosage: string | null
          est_generique: boolean | null
          famille_pharmacologique: string | null
          forme_pharmaceutique: string | null
          id: string
          image_url: string | null
          laboratoire_fabricant: string | null
          necessite_ordonnance: boolean | null
          nom_commercial: string | null
          notice_url: string | null
          numero_amm: string | null
          pays_origine: string | null
          prix_moyen_pharmacie: number | null
          search_vector: unknown
          statut: string | null
          stupefiant: boolean | null
          substance_controlee: boolean | null
          tarif_conventionne_cnamgs: number | null
          tarif_reference: string | null
          voie_administration: string | null
        }
        Insert: {
          classe_therapeutique?: string | null
          code_atc?: string | null
          code_cip?: string | null
          conditionnement?: string | null
          date_ajout?: string | null
          date_amm?: string | null
          date_modification?: string | null
          dci?: string | null
          dosage?: string | null
          est_generique?: boolean | null
          famille_pharmacologique?: string | null
          forme_pharmaceutique?: string | null
          id?: string
          image_url?: string | null
          laboratoire_fabricant?: string | null
          necessite_ordonnance?: boolean | null
          nom_commercial?: string | null
          notice_url?: string | null
          numero_amm?: string | null
          pays_origine?: string | null
          prix_moyen_pharmacie?: number | null
          search_vector?: unknown
          statut?: string | null
          stupefiant?: boolean | null
          substance_controlee?: boolean | null
          tarif_conventionne_cnamgs?: number | null
          tarif_reference?: string | null
          voie_administration?: string | null
        }
        Update: {
          classe_therapeutique?: string | null
          code_atc?: string | null
          code_cip?: string | null
          conditionnement?: string | null
          date_ajout?: string | null
          date_amm?: string | null
          date_modification?: string | null
          dci?: string | null
          dosage?: string | null
          est_generique?: boolean | null
          famille_pharmacologique?: string | null
          forme_pharmaceutique?: string | null
          id?: string
          image_url?: string | null
          laboratoire_fabricant?: string | null
          necessite_ordonnance?: boolean | null
          nom_commercial?: string | null
          notice_url?: string | null
          numero_amm?: string | null
          pays_origine?: string | null
          prix_moyen_pharmacie?: number | null
          search_vector?: unknown
          statut?: string | null
          stupefiant?: boolean | null
          substance_controlee?: boolean | null
          tarif_conventionne_cnamgs?: number | null
          tarif_reference?: string | null
          voie_administration?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          allow_reply: boolean | null
          attachments: Json | null
          category: string | null
          content: string
          created_at: string | null
          deleted_at: string | null
          id: string
          is_read: boolean | null
          is_starred: boolean | null
          parent_message_id: string | null
          priority: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string | null
          sender_name: string
          sender_type: string
          subject: string
        }
        Insert: {
          allow_reply?: boolean | null
          attachments?: Json | null
          category?: string | null
          content: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          parent_message_id?: string | null
          priority?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id?: string | null
          sender_name: string
          sender_type: string
          subject: string
        }
        Update: {
          allow_reply?: boolean | null
          attachments?: Json | null
          category?: string | null
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_read?: boolean | null
          is_starred?: boolean | null
          parent_message_id?: string | null
          priority?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string | null
          sender_name?: string
          sender_type?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages_iasted: {
        Row: {
          audio_url: string | null
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          audio_url?: string | null
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_iasted_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: string | null
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string | null
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string | null
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      osm_health_providers: {
        Row: {
          adresse_descriptive: string | null
          cnamgs: boolean | null
          cnss: boolean | null
          created_at: string | null
          email: string | null
          horaires: string | null
          id: string
          last_updated: string | null
          latitude: number | null
          longitude: number | null
          nom: string
          nombre_lits: number | null
          osm_id: number
          ouvert_24_7: boolean | null
          province: string
          secteur: string | null
          services: string[] | null
          site_web: string | null
          specialites: string[] | null
          statut_operationnel: string | null
          telephones: string[] | null
          type: string
          ville: string
        }
        Insert: {
          adresse_descriptive?: string | null
          cnamgs?: boolean | null
          cnss?: boolean | null
          created_at?: string | null
          email?: string | null
          horaires?: string | null
          id: string
          last_updated?: string | null
          latitude?: number | null
          longitude?: number | null
          nom: string
          nombre_lits?: number | null
          osm_id: number
          ouvert_24_7?: boolean | null
          province: string
          secteur?: string | null
          services?: string[] | null
          site_web?: string | null
          specialites?: string[] | null
          statut_operationnel?: string | null
          telephones?: string[] | null
          type: string
          ville: string
        }
        Update: {
          adresse_descriptive?: string | null
          cnamgs?: boolean | null
          cnss?: boolean | null
          created_at?: string | null
          email?: string | null
          horaires?: string | null
          id?: string
          last_updated?: string | null
          latitude?: number | null
          longitude?: number | null
          nom?: string
          nombre_lits?: number | null
          osm_id?: number
          ouvert_24_7?: boolean | null
          province?: string
          secteur?: string | null
          services?: string[] | null
          site_web?: string | null
          specialites?: string[] | null
          statut_operationnel?: string | null
          telephones?: string[] | null
          type?: string
          ville?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          config: Json | null
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          type: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          type: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          type?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          appointment_id: string | null
          completed_at: string | null
          created_at: string
          currency: string
          error_message: string | null
          id: string
          patient_id: string
          payment_details: Json | null
          payment_method: string
          professional_id: string
          status: string
          teleconsultation_id: string | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          error_message?: string | null
          id?: string
          patient_id: string
          payment_details?: Json | null
          payment_method: string
          professional_id: string
          status?: string
          teleconsultation_id?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          error_message?: string | null
          id?: string
          patient_id?: string
          payment_details?: Json | null
          payment_method?: string
          professional_id?: string
          status?: string
          teleconsultation_id?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_teleconsultation_id_fkey"
            columns: ["teleconsultation_id"]
            isOneToOne: false
            referencedRelation: "teleconsultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacie_employes: {
        Row: {
          commentaire: string | null
          created_at: string | null
          date_debut: string
          date_fin: string | null
          est_actif: boolean | null
          id: string
          motif_fin: string | null
          nombre_heures_semaine: number | null
          permissions_specifiques: Json | null
          pharmacie_id: string
          professionnel_id: string
          salaire_mensuel: number | null
          type_contrat: string | null
          type_relation: string
          updated_at: string | null
        }
        Insert: {
          commentaire?: string | null
          created_at?: string | null
          date_debut: string
          date_fin?: string | null
          est_actif?: boolean | null
          id?: string
          motif_fin?: string | null
          nombre_heures_semaine?: number | null
          permissions_specifiques?: Json | null
          pharmacie_id: string
          professionnel_id: string
          salaire_mensuel?: number | null
          type_contrat?: string | null
          type_relation: string
          updated_at?: string | null
        }
        Update: {
          commentaire?: string | null
          created_at?: string | null
          date_debut?: string
          date_fin?: string | null
          est_actif?: boolean | null
          id?: string
          motif_fin?: string | null
          nombre_heures_semaine?: number | null
          permissions_specifiques?: Json | null
          pharmacie_id?: string
          professionnel_id?: string
          salaire_mensuel?: number | null
          type_contrat?: string | null
          type_relation?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pharmacie_employes_pharmacie_id_fkey"
            columns: ["pharmacie_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pharmacie_employes_professionnel_id_fkey"
            columns: ["professionnel_id"]
            isOneToOne: false
            referencedRelation: "professionnels_sante_pharmacie"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacies: {
        Row: {
          accepte_commandes_en_ligne: boolean | null
          accepte_reservations: boolean | null
          adresse_complete: string
          autres_assurances_acceptees: Json | null
          capacite_stockage_medicaments: number | null
          code_pharmacie: string
          code_postal: string | null
          conventionnement_cnamgs: boolean | null
          created_at: string | null
          created_by: string | null
          date_autorisation: string | null
          date_inscription_onpg: string | null
          date_verification: string | null
          delai_preparation_moyen_minutes: number | null
          dispose_armoire_securisee: boolean | null
          dispose_balance_electronique: boolean | null
          dispose_chambre_froide: boolean | null
          email: string | null
          enseigne: string | null
          geolocation: unknown
          horaires: Json | null
          id: string
          jours_fermeture: Json | null
          latitude: number
          logo_url: string | null
          longitude: number
          mobile_money_providers: Json | null
          modes_paiement: Json | null
          motif_refus: string | null
          nom_commercial: string
          nombre_avis: number | null
          nombre_commandes_total: number | null
          nombre_employes: number | null
          note_moyenne: number | null
          numero_autorisation_ouverture: string | null
          numero_convention_cnamgs: string | null
          numero_inscription_onpg: string | null
          ouvert_24_7: boolean | null
          pharmacien_titulaire_id: string | null
          photos_pharmacie: Json | null
          province: string
          quartier: string | null
          reperes_geographiques: string | null
          services_disponibles: Json | null
          site_web: string | null
          slug: string
          statut_onpg: string | null
          statut_verification: string | null
          surface_m2: number | null
          telephone_principal: string
          telephone_secondaire: string | null
          telephone_urgence: string | null
          type_structure: string
          updated_at: string | null
          verifie_par_admin: string | null
          ville: string
          visible_plateforme: boolean | null
        }
        Insert: {
          accepte_commandes_en_ligne?: boolean | null
          accepte_reservations?: boolean | null
          adresse_complete: string
          autres_assurances_acceptees?: Json | null
          capacite_stockage_medicaments?: number | null
          code_pharmacie: string
          code_postal?: string | null
          conventionnement_cnamgs?: boolean | null
          created_at?: string | null
          created_by?: string | null
          date_autorisation?: string | null
          date_inscription_onpg?: string | null
          date_verification?: string | null
          delai_preparation_moyen_minutes?: number | null
          dispose_armoire_securisee?: boolean | null
          dispose_balance_electronique?: boolean | null
          dispose_chambre_froide?: boolean | null
          email?: string | null
          enseigne?: string | null
          geolocation?: unknown
          horaires?: Json | null
          id?: string
          jours_fermeture?: Json | null
          latitude: number
          logo_url?: string | null
          longitude: number
          mobile_money_providers?: Json | null
          modes_paiement?: Json | null
          motif_refus?: string | null
          nom_commercial: string
          nombre_avis?: number | null
          nombre_commandes_total?: number | null
          nombre_employes?: number | null
          note_moyenne?: number | null
          numero_autorisation_ouverture?: string | null
          numero_convention_cnamgs?: string | null
          numero_inscription_onpg?: string | null
          ouvert_24_7?: boolean | null
          pharmacien_titulaire_id?: string | null
          photos_pharmacie?: Json | null
          province: string
          quartier?: string | null
          reperes_geographiques?: string | null
          services_disponibles?: Json | null
          site_web?: string | null
          slug: string
          statut_onpg?: string | null
          statut_verification?: string | null
          surface_m2?: number | null
          telephone_principal: string
          telephone_secondaire?: string | null
          telephone_urgence?: string | null
          type_structure: string
          updated_at?: string | null
          verifie_par_admin?: string | null
          ville: string
          visible_plateforme?: boolean | null
        }
        Update: {
          accepte_commandes_en_ligne?: boolean | null
          accepte_reservations?: boolean | null
          adresse_complete?: string
          autres_assurances_acceptees?: Json | null
          capacite_stockage_medicaments?: number | null
          code_pharmacie?: string
          code_postal?: string | null
          conventionnement_cnamgs?: boolean | null
          created_at?: string | null
          created_by?: string | null
          date_autorisation?: string | null
          date_inscription_onpg?: string | null
          date_verification?: string | null
          delai_preparation_moyen_minutes?: number | null
          dispose_armoire_securisee?: boolean | null
          dispose_balance_electronique?: boolean | null
          dispose_chambre_froide?: boolean | null
          email?: string | null
          enseigne?: string | null
          geolocation?: unknown
          horaires?: Json | null
          id?: string
          jours_fermeture?: Json | null
          latitude?: number
          logo_url?: string | null
          longitude?: number
          mobile_money_providers?: Json | null
          modes_paiement?: Json | null
          motif_refus?: string | null
          nom_commercial?: string
          nombre_avis?: number | null
          nombre_commandes_total?: number | null
          nombre_employes?: number | null
          note_moyenne?: number | null
          numero_autorisation_ouverture?: string | null
          numero_convention_cnamgs?: string | null
          numero_inscription_onpg?: string | null
          ouvert_24_7?: boolean | null
          pharmacien_titulaire_id?: string | null
          photos_pharmacie?: Json | null
          province?: string
          quartier?: string | null
          reperes_geographiques?: string | null
          services_disponibles?: Json | null
          site_web?: string | null
          slug?: string
          statut_onpg?: string | null
          statut_verification?: string | null
          surface_m2?: number | null
          telephone_principal?: string
          telephone_secondaire?: string | null
          telephone_urgence?: string | null
          type_structure?: string
          updated_at?: string | null
          verifie_par_admin?: string | null
          ville?: string
          visible_plateforme?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_pharmacies_titulaire"
            columns: ["pharmacien_titulaire_id"]
            isOneToOne: false
            referencedRelation: "professionnels_sante_pharmacie"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_locations: {
        Row: {
          address: string
          arrondissement: string | null
          city: string
          created_at: string
          email: string | null
          geographical_landmark: string | null
          id: string
          is_primary: boolean | null
          latitude: number | null
          location_type: Database["public"]["Enums"]["practice_location_type"]
          longitude: number | null
          name: string
          opening_hours: Json | null
          phone: string | null
          professional_id: string
          province: string
          quartier: string | null
          updated_at: string
        }
        Insert: {
          address: string
          arrondissement?: string | null
          city: string
          created_at?: string
          email?: string | null
          geographical_landmark?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          location_type: Database["public"]["Enums"]["practice_location_type"]
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          phone?: string | null
          professional_id: string
          province: string
          quartier?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          arrondissement?: string | null
          city?: string
          created_at?: string
          email?: string | null
          geographical_landmark?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          location_type?: Database["public"]["Enums"]["practice_location_type"]
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          professional_id?: string
          province?: string
          quartier?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_locations_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_pharmacy_log: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          pharmacy_id: string
          prescription_id: string
          sent_at: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          pharmacy_id: string
          prescription_id: string
          sent_at?: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          pharmacy_id?: string
          prescription_id?: string
          sent_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_pharmacy_log_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescription_pharmacy_log_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "electronic_prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_pharmacy_requests: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          pharmacy_id: string
          prescription_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          pharmacy_id: string
          prescription_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          pharmacy_id?: string
          prescription_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      professional_availability: {
        Row: {
          created_at: string
          day_of_week: number
          id: string
          professional_id: string
          time_slots: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          id?: string
          professional_id: string
          time_slots: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          id?: string
          professional_id?: string
          time_slots?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_availability_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_conventions: {
        Row: {
          convention_number: string | null
          created_at: string
          end_date: string | null
          id: string
          organization: string
          professional_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["convention_status"]
          tiers_payant_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          convention_number?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          organization: string
          professional_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["convention_status"]
          tiers_payant_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          convention_number?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          organization?: string
          professional_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["convention_status"]
          tiers_payant_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_conventions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_diplomas: {
        Row: {
          country: string
          created_at: string
          document_url: string | null
          id: string
          institution: string
          professional_id: string
          specialty: string | null
          title: string
          updated_at: string
          verification_notes: string | null
          verification_status: string | null
          verified: boolean | null
          year_obtained: number
        }
        Insert: {
          country: string
          created_at?: string
          document_url?: string | null
          id?: string
          institution: string
          professional_id: string
          specialty?: string | null
          title: string
          updated_at?: string
          verification_notes?: string | null
          verification_status?: string | null
          verified?: boolean | null
          year_obtained: number
        }
        Update: {
          country?: string
          created_at?: string
          document_url?: string | null
          id?: string
          institution?: string
          professional_id?: string
          specialty?: string | null
          title?: string
          updated_at?: string
          verification_notes?: string | null
          verification_status?: string | null
          verified?: boolean | null
          year_obtained?: number
        }
        Relationships: [
          {
            foreignKeyName: "professional_diplomas_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_leaves: {
        Row: {
          created_at: string
          end_date: string
          id: string
          professional_id: string
          reason: string | null
          replacement_professional_id: string | null
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          professional_id: string
          reason?: string | null
          replacement_professional_id?: string | null
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          professional_id?: string
          reason?: string | null
          replacement_professional_id?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_leaves_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professional_leaves_replacement_professional_id_fkey"
            columns: ["replacement_professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_profiles: {
        Row: {
          bio: string | null
          consultation_fee: number | null
          created_at: string | null
          diplomas: Json | null
          id: string
          ordre_number: string | null
          ordre_verified: boolean | null
          profession_type: string
          specialization: string | null
          updated_at: string | null
          user_id: string
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          diplomas?: Json | null
          id?: string
          ordre_number?: string | null
          ordre_verified?: boolean | null
          profession_type: string
          specialization?: string | null
          updated_at?: string | null
          user_id: string
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          diplomas?: Json | null
          id?: string
          ordre_number?: string | null
          ordre_verified?: boolean | null
          profession_type?: string
          specialization?: string | null
          updated_at?: string | null
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_services: {
        Row: {
          available: boolean | null
          conventional_price: number | null
          created_at: string
          duration_minutes: number
          id: string
          normal_price: number
          professional_id: string
          service_name: string
          service_type: Database["public"]["Enums"]["consultation_type_enum"]
          updated_at: string
        }
        Insert: {
          available?: boolean | null
          conventional_price?: number | null
          created_at?: string
          duration_minutes?: number
          id?: string
          normal_price: number
          professional_id: string
          service_name: string
          service_type: Database["public"]["Enums"]["consultation_type_enum"]
          updated_at?: string
        }
        Update: {
          available?: boolean | null
          conventional_price?: number | null
          created_at?: string
          duration_minutes?: number
          id?: string
          normal_price?: number
          professional_id?: string
          service_name?: string
          service_type?: Database["public"]["Enums"]["consultation_type_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_services_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_statistics: {
        Row: {
          average_rating: number | null
          cash_revenue: number | null
          cnamgs_revenue: number | null
          created_at: string
          home_visits: number | null
          id: string
          mobile_money_revenue: number | null
          period_month: number
          period_year: number
          professional_id: string
          punctuality_rate: number | null
          teleconsultations: number | null
          total_consultations: number | null
          total_revenue: number | null
          total_reviews: number | null
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          cash_revenue?: number | null
          cnamgs_revenue?: number | null
          created_at?: string
          home_visits?: number | null
          id?: string
          mobile_money_revenue?: number | null
          period_month: number
          period_year: number
          professional_id: string
          punctuality_rate?: number | null
          teleconsultations?: number | null
          total_consultations?: number | null
          total_revenue?: number | null
          total_reviews?: number | null
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          cash_revenue?: number | null
          cnamgs_revenue?: number | null
          created_at?: string
          home_visits?: number | null
          id?: string
          mobile_money_revenue?: number | null
          period_month?: number
          period_year?: number
          professional_id?: string
          punctuality_rate?: number | null
          teleconsultations?: number | null
          total_consultations?: number | null
          total_revenue?: number | null
          total_reviews?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_statistics_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_trainings: {
        Row: {
          certificate_url: string | null
          created_at: string
          date: string
          duration_hours: number | null
          id: string
          organizer: string
          professional_id: string
          title: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string
          date: string
          duration_hours?: number | null
          id?: string
          organizer: string
          professional_id: string
          title: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string
          date?: string
          duration_hours?: number | null
          id?: string
          organizer?: string
          professional_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_trainings_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          bio: string | null
          birth_date: string | null
          consultation_fee: number | null
          created_at: string
          diplomas: Json | null
          documents_verified: boolean | null
          email: string
          emergency_phone: string | null
          full_name: string
          gender: string | null
          id: string
          last_activity: string | null
          missing_documents: string[] | null
          nationality: string | null
          numero_ordre: string | null
          ordre_verified: boolean | null
          phone: string
          photo_url: string | null
          profession_type: string | null
          professional_type: Database["public"]["Enums"]["professional_type"]
          specialization: string | null
          status: Database["public"]["Enums"]["professional_status"]
          title: string | null
          updated_at: string
          user_id: string
          verification_date: string | null
          verified: boolean | null
          whatsapp_phone: string | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          birth_date?: string | null
          consultation_fee?: number | null
          created_at?: string
          diplomas?: Json | null
          documents_verified?: boolean | null
          email: string
          emergency_phone?: string | null
          full_name: string
          gender?: string | null
          id?: string
          last_activity?: string | null
          missing_documents?: string[] | null
          nationality?: string | null
          numero_ordre?: string | null
          ordre_verified?: boolean | null
          phone: string
          photo_url?: string | null
          profession_type?: string | null
          professional_type: Database["public"]["Enums"]["professional_type"]
          specialization?: string | null
          status?: Database["public"]["Enums"]["professional_status"]
          title?: string | null
          updated_at?: string
          user_id: string
          verification_date?: string | null
          verified?: boolean | null
          whatsapp_phone?: string | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          birth_date?: string | null
          consultation_fee?: number | null
          created_at?: string
          diplomas?: Json | null
          documents_verified?: boolean | null
          email?: string
          emergency_phone?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          last_activity?: string | null
          missing_documents?: string[] | null
          nationality?: string | null
          numero_ordre?: string | null
          ordre_verified?: boolean | null
          phone?: string
          photo_url?: string | null
          profession_type?: string | null
          professional_type?: Database["public"]["Enums"]["professional_type"]
          specialization?: string | null
          status?: Database["public"]["Enums"]["professional_status"]
          title?: string | null
          updated_at?: string
          user_id?: string
          verification_date?: string | null
          verified?: boolean | null
          whatsapp_phone?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      professionnels_sante_pharmacie: {
        Row: {
          acces_administration: boolean | null
          acces_facturation: boolean | null
          acces_gestion_stocks: boolean | null
          acces_rapports_activite: boolean | null
          adresse_personnelle: string | null
          annee_obtention_diplome: number | null
          annees_experience: number | null
          autorite_delivrance: string | null
          certificat_formation_url: string | null
          certificat_nationalite_url: string | null
          code_professionnel: string
          compte_actif: boolean | null
          copie_carte_onpg_url: string | null
          copie_cni_url: string | null
          copie_diplome_url: string | null
          created_at: string | null
          created_by: string | null
          date_autorisation_exercice: string | null
          date_desactivation: string | null
          date_embauche: string | null
          date_fin_contrat: string | null
          date_inscription_onpg: string | null
          date_naissance: string | null
          date_verification: string | null
          derniere_connexion: string | null
          diplome_pharmacie: string | null
          email_professionnel: string
          est_pharmacien_titulaire: boolean | null
          extrait_casier_judiciaire_url: string | null
          formation_professionnelle: string | null
          id: string
          lieu_naissance: string | null
          motif_desactivation: string | null
          motif_refus: string | null
          nationalite: string
          niveau_etude: string | null
          nom: string
          nom_complet: string | null
          nombre_dispensations: number | null
          nombre_evaluations: number | null
          nombre_validations_ordonnances: number | null
          note_moyenne: number | null
          numero_autorisation_exercice: string | null
          numero_inscription_onpg: string | null
          pays_obtention_diplome: string | null
          permissions: Json | null
          pharmacie_principale_id: string | null
          pharmacies_secondaires: Json | null
          photo_url: string | null
          prenom: string
          sexe: string | null
          specialisation: string | null
          statut_emploi: string
          statut_onpg: string | null
          statut_verification: string | null
          supervise_par_pharmacien_id: string | null
          telephone_fixe: string | null
          telephone_mobile: string
          type_professionnel: string
          universite: string | null
          updated_at: string | null
          user_id: string
          verifie_par_admin: string | null
          ville_residence: string | null
        }
        Insert: {
          acces_administration?: boolean | null
          acces_facturation?: boolean | null
          acces_gestion_stocks?: boolean | null
          acces_rapports_activite?: boolean | null
          adresse_personnelle?: string | null
          annee_obtention_diplome?: number | null
          annees_experience?: number | null
          autorite_delivrance?: string | null
          certificat_formation_url?: string | null
          certificat_nationalite_url?: string | null
          code_professionnel: string
          compte_actif?: boolean | null
          copie_carte_onpg_url?: string | null
          copie_cni_url?: string | null
          copie_diplome_url?: string | null
          created_at?: string | null
          created_by?: string | null
          date_autorisation_exercice?: string | null
          date_desactivation?: string | null
          date_embauche?: string | null
          date_fin_contrat?: string | null
          date_inscription_onpg?: string | null
          date_naissance?: string | null
          date_verification?: string | null
          derniere_connexion?: string | null
          diplome_pharmacie?: string | null
          email_professionnel: string
          est_pharmacien_titulaire?: boolean | null
          extrait_casier_judiciaire_url?: string | null
          formation_professionnelle?: string | null
          id?: string
          lieu_naissance?: string | null
          motif_desactivation?: string | null
          motif_refus?: string | null
          nationalite: string
          niveau_etude?: string | null
          nom: string
          nom_complet?: string | null
          nombre_dispensations?: number | null
          nombre_evaluations?: number | null
          nombre_validations_ordonnances?: number | null
          note_moyenne?: number | null
          numero_autorisation_exercice?: string | null
          numero_inscription_onpg?: string | null
          pays_obtention_diplome?: string | null
          permissions?: Json | null
          pharmacie_principale_id?: string | null
          pharmacies_secondaires?: Json | null
          photo_url?: string | null
          prenom: string
          sexe?: string | null
          specialisation?: string | null
          statut_emploi: string
          statut_onpg?: string | null
          statut_verification?: string | null
          supervise_par_pharmacien_id?: string | null
          telephone_fixe?: string | null
          telephone_mobile: string
          type_professionnel: string
          universite?: string | null
          updated_at?: string | null
          user_id: string
          verifie_par_admin?: string | null
          ville_residence?: string | null
        }
        Update: {
          acces_administration?: boolean | null
          acces_facturation?: boolean | null
          acces_gestion_stocks?: boolean | null
          acces_rapports_activite?: boolean | null
          adresse_personnelle?: string | null
          annee_obtention_diplome?: number | null
          annees_experience?: number | null
          autorite_delivrance?: string | null
          certificat_formation_url?: string | null
          certificat_nationalite_url?: string | null
          code_professionnel?: string
          compte_actif?: boolean | null
          copie_carte_onpg_url?: string | null
          copie_cni_url?: string | null
          copie_diplome_url?: string | null
          created_at?: string | null
          created_by?: string | null
          date_autorisation_exercice?: string | null
          date_desactivation?: string | null
          date_embauche?: string | null
          date_fin_contrat?: string | null
          date_inscription_onpg?: string | null
          date_naissance?: string | null
          date_verification?: string | null
          derniere_connexion?: string | null
          diplome_pharmacie?: string | null
          email_professionnel?: string
          est_pharmacien_titulaire?: boolean | null
          extrait_casier_judiciaire_url?: string | null
          formation_professionnelle?: string | null
          id?: string
          lieu_naissance?: string | null
          motif_desactivation?: string | null
          motif_refus?: string | null
          nationalite?: string
          niveau_etude?: string | null
          nom?: string
          nom_complet?: string | null
          nombre_dispensations?: number | null
          nombre_evaluations?: number | null
          nombre_validations_ordonnances?: number | null
          note_moyenne?: number | null
          numero_autorisation_exercice?: string | null
          numero_inscription_onpg?: string | null
          pays_obtention_diplome?: string | null
          permissions?: Json | null
          pharmacie_principale_id?: string | null
          pharmacies_secondaires?: Json | null
          photo_url?: string | null
          prenom?: string
          sexe?: string | null
          specialisation?: string | null
          statut_emploi?: string
          statut_onpg?: string | null
          statut_verification?: string | null
          supervise_par_pharmacien_id?: string | null
          telephone_fixe?: string | null
          telephone_mobile?: string
          type_professionnel?: string
          universite?: string | null
          updated_at?: string | null
          user_id?: string
          verifie_par_admin?: string | null
          ville_residence?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionnels_sante_pharmacie_pharmacie_principale_id_fkey"
            columns: ["pharmacie_principale_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "professionnels_sante_pharmacie_supervise_par_pharmacien_id_fkey"
            columns: ["supervise_par_pharmacien_id"]
            isOneToOne: false
            referencedRelation: "professionnels_sante_pharmacie"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_change_requests: {
        Row: {
          change_type: string
          created_at: string
          current_data: Json
          id: string
          rejection_reason: string | null
          requested_data: Json
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          change_type: string
          created_at?: string
          current_data: Json
          id?: string
          rejection_reason?: string | null
          requested_data: Json
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          change_type?: string
          created_at?: string
          current_data?: Json
          id?: string
          rejection_reason?: string | null
          requested_data?: Json
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          birth_place: string | null
          blood_group: string | null
          city: string | null
          cnamgs_number: string | null
          created_at: string
          email: string | null
          full_name: string
          gender: string | null
          height_m: number | null
          id: string
          language: string | null
          neighborhood: string | null
          notification_email: boolean | null
          notification_push: boolean | null
          notification_sms: boolean | null
          phone: string
          profile_type: string | null
          profile_visibility: string | null
          province: string | null
          theme: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          birth_place?: string | null
          blood_group?: string | null
          city?: string | null
          cnamgs_number?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          gender?: string | null
          height_m?: number | null
          id: string
          language?: string | null
          neighborhood?: string | null
          notification_email?: boolean | null
          notification_push?: boolean | null
          notification_sms?: boolean | null
          phone: string
          profile_type?: string | null
          profile_visibility?: string | null
          province?: string | null
          theme?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          birth_place?: string | null
          blood_group?: string | null
          city?: string | null
          cnamgs_number?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          gender?: string | null
          height_m?: number | null
          id?: string
          language?: string | null
          neighborhood?: string | null
          notification_email?: boolean | null
          notification_push?: boolean | null
          notification_sms?: boolean | null
          phone?: string
          profile_type?: string | null
          profile_visibility?: string | null
          province?: string | null
          theme?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      stocks_pharmacie: {
        Row: {
          created_at: string | null
          derniere_mise_a_jour: string | null
          id: string
          medicament_id: string | null
          pharmacie_id: string | null
          prix_vente: number | null
          quantite_disponible: number | null
          seuil_alerte: number | null
        }
        Insert: {
          created_at?: string | null
          derniere_mise_a_jour?: string | null
          id?: string
          medicament_id?: string | null
          pharmacie_id?: string | null
          prix_vente?: number | null
          quantite_disponible?: number | null
          seuil_alerte?: number | null
        }
        Update: {
          created_at?: string | null
          derniere_mise_a_jour?: string | null
          id?: string
          medicament_id?: string | null
          pharmacie_id?: string | null
          prix_vente?: number | null
          quantite_disponible?: number | null
          seuil_alerte?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stocks_pharmacie_medicament_id_fkey"
            columns: ["medicament_id"]
            isOneToOne: false
            referencedRelation: "medicaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stocks_pharmacie_pharmacie_id_fkey"
            columns: ["pharmacie_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category: string
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      teleconsultation_sessions: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          notes: string | null
          patient_id: string
          professional_id: string
          recording_url: string | null
          room_id: string | null
          session_type: string
          start_time: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          professional_id: string
          recording_url?: string | null
          room_id?: string | null
          session_type?: string
          start_time?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          professional_id?: string
          recording_url?: string | null
          room_id?: string | null
          session_type?: string
          start_time?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teleconsultation_sessions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teleconsultation_sessions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          created_at: string
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          medication_name: string
          notes: string | null
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          medication_name: string
          notes?: string | null
          start_date: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          medication_name?: string
          notes?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          elevenlabs_model: string | null
          elevenlabs_voice_id: string | null
          id: string
          updated_at: string | null
          user_id: string
          voice_focus_mode: boolean | null
        }
        Insert: {
          created_at?: string | null
          elevenlabs_model?: string | null
          elevenlabs_voice_id?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          voice_focus_mode?: boolean | null
        }
        Update: {
          created_at?: string | null
          elevenlabs_model?: string | null
          elevenlabs_voice_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          voice_focus_mode?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      admin_get_professionals_with_profiles: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          ordre_number: string
          ordre_verified: boolean
          phone: string
          profession_type: string
          specialization: string
          user_id: string
        }[]
      }
      assign_user_role: {
        Args: {
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: undefined
      }
      claim_establishment_account: {
        Args: { _token: string; _user_id: string }
        Returns: string
      }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
      dropgeometrytable:
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      generate_establishment_invitation_token: {
        Args: { _establishment_id: string }
        Returns: string
      }
      generate_pharmacy_slug: {
        Args: { pharmacy_id: string; pharmacy_name: string }
        Returns: string
      }
      generate_prescription_number: { Args: never; Returns: string }
      generate_prescription_qr_data: {
        Args: { prescription_id: string }
        Returns: string
      }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_medicament_enriched: {
        Args: { p_medicament_id: string; p_pharmacie_id?: string }
        Returns: Json
      }
      get_professional_context: {
        Args: { _establishment_id: string; _user_id: string }
        Returns: {
          department: string
          establishment_id: string
          establishment_name: string
          is_admin: boolean
          is_department_head: boolean
          job_position: string
          matricule: string
          permissions: string[]
          professional_email: string
          professional_id: string
          professional_matricule: string
          professional_name: string
          professional_phone: string
          professional_photo_url: string
          professional_specialization: string
          role_in_establishment: string
          status: string
        }[]
      }
      get_professional_establishments: {
        Args: { _user_id: string }
        Returns: {
          department: string
          establishment_id: string
          establishment_name: string
          establishment_type: string
          is_admin: boolean
          job_position: string
          permissions: string[]
          role_in_establishment: string
          staff_id: string
          status: string
        }[]
      }
      get_user_establishments: {
        Args: { _user_id: string }
        Returns: {
          establishment_id: string
          establishment_name: string
          is_admin: boolean
          permissions: string[]
          role_in_establishment: string
          status: string
        }[]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      gettransactionid: { Args: never; Returns: unknown }
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
          _user_id: string
        }
        Returns: boolean
      }
      has_permission: {
        Args: {
          _establishment_id: string
          _permission: string
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_establishment_admin: {
        Args: { _establishment_id: string; _user_id: string }
        Returns: boolean
      }
      is_super_admin: { Args: never; Returns: boolean }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { use_typmod?: boolean }; Returns: string }
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      search_medicaments: {
        Args: { p_limit?: number; p_query: string }
        Returns: {
          classe_therapeutique: string
          dci: string
          dosage: string
          est_generique: boolean
          forme_pharmaceutique: string
          id: string
          image_url: string
          necessite_ordonnance: boolean
          nom_commercial: string
          prix_moyen_pharmacie: number
          tarif_conventionne_cnamgs: number
        }[]
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_askml:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geom: unknown }; Returns: number }
        | { Args: { geog: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "moderator"
        | "patient"
        | "doctor"
        | "medical_staff"
        | "pharmacy"
        | "laboratory"
        | "hospital"
        | "establishment_admin"
      consultation_type_enum:
        | "cabinet"
        | "teleconsultation"
        | "visite_domicile"
        | "urgence"
      convention_status:
        | "non_conventionne"
        | "en_cours"
        | "conventionne"
        | "suspendu"
        | "expire"
      establishment_sector:
        | "public"
        | "prive"
        | "confessionnel"
        | "militaire"
        | "parapublic"
      establishment_status:
        | "actif"
        | "suspendu"
        | "en_maintenance"
        | "en_validation"
      establishment_type:
        | "chu"
        | "chr"
        | "polyclinique"
        | "clinique"
        | "centre_medical"
        | "hopital_departemental"
        | "hopital_confessionnel"
      permission_type:
        | "view_dmp"
        | "edit_dmp"
        | "consultation"
        | "prescription"
        | "order_lab_test"
        | "view_lab_results"
        | "validate_lab_results"
        | "admit_patient"
        | "discharge_patient"
        | "emergency_access"
        | "triage"
        | "manage_appointments"
        | "manage_staff"
        | "view_analytics"
        | "manage_billing"
        | "dispense_medication"
        | "manage_stock"
        | "manage_services"
        | "manage_schedule"
        | "all"
      practice_location_type:
        | "cabinet_prive"
        | "hopital_public"
        | "clinique_privee"
        | "centre_sante"
        | "domicile"
      professional_status:
        | "en_validation"
        | "actif"
        | "suspendu"
        | "inactif"
        | "rejete"
      professional_type:
        | "medecin_generaliste"
        | "medecin_specialiste"
        | "infirmier"
        | "ipa"
        | "dentiste"
        | "sage_femme"
        | "pharmacien"
        | "psychologue"
        | "kinesitherapeute"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "moderator",
        "patient",
        "doctor",
        "medical_staff",
        "pharmacy",
        "laboratory",
        "hospital",
        "establishment_admin",
      ],
      consultation_type_enum: [
        "cabinet",
        "teleconsultation",
        "visite_domicile",
        "urgence",
      ],
      convention_status: [
        "non_conventionne",
        "en_cours",
        "conventionne",
        "suspendu",
        "expire",
      ],
      establishment_sector: [
        "public",
        "prive",
        "confessionnel",
        "militaire",
        "parapublic",
      ],
      establishment_status: [
        "actif",
        "suspendu",
        "en_maintenance",
        "en_validation",
      ],
      establishment_type: [
        "chu",
        "chr",
        "polyclinique",
        "clinique",
        "centre_medical",
        "hopital_departemental",
        "hopital_confessionnel",
      ],
      permission_type: [
        "view_dmp",
        "edit_dmp",
        "consultation",
        "prescription",
        "order_lab_test",
        "view_lab_results",
        "validate_lab_results",
        "admit_patient",
        "discharge_patient",
        "emergency_access",
        "triage",
        "manage_appointments",
        "manage_staff",
        "view_analytics",
        "manage_billing",
        "dispense_medication",
        "manage_stock",
        "manage_services",
        "manage_schedule",
        "all",
      ],
      practice_location_type: [
        "cabinet_prive",
        "hopital_public",
        "clinique_privee",
        "centre_sante",
        "domicile",
      ],
      professional_status: [
        "en_validation",
        "actif",
        "suspendu",
        "inactif",
        "rejete",
      ],
      professional_type: [
        "medecin_generaliste",
        "medecin_specialiste",
        "infirmier",
        "ipa",
        "dentiste",
        "sage_femme",
        "pharmacien",
        "psychologue",
        "kinesitherapeute",
      ],
    },
  },
} as const
