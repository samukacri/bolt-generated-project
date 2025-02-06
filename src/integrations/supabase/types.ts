export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bible_books: {
        Row: {
          id: number
          name: string
          name_es: string
          name_pt: string
          position: number
          testament: string
        }
        Insert: {
          id?: number
          name: string
          name_es: string
          name_pt: string
          position: number
          testament: string
        }
        Update: {
          id?: number
          name?: string
          name_es?: string
          name_pt?: string
          position?: number
          testament?: string
        }
        Relationships: []
      }
      bible_chapters: {
        Row: {
          book_id: number | null
          chapter_number: number
          id: number
        }
        Insert: {
          book_id?: number | null
          chapter_number: number
          id?: number
        }
        Update: {
          book_id?: number | null
          chapter_number?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_verses: {
        Row: {
          chapter_id: number | null
          id: number
          text: string
          text_es: string
          text_pt: string
          verse_number: number
        }
        Insert: {
          chapter_id?: number | null
          id?: number
          text: string
          text_es: string
          text_pt: string
          verse_number: number
        }
        Update: {
          chapter_id?: number | null
          id?: number
          text?: string
          text_es?: string
          text_pt?: string
          verse_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "bible_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_categories: {
        Row: {
          description: string | null
          description_es: string | null
          description_pt: string | null
          icon: string | null
          id: number
          name: string
          name_es: string
          name_pt: string
        }
        Insert: {
          description?: string | null
          description_es?: string | null
          description_pt?: string | null
          icon?: string | null
          id?: number
          name: string
          name_es: string
          name_pt: string
        }
        Update: {
          description?: string | null
          description_es?: string | null
          description_pt?: string | null
          icon?: string | null
          id?: number
          name?: string
          name_es?: string
          name_pt?: string
        }
        Relationships: []
      }
      prayers: {
        Row: {
          category_id: number | null
          content: string
          content_es: string
          content_pt: string
          created_at: string
          id: string
          is_featured: boolean | null
          title: string
          title_es: string
          title_pt: string
        }
        Insert: {
          category_id?: number | null
          content: string
          content_es: string
          content_pt: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          title: string
          title_es: string
          title_pt: string
        }
        Update: {
          category_id?: number | null
          content?: string
          content_es?: string
          content_pt?: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          title?: string
          title_es?: string
          title_pt?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayers_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "prayer_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          chapter_id: number | null
          created_at: string
          id: string
          note: string | null
          user_id: string
          verse_id: number | null
        }
        Insert: {
          chapter_id?: number | null
          created_at?: string
          id?: string
          note?: string | null
          user_id: string
          verse_id?: number | null
        }
        Update: {
          chapter_id?: number | null
          created_at?: string
          id?: string
          note?: string | null
          user_id?: string
          verse_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "bible_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_last_reading: {
        Row: {
          book_id: number
          chapter_id: number
          created_at: string
          id: string
          user_id: string
          verse_id: number | null
        }
        Insert: {
          book_id: number
          chapter_id: number
          created_at?: string
          id?: string
          user_id: string
          verse_id?: number | null
        }
        Update: {
          book_id?: number
          chapter_id?: number
          created_at?: string
          id?: string
          user_id?: string
          verse_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_last_reading_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_last_reading_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "bible_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_last_reading_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_prayer_favorites: {
        Row: {
          created_at: string
          id: string
          note: string | null
          prayer_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          prayer_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          prayer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_prayer_favorites_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "prayers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
