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
    },
  },
} as const
