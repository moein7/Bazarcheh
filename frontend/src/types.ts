export const CATEGORIES = [
  'delivery',
  'payment',
  'refund',
  'product_quality',
  'account',
  'other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Message {
  message_id: string;
  category: Category;
  is_urgent: boolean;
  order_ref: string | null;
  duplicate_of: string | null;
  customer_id: string;
  channel: string;
  received_at: string;
  answered_at: string | null;
  subject: string;
  body: string;
  severity: string | null;
  severity_hint: string | null;
  business_minutes_left?: number;
}

export interface AnalyzeResult {
  total_unique_messages: number;
  category_counts: Record<Category, number>;
  urgent_message_ids: string[];
  attention_message_ids?: string[];
  messages: Message[];
}

export interface Draft {
  message_id: string;
  draft: string;
  language: string;
  blocked: boolean;
  source?: 'ai' | 'fallback';
  warnings: string[];
}


export interface ActivityLogItem {
  id: number;
  event_type: 'user' | 'ai' | 'system';
  action: string;
  message_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface ActivityLogResponse {
  items: ActivityLogItem[];
  memory: { approved_examples: number; fa_examples: number; en_examples: number; max_examples: number };
}
