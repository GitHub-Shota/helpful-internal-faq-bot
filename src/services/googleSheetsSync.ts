
import { supabase } from '@/integrations/supabase/client';

export interface GoogleSheetsFAQ {
  question: string;
  answer: string;
  category: string;
  keywords: string;
}

export const syncFromGoogleSheets = async () => {
  try {
    // 同期開始ログを記録
    const { data: logData } = await supabase
      .from('sync_logs')
      .insert({
        sync_type: 'google_sheets',
        status: 'in_progress',
        message: 'Googleスプレッドシートからの同期を開始しました'
      })
      .select()
      .single();

    // Edge Functionを呼び出してGoogleスプレッドシートからデータを取得
    const { data, error } = await supabase.functions.invoke('sync-google-sheets', {
      body: { action: 'fetch' }
    });

    if (error) throw error;

    const faqsData: GoogleSheetsFAQ[] = data.faqs || [];
    
    if (faqsData.length === 0) {
      await supabase
        .from('sync_logs')
        .update({
          status: 'success',
          message: '同期対象のデータがありませんでした',
          synced_count: 0
        })
        .eq('id', logData?.id);
      return;
    }

    // 既存のFAQを非アクティブ化
    await supabase
      .from('faqs')
      .update({ is_active: false })
      .eq('is_active', true);

    // 新しいFAQデータを挿入
    const formattedFAQs = faqsData.map((faq, index) => ({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'その他',
      keywords: faq.keywords ? faq.keywords.split(',').map(k => k.trim()) : [],
      sort_order: index,
      is_active: true
    }));

    const { error: insertError } = await supabase
      .from('faqs')
      .insert(formattedFAQs);

    if (insertError) throw insertError;

    // 同期完了ログを記録
    await supabase
      .from('sync_logs')
      .update({
        status: 'success',
        message: '同期が正常に完了しました',
        synced_count: faqsData.length
      })
      .eq('id', logData?.id);

    return faqsData.length;
  } catch (error) {
    console.error('同期エラー:', error);
    
    // エラーログを記録
    await supabase
      .from('sync_logs')
      .insert({
        sync_type: 'google_sheets',
        status: 'error',
        message: error instanceof Error ? error.message : '不明なエラーが発生しました',
        synced_count: 0
      });

    throw error;
  }
};
