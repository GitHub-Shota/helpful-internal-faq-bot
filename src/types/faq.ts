
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
  sort_order: number;
}

export interface SyncLog {
  id: string;
  sync_type: string;
  status: 'success' | 'error' | 'in_progress';
  message?: string;
  synced_count: number;
  created_at: string;
}
