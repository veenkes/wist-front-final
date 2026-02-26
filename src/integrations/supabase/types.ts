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
      attendance: {
        Row: {
          id: string
          lesson_instance_id: string | null
          marked_at: string | null
          marked_by: string | null
          notes: string | null
          status: string
          student_id: string
        }
        Insert: {
          id?: string
          lesson_instance_id?: string | null
          marked_at?: string | null
          marked_by?: string | null
          notes?: string | null
          status: string
          student_id: string
        }
        Update: {
          id?: string
          lesson_instance_id?: string | null
          marked_at?: string | null
          marked_by?: string | null
          notes?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_lesson_instance_id_fkey"
            columns: ["lesson_instance_id"]
            isOneToOne: false
            referencedRelation: "lesson_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      caretakers: {
        Row: {
          caretaker_type: string
          created_at: string
          full_name: string
          id: string
          notes: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          caretaker_type: string
          created_at?: string
          full_name: string
          id?: string
          notes?: string | null
          phone: string
          updated_at?: string
        }
        Update: {
          caretaker_type?: string
          created_at?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          avatar_url: string | null
          created_at: string
          documents: Json | null
          email: string
          full_name: string
          id: string
          payment_schedule: string | null
          permissions: Json | null
          phone: string | null
          salary: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          documents?: Json | null
          email: string
          full_name: string
          id?: string
          payment_schedule?: string | null
          permissions?: Json | null
          phone?: string | null
          salary?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          documents?: Json | null
          email?: string
          full_name?: string
          id?: string
          payment_schedule?: string | null
          permissions?: Json | null
          phone?: string | null
          salary?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      groups: {
        Row: {
          academic_year: string | null
          created_at: string | null
          curator_id: string | null
          grade_level: number | null
          id: string
          name: string
          student_count: number | null
          updated_at: string | null
        }
        Insert: {
          academic_year?: string | null
          created_at?: string | null
          curator_id?: string | null
          grade_level?: number | null
          id?: string
          name: string
          student_count?: number | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string | null
          created_at?: string | null
          curator_id?: string | null
          grade_level?: number | null
          id?: string
          name?: string
          student_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_curator_id_fkey"
            columns: ["curator_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_instances: {
        Row: {
          created_at: string | null
          date: string
          id: string
          lesson_id: string | null
          notes: string | null
          status: string | null
          topic: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          lesson_id?: string | null
          notes?: string | null
          status?: string | null
          topic?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          lesson_id?: string | null
          notes?: string | null
          status?: string | null
          topic?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_instances_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          classroom: string | null
          created_at: string | null
          day_of_week: number
          end_time: string
          group_id: string | null
          id: string
          start_time: string
          subject: string
          teacher_id: string | null
          updated_at: string | null
        }
        Insert: {
          classroom?: string | null
          created_at?: string | null
          day_of_week: number
          end_time: string
          group_id?: string | null
          id?: string
          start_time: string
          subject: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Update: {
          classroom?: string | null
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          group_id?: string | null
          id?: string
          start_time?: string
          subject?: string
          teacher_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          occupation: string | null
          phone: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          occupation?: string | null
          phone: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          occupation?: string | null
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_type: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_type: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_type?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      student_caretakers: {
        Row: {
          caretaker_id: string
          created_at: string
          id: string
          student_id: string
        }
        Insert: {
          caretaker_id: string
          created_at?: string
          id?: string
          student_id: string
        }
        Update: {
          caretaker_id?: string
          created_at?: string
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_caretakers_caretaker_id_fkey"
            columns: ["caretaker_id"]
            isOneToOne: false
            referencedRelation: "caretakers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_caretakers_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_documents: {
        Row: {
          document_name: string
          document_type: string
          file_url: string
          id: string
          notes: string | null
          student_id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          document_name: string
          document_type: string
          file_url: string
          id?: string
          notes?: string | null
          student_id: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          document_name?: string
          document_type?: string
          file_url?: string
          id?: string
          notes?: string | null
          student_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      student_groups: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          left_at: string | null
          student_id: string
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          student_id: string
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_groups_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_parents: {
        Row: {
          created_at: string
          id: string
          is_primary_contact: boolean | null
          parent_id: string
          relation_type: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary_contact?: boolean | null
          parent_id: string
          relation_type: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary_contact?: boolean | null
          parent_id?: string
          relation_type?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_parents_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_parents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          academic_level: string | null
          address: string | null
          created_at: string
          date_of_birth: string
          email: string | null
          enrollment_date: string
          full_name: string
          gender: string | null
          id: string
          id_passport_number: string | null
          notes: string | null
          phone: string | null
          photo_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          academic_level?: string | null
          address?: string | null
          created_at?: string
          date_of_birth: string
          email?: string | null
          enrollment_date?: string
          full_name: string
          gender?: string | null
          id?: string
          id_passport_number?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          academic_level?: string | null
          address?: string | null
          created_at?: string
          date_of_birth?: string
          email?: string | null
          enrollment_date?: string
          full_name?: string
          gender?: string | null
          id?: string
          id_passport_number?: string | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      teachers: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          address_line3: string | null
          assigned_classes: string[] | null
          assigned_year_groups: string[] | null
          certification_level: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          department: string | null
          documents: Json | null
          email: string
          employment_type: string | null
          end_date: string | null
          full_name: string
          gender: string | null
          hiring_date: string | null
          home_room: string | null
          house_division: string | null
          id: string
          nationality: string | null
          notes: string | null
          passport_number: string | null
          performance_records: Json | null
          phone: string | null
          photo_url: string | null
          postal_code: string | null
          preferred_name: string | null
          previous_schools: string[] | null
          role: string | null
          school_division: string | null
          sen_expertise: boolean | null
          staff_category: string | null
          staff_id: string | null
          status: string
          subject_specialization: string[] | null
          teaching_load: string | null
          training_records: Json | null
          tutor_group: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          address_line3?: string | null
          assigned_classes?: string[] | null
          assigned_year_groups?: string[] | null
          certification_level?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          documents?: Json | null
          email: string
          employment_type?: string | null
          end_date?: string | null
          full_name: string
          gender?: string | null
          hiring_date?: string | null
          home_room?: string | null
          house_division?: string | null
          id?: string
          nationality?: string | null
          notes?: string | null
          passport_number?: string | null
          performance_records?: Json | null
          phone?: string | null
          photo_url?: string | null
          postal_code?: string | null
          preferred_name?: string | null
          previous_schools?: string[] | null
          role?: string | null
          school_division?: string | null
          sen_expertise?: boolean | null
          staff_category?: string | null
          staff_id?: string | null
          status?: string
          subject_specialization?: string[] | null
          teaching_load?: string | null
          training_records?: Json | null
          tutor_group?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          address_line3?: string | null
          assigned_classes?: string[] | null
          assigned_year_groups?: string[] | null
          certification_level?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          documents?: Json | null
          email?: string
          employment_type?: string | null
          end_date?: string | null
          full_name?: string
          gender?: string | null
          hiring_date?: string | null
          home_room?: string | null
          house_division?: string | null
          id?: string
          nationality?: string | null
          notes?: string | null
          passport_number?: string | null
          performance_records?: Json | null
          phone?: string | null
          photo_url?: string | null
          postal_code?: string | null
          preferred_name?: string | null
          previous_schools?: string[] | null
          role?: string | null
          school_division?: string | null
          sen_expertise?: boolean | null
          staff_category?: string | null
          staff_id?: string | null
          status?: string
          subject_specialization?: string[] | null
          teaching_load?: string | null
          training_records?: Json | null
          tutor_group?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      violation_attachments: {
        Row: {
          created_at: string
          file_type: string
          file_url: string
          id: string
          violation_id: string
        }
        Insert: {
          created_at?: string
          file_type: string
          file_url: string
          id?: string
          violation_id: string
        }
        Update: {
          created_at?: string
          file_type?: string
          file_url?: string
          id?: string
          violation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "violation_attachments_violation_id_fkey"
            columns: ["violation_id"]
            isOneToOne: false
            referencedRelation: "violations"
            referencedColumns: ["id"]
          },
        ]
      }
      violations: {
        Row: {
          corrective_action: string | null
          created_at: string
          description: string
          id: string
          location: string | null
          occurred_at: string
          reported_by: string | null
          severity: string
          status: string
          student_id: string
          student_statement: string | null
          updated_at: string
          violation_type: string
        }
        Insert: {
          corrective_action?: string | null
          created_at?: string
          description: string
          id?: string
          location?: string | null
          occurred_at?: string
          reported_by?: string | null
          severity: string
          status?: string
          student_id: string
          student_statement?: string | null
          updated_at?: string
          violation_type: string
        }
        Update: {
          corrective_action?: string | null
          created_at?: string
          description?: string
          id?: string
          location?: string | null
          occurred_at?: string
          reported_by?: string | null
          severity?: string
          status?: string
          student_id?: string
          student_statement?: string | null
          updated_at?: string
          violation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "violations_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "violations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
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
      app_role:
        | "ceo"
        | "admin"
        | "accountant"
        | "teacher"
        | "support"
        | "manager"
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
      app_role: ["ceo", "admin", "accountant", "teacher", "support", "manager"],
    },
  },
} as const
