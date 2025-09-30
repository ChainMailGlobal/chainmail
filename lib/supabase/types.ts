export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cmra_agents: {
        Row: {
          id: string
          user_id: string
          business_name: string
          license_number: string
          is_verified: boolean
          eth_anchor_hash: string | null
          eth_anchor_tx_hash: string | null
          eth_anchor_block: number | null
          eth_anchor_timestamp: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          license_number: string
          is_verified?: boolean
          eth_anchor_hash?: string | null
          eth_anchor_tx_hash?: string | null
          eth_anchor_block?: number | null
          eth_anchor_timestamp?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          license_number?: string
          is_verified?: boolean
          eth_anchor_hash?: string | null
          eth_anchor_tx_hash?: string | null
          eth_anchor_block?: number | null
          eth_anchor_timestamp?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      witness_sessions: {
        Row: {
          id: string
          user_id: string
          agent_id: string
          session_type: string
          status: string
          scheduled_at: string | null
          started_at: string | null
          completed_at: string | null
          video_url: string | null
          signature_url: string | null
          confidence_score: number | null
          ai_analysis: any | null
          xrpl_anchor_hash: string | null
          xrpl_tx_hash: string | null
          xrpl_ledger_seq: number | null
          xrpl_anchor_timestamp: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          agent_id: string
          session_type: string
          status?: string
          scheduled_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          video_url?: string | null
          signature_url?: string | null
          confidence_score?: number | null
          ai_analysis?: any | null
          xrpl_anchor_hash?: string | null
          xrpl_tx_hash?: string | null
          xrpl_ledger_seq?: number | null
          xrpl_anchor_timestamp?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          agent_id?: string
          session_type?: string
          status?: string
          scheduled_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          video_url?: string | null
          signature_url?: string | null
          confidence_score?: number | null
          ai_analysis?: any | null
          xrpl_anchor_hash?: string | null
          xrpl_tx_hash?: string | null
          xrpl_ledger_seq?: number | null
          xrpl_anchor_timestamp?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      session_events: {
        Row: {
          id: string
          session_id: string
          event_type: string
          event_data: any | null
          timestamp: string
        }
        Insert: {
          id?: string
          session_id: string
          event_type: string
          event_data?: any | null
          timestamp?: string
        }
        Update: {
          id?: string
          session_id?: string
          event_type?: string
          event_data?: any | null
          timestamp?: string
        }
      }
      agent_availability: {
        Row: {
          id: string
          agent_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
