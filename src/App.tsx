import React, { useState } from 'react';
import FAQCard from '@/components/FAQCard';
import ChatBot from '@/components/ChatBot';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageCircle } from 'lucide-react';
import { useFAQs } from '@/hooks/useFAQs';
import { syncFromGoogleSheets } from '@/services/googleSheetsSync';
import SyncButton from '@/components/SyncButton';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const { faqs, loading, error, refetch } = useFAQs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全て');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSync = async () => {
    await syncFromGoogleSheets();
    refetch(); // FAQデータを再取得
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '全て' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['全て', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">FAQを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">エラーが発生しました: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            社内FAQ
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            よくある質問とその回答を検索できます
          </p>
          
          <div className="flex justify-center mb-6">
            <SyncButton onSync={handleSync} />
          </div>
        </div>

        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="質問や回答を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg bg-white/80 backdrop-blur border-0 shadow-lg"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <FAQCard key={faq.id} faq={faq} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">該当するFAQが見つかりませんでした。</p>
            </div>
          )}
        </div>

        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>

        {isChatOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl h-[600px]">
              <ChatBot onClose={() => setIsChatOpen(false)} faqData={faqs} />
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App;
