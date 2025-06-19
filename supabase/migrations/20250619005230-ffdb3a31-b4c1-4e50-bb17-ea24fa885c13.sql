
-- FAQテーブルを作成
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'その他',
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_faqs_updated_at 
  BEFORE UPDATE ON public.faqs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLSを有効化（管理者のみアクセス可能）
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- 一般ユーザーは閲覧のみ可能
CREATE POLICY "Anyone can view active FAQs" 
  ON public.faqs 
  FOR SELECT 
  USING (is_active = true);

-- Googleスプレッドシート同期用のログテーブル
CREATE TABLE public.sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL, -- 'google_sheets', 'manual', etc
  status TEXT NOT NULL, -- 'success', 'error', 'in_progress'
  message TEXT,
  synced_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 同期ログもRLS有効化
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- 管理者のみ同期ログを閲覧可能（現在は全員閲覧可能に設定）
CREATE POLICY "Anyone can view sync logs" 
  ON public.sync_logs 
  FOR SELECT 
  USING (true);
