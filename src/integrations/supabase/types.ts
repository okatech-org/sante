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
      electronic_prescriptions: {
        Row: {
          additional_notes: string | null
          consultation_id: string | null
          created_at: string | null
          diagnosis: string | null
          dispensed_at: string | null
          expiry_date: string | null
          id: string
          issued_date: string
          medications: Json
          patient_id: string
          prescription_number: string
          professional_id: string
          qr_code_data: string | null
          sent_at: string | null
          sent_to_pharmacy_id: string | null
          signature_data: string | null
          status: string
          teleconsultation_id: string | null
          updated_at: string | null
        }
        Insert: {
          additional_notes?: string | null
          consultation_id?: string | null
          created_at?: string | null
          diagnosis?: string | null
          dispensed_at?: string | null
          expiry_date?: string | null
          id?: string
          issued_date?: string
          medications: Json
          patient_id: string
          prescription_number: string
          professional_id: string
          qr_code_data?: string | null
          sent_at?: string | null
          sent_to_pharmacy_id?: string | null
          signature_data?: string | null
          status?: string
          teleconsultation_id?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_notes?: string | null
          consultation_id?: string | null
          created_at?: string | null
          diagnosis?: string | null
          dispensed_at?: string | null
          expiry_date?: string | null
          id?: string
          issued_date?: string
          medications?: Json
          patient_id?: string
          prescription_number?: string
          professional_id?: string
          qr_code_data?: string | null
          sent_at?: string | null
          sent_to_pharmacy_id?: string | null
          signature_data?: string | null
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
            foreignKeyName: "electronic_prescriptions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "electronic_prescriptions_sent_to_pharmacy_id_fkey"
            columns: ["sent_to_pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
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
          end_date: string | null
          establishment_id: string
          id: string
          is_admin: boolean | null
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
          end_date?: string | null
          establishment_id: string
          id?: string
          is_admin?: boolean | null
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
          end_date?: string | null
          establishment_id?: string
          id?: string
          is_admin?: boolean | null
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
            referencedRelation: "professional_profiles"
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
          adresse_arrondissement: string | null
          adresse_quartier: string | null
          adresse_rue: string | null
          capital: number | null
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
          adresse_arrondissement?: string | null
          adresse_quartier?: string | null
          adresse_rue?: string | null
          capital?: number | null
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
          adresse_arrondissement?: string | null
          adresse_quartier?: string | null
          adresse_rue?: string | null
          capital?: number | null
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
      pharmacies: {
        Row: {
          address: string
          city: string
          created_at: string | null
          email: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          opening_hours: Json | null
          phone: string | null
          province: string
          services: string[] | null
          updated_at: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_hours?: Json | null
          phone?: string | null
          province: string
          services?: string[] | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          province?: string
          services?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "prescription_pharmacy_requests_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
        ]
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
          birth_date: string | null
          created_at: string
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
          phone: string
          photo_url: string | null
          professional_type: Database["public"]["Enums"]["professional_type"]
          status: Database["public"]["Enums"]["professional_status"]
          title: string | null
          updated_at: string
          user_id: string
          verification_date: string | null
          verified: boolean | null
          whatsapp_phone: string | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
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
          phone: string
          photo_url?: string | null
          professional_type: Database["public"]["Enums"]["professional_type"]
          status?: Database["public"]["Enums"]["professional_status"]
          title?: string | null
          updated_at?: string
          user_id: string
          verification_date?: string | null
          verified?: boolean | null
          whatsapp_phone?: string | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
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
          phone?: string
          photo_url?: string | null
          professional_type?: Database["public"]["Enums"]["professional_type"]
          status?: Database["public"]["Enums"]["professional_status"]
          title?: string | null
          updated_at?: string
          user_id?: string
          verification_date?: string | null
          verified?: boolean | null
          whatsapp_phone?: string | null
        }
        Relationships: []
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
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: {
          new_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: undefined
      }
      generate_prescription_number: {
        Args: Record<PropertyKey, never>
        Returns: string
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
      has_any_role: {
        Args: {
          _roles: Database["public"]["Enums"]["app_role"][]
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
      [_ in never]: never
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
