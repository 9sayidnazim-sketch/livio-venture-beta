export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      application_events: {
        Row: {
          application_id: string;
          created_at: string;
          id: string;
          note: string | null;
          status: Database["public"]["Enums"]["application_status"];
        };
        Insert: {
          application_id: string;
          created_at?: string;
          id?: string;
          note?: string | null;
          status: Database["public"]["Enums"]["application_status"];
        };
        Update: {
          application_id?: string;
          created_at?: string;
          id?: string;
          note?: string | null;
          status?: Database["public"]["Enums"]["application_status"];
        };
        Relationships: [
          {
            foreignKeyName: "application_events_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
        ];
      };
      applications: {
        Row: {
          created_at: string;
          id: string;
          intake: string;
          program: string;
          status: Database["public"]["Enums"]["application_status"];
          university_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          intake: string;
          program: string;
          status?: Database["public"]["Enums"]["application_status"];
          university_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          intake?: string;
          program?: string;
          status?: Database["public"]["Enums"]["application_status"];
          university_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "applications_university_id_fkey";
            columns: ["university_id"];
            isOneToOne: false;
            referencedRelation: "universities";
            referencedColumns: ["id"];
          },
        ];
      };
      counsellor_assignments: {
        Row: {
          counsellor_id: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          counsellor_id: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          counsellor_id?: string;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "counsellor_assignments_counsellor_id_fkey";
            columns: ["counsellor_id"];
            isOneToOne: false;
            referencedRelation: "counsellors";
            referencedColumns: ["id"];
          },
        ];
      };
      counsellors: {
        Row: {
          bio: string;
          created_at: string;
          email: string;
          id: string;
          languages: string[];
          name: string;
          phone: string | null;
        };
        Insert: {
          bio?: string;
          created_at?: string;
          email: string;
          id?: string;
          languages?: string[];
          name: string;
          phone?: string | null;
        };
        Update: {
          bio?: string;
          created_at?: string;
          email?: string;
          id?: string;
          languages?: string[];
          name?: string;
          phone?: string | null;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          application_id: string | null;
          created_at: string;
          file_name: string;
          id: string;
          kind: string;
          reviewer_note: string | null;
          status: Database["public"]["Enums"]["document_status"];
          storage_path: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          application_id?: string | null;
          created_at?: string;
          file_name: string;
          id?: string;
          kind: string;
          reviewer_note?: string | null;
          status?: Database["public"]["Enums"]["document_status"];
          storage_path: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          application_id?: string | null;
          created_at?: string;
          file_name?: string;
          id?: string;
          kind?: string;
          reviewer_note?: string | null;
          status?: Database["public"]["Enums"]["document_status"];
          storage_path?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          link: string | null;
          read_at: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          body?: string;
          created_at?: string;
          id?: string;
          link?: string | null;
          read_at?: string | null;
          title: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          link?: string | null;
          read_at?: string | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      saved_universities: {
        Row: {
          created_at: string;
          university_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          university_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          university_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "saved_universities_university_id_fkey";
            columns: ["university_id"];
            isOneToOne: false;
            referencedRelation: "universities";
            referencedColumns: ["id"];
          },
        ];
      };
      student_profiles: {
        Row: {
          city: string;
          consent_at: string;
          country: string;
          created_at: string;
          email: string;
          full_name: string;
          ielts_score: number | null;
          level: string;
          phone: string;
          preferred_countries: string[];
          qualification: string;
          score: number;
          subject: string;
          updated_at: string;
          user_id: string;
          yearly_budget: number;
        };
        Insert: {
          city: string;
          consent_at?: string;
          country: string;
          created_at?: string;
          email: string;
          full_name: string;
          ielts_score?: number | null;
          level: string;
          phone: string;
          preferred_countries?: string[];
          qualification: string;
          score: number;
          subject: string;
          updated_at?: string;
          user_id: string;
          yearly_budget: number;
        };
        Update: {
          city?: string;
          consent_at?: string;
          country?: string;
          created_at?: string;
          email?: string;
          full_name?: string;
          ielts_score?: number | null;
          level?: string;
          phone?: string;
          preferred_countries?: string[];
          qualification?: string;
          score?: number;
          subject?: string;
          updated_at?: string;
          user_id?: string;
          yearly_budget?: number;
        };
        Relationships: [];
      };
      universities: {
        Row: {
          city: string;
          country: string;
          created_at: string;
          description: string;
          fields: string[];
          id: string;
          intakes: string[];
          language: string;
          levels: string[];
          living_eur: number;
          min_ielts: number;
          min_score: number;
          name: string;
          tuition_eur: number;
          updated_at: string;
          verified: boolean;
          website: string | null;
        };
        Insert: {
          city: string;
          country: string;
          created_at?: string;
          description?: string;
          fields?: string[];
          id?: string;
          intakes?: string[];
          language?: string;
          levels?: string[];
          living_eur: number;
          min_ielts?: number;
          min_score?: number;
          name: string;
          tuition_eur: number;
          updated_at?: string;
          verified?: boolean;
          website?: string | null;
        };
        Update: {
          city?: string;
          country?: string;
          created_at?: string;
          description?: string;
          fields?: string[];
          id?: string;
          intakes?: string[];
          language?: string;
          levels?: string[];
          living_eur?: number;
          min_ielts?: number;
          min_score?: number;
          name?: string;
          tuition_eur?: number;
          updated_at?: string;
          verified?: boolean;
          website?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "student" | "admin" | "counsellor";
      application_status:
        "draft" | "submitted" | "under_review" | "offer" | "accepted" | "rejected" | "withdrawn";
      document_status: "uploaded" | "in_review" | "approved" | "needs_changes";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "admin", "counsellor"],
      application_status: [
        "draft",
        "submitted",
        "under_review",
        "offer",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      document_status: ["uploaded", "in_review", "approved", "needs_changes"],
    },
  },
} as const;
