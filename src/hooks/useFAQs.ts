
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FAQ } from '@/types/faq';

export const useFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedFAQs = data.map(faq => ({
        ...faq,
        createdAt: new Date(faq.created_at).toLocaleDateString('ja-JP'),
        keywords: faq.keywords || []
      }));

      setFaqs(formattedFAQs);
      setError(null);
    } catch (err) {
      console.error('FAQの取得エラー:', err);
      setError(err instanceof Error ? err.message : 'FAQの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return { faqs, loading, error, refetch: fetchFAQs };
};
