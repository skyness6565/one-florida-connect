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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      beneficiaries: {
        Row: {
          account_number: string
          bank_name: string
          created_at: string
          id: string
          name: string
          nickname: string | null
          routing_code: string | null
          user_id: string
        }
        Insert: {
          account_number: string
          bank_name: string
          created_at?: string
          id?: string
          name: string
          nickname?: string | null
          routing_code?: string | null
          user_id: string
        }
        Update: {
          account_number?: string
          bank_name?: string
          created_at?: string
          id?: string
          name?: string
          nickname?: string | null
          routing_code?: string | null
          user_id?: string
        }
        Relationships: []
      }
      crypto_holdings: {
        Row: {
          amount: number
          avg_price: number
          created_at: string
          id: string
          symbol: string
          user_id: string
        }
        Insert: {
          amount?: number
          avg_price: number
          created_at?: string
          id?: string
          symbol: string
          user_id: string
        }
        Update: {
          amount?: number
          avg_price?: number
          created_at?: string
          id?: string
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      investments: {
        Row: {
          amount: number
          created_at: string
          id: string
          plan_name: string
          roi: number
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          plan_name: string
          roi: number
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          plan_name?: string
          roi?: number
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      loans: {
        Row: {
          amount: number
          created_at: string
          id: string
          interest_rate: number
          monthly_payment: number | null
          purpose: string | null
          status: string
          term_months: number
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          interest_rate?: number
          monthly_payment?: number | null
          purpose?: string | null
          status?: string
          term_months: number
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          interest_rate?: number
          monthly_payment?: number | null
          purpose?: string | null
          status?: string
          term_months?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_number: string | null
          address: string | null
          avatar_url: string | null
          card_cvv: string | null
          card_number: string | null
          checking_balance: number | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_blocked: boolean | null
          phone: string | null
          savings_balance: number | null
          transfer_fee: number | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          account_number?: string | null
          address?: string | null
          avatar_url?: string | null
          card_cvv?: string | null
          card_number?: string | null
          checking_balance?: number | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_blocked?: boolean | null
          phone?: string | null
          savings_balance?: number | null
          transfer_fee?: number | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          account_number?: string | null
          address?: string | null
          avatar_url?: string | null
          card_cvv?: string | null
          card_number?: string | null
          checking_balance?: number | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_blocked?: boolean | null
          phone?: string | null
          savings_balance?: number | null
          transfer_fee?: number | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          message: string
          priority: string | null
          response: string | null
          status: string
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          priority?: string | null
          response?: string | null
          status?: string
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          priority?: string | null
          response?: string | null
          status?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          fee: number | null
          id: string
          metadata: Json | null
          note: string | null
          recipient_account: string | null
          recipient_bank: string | null
          recipient_name: string | null
          routing_code: string | null
          sender_account: string | null
          status: string
          transaction_id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string
          created_at?: string
          fee?: number | null
          id?: string
          metadata?: Json | null
          note?: string | null
          recipient_account?: string | null
          recipient_bank?: string | null
          recipient_name?: string | null
          routing_code?: string | null
          sender_account?: string | null
          status?: string
          transaction_id: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          fee?: number | null
          id?: string
          metadata?: Json | null
          note?: string | null
          recipient_account?: string | null
          recipient_bank?: string | null
          recipient_name?: string | null
          routing_code?: string | null
          sender_account?: string | null
          status?: string
          transaction_id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_pins: {
        Row: {
          created_at: string
          id: string
          pin: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pin: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pin?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
