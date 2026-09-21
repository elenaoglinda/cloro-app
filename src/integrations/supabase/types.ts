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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clientes: {
        Row: {
          archived: boolean
          created_at: string
          direccion: string | null
          email: string | null
          id: string
          nombre: string
          notas: string | null
          org_id: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          archived?: boolean
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nombre: string
          notas?: string | null
          org_id: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          archived?: boolean
          created_at?: string
          direccion?: string | null
          email?: string | null
          id?: string
          nombre?: string
          notas?: string | null
          org_id?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      org_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          org_id: string
          role: Database["public"]["Enums"]["org_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          org_id: string
          role?: Database["public"]["Enums"]["org_role"]
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          org_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          token?: string
        }
        Relationships: []
      }
      org_members: {
        Row: {
          created_at: string
          org_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          org_id: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          org_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          plan: string
          slug: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          suspended: boolean
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          plan?: string
          slug: string
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          suspended?: boolean
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          plan?: string
          slug?: string
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          suspended?: boolean
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      parte_fotos: {
        Row: {
          created_at: string
          id: string
          org_id: string
          parte_id: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          parte_id: string
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          parte_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "parte_fotos_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parte_fotos_parte_id_fkey"
            columns: ["parte_id"]
            isOneToOne: false
            referencedRelation: "partes"
            referencedColumns: ["id"]
          },
        ]
      }
      partes: {
        Row: {
          adjunto_laboratorio_url: string | null
          alcalinidad: number | null
          bromo_total: number | null
          cloro_libre: number | null
          cloro_total: number | null
          created_at: string
          cya: number | null
          ecoli: boolean | null
          estado: Database["public"]["Enums"]["parte_estado"]
          fecha: string
          firma_cliente_url: string | null
          hora_medicion: string | null
          id: string
          observaciones: string | null
          org_id: string
          ph: number | null
          piscina_id: string
          productos_usados: Json
          pseudomonas: boolean | null
          redox: number | null
          sal: number | null
          tecnico_id: string | null
          temp_c: number | null
          tiempo_recirculacion: number | null
          tipo_control: string
          transparencia_fondo: boolean | null
          turbidez: number | null
          updated_at: string
        }
        Insert: {
          adjunto_laboratorio_url?: string | null
          alcalinidad?: number | null
          bromo_total?: number | null
          cloro_libre?: number | null
          cloro_total?: number | null
          created_at?: string
          cya?: number | null
          ecoli?: boolean | null
          estado?: Database["public"]["Enums"]["parte_estado"]
          fecha?: string
          firma_cliente_url?: string | null
          hora_medicion?: string | null
          id?: string
          observaciones?: string | null
          org_id: string
          ph?: number | null
          piscina_id: string
          productos_usados?: Json
          pseudomonas?: boolean | null
          redox?: number | null
          sal?: number | null
          tecnico_id?: string | null
          temp_c?: number | null
          tiempo_recirculacion?: number | null
          tipo_control?: string
          transparencia_fondo?: boolean | null
          turbidez?: number | null
          updated_at?: string
        }
        Update: {
          adjunto_laboratorio_url?: string | null
          alcalinidad?: number | null
          bromo_total?: number | null
          cloro_libre?: number | null
          cloro_total?: number | null
          created_at?: string
          cya?: number | null
          ecoli?: boolean | null
          estado?: Database["public"]["Enums"]["parte_estado"]
          fecha?: string
          firma_cliente_url?: string | null
          hora_medicion?: string | null
          id?: string
          observaciones?: string | null
          org_id?: string
          ph?: number | null
          piscina_id?: string
          productos_usados?: Json
          pseudomonas?: boolean | null
          redox?: number | null
          sal?: number | null
          tecnico_id?: string | null
          temp_c?: number | null
          tiempo_recirculacion?: number | null
          tipo_control?: string
          transparencia_fondo?: boolean | null
          turbidez?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partes_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partes_piscina_id_fkey"
            columns: ["piscina_id"]
            isOneToOne: false
            referencedRelation: "piscinas"
            referencedColumns: ["id"]
          },
        ]
      }
      piscinas: {
        Row: {
          alias: string
          archived: boolean
          cliente_id: string
          created_at: string
          direccion: string | null
          id: string
          lat: number | null
          lng: number | null
          notas: string | null
          org_id: string
          sistema_desinfeccion: string | null
          tipo: string | null
          updated_at: string
          volumen_m3: number | null
        }
        Insert: {
          alias: string
          archived?: boolean
          cliente_id: string
          created_at?: string
          direccion?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          notas?: string | null
          org_id: string
          sistema_desinfeccion?: string | null
          tipo?: string | null
          updated_at?: string
          volumen_m3?: number | null
        }
        Update: {
          alias?: string
          archived?: boolean
          cliente_id?: string
          created_at?: string
          direccion?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          notas?: string | null
          org_id?: string
          sistema_desinfeccion?: string | null
          tipo?: string | null
          updated_at?: string
          volumen_m3?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "piscinas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "piscinas_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["platform_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["platform_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["platform_role"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          default_org_id: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          default_org_id?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          default_org_id?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_default_org_id_fkey"
            columns: ["default_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ruta_paradas: {
        Row: {
          completada: boolean
          created_at: string
          id: string
          orden: number
          org_id: string
          parte_id: string | null
          piscina_id: string
          ruta_id: string
        }
        Insert: {
          completada?: boolean
          created_at?: string
          id?: string
          orden?: number
          org_id: string
          parte_id?: string | null
          piscina_id: string
          ruta_id: string
        }
        Update: {
          completada?: boolean
          created_at?: string
          id?: string
          orden?: number
          org_id?: string
          parte_id?: string | null
          piscina_id?: string
          ruta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ruta_paradas_ruta_id_fkey"
            columns: ["ruta_id"]
            isOneToOne: false
            referencedRelation: "rutas"
            referencedColumns: ["id"]
          },
        ]
      }
      rutas: {
        Row: {
          created_at: string
          fecha: string
          id: string
          nombre: string
          notas: string | null
          org_id: string
          tecnico_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          fecha: string
          id?: string
          nombre: string
          notas?: string | null
          org_id: string
          tecnico_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          fecha?: string
          id?: string
          nombre?: string
          notas?: string | null
          org_id?: string
          tecnico_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_org_id: { Args: never; Returns: string }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_org_role: {
        Args: {
          _org_id: string
          _roles: Database["public"]["Enums"]["org_role"][]
        }
        Returns: boolean
      }
      has_platform_role: {
        Args: {
          _role: Database["public"]["Enums"]["platform_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_org_member: { Args: { _org_id: string }; Returns: boolean }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      org_role: "owner" | "admin" | "tecnico"
      parte_estado: "borrador" | "completado" | "firmado"
      platform_role: "super_admin"
      subscription_status: "active" | "trialing" | "past_due" | "cancelled"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      org_role: ["owner", "admin", "tecnico"],
      parte_estado: ["borrador", "completado", "firmado"],
      platform_role: ["super_admin"],
      subscription_status: ["active", "trialing", "past_due", "cancelled"],
    },
  },
} as const
