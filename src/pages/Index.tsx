
import React, { useState, useMemo } from 'react';
import { Search, MessageCircle, ExternalLink, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ChatBot from '@/components/ChatBot';
import FAQCard from '@/components/FAQCard';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Sample FAQ data - in real implementation, this would come from your Google Sheets API
  const faqData = [
    {
      id: 1,
      question: "サービスの月額料金はいくらですか？",
      answer: "基本プランは月額3,000円（税込）です。機能に応じて以下のプランをご用意しています：\n\n1. スタータープラン：月額3,000円\n2. ビジネスプラン：月額8,000円\n3. エンタープライズプラン：月額15,000円\n\n詳細な機能比較については営業担当者にお問い合わせください。",
      category: "料金",
      keywords: ["料金", "月額", "プラン", "価格", "費用"],
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      question: "データのバックアップ機能はありますか？",
      answer: "はい、自動バックアップ機能を提供しています：\n\n1. 毎日深夜2時に自動バックアップを実行\n2. 過去30日分のデータを保持\n3. 手動でのバックアップ作成も可能\n4. データ復旧は管理画面から簡単に実行できます\n\nバックアップデータは暗号化されて安全に保存されます。",
      category: "機能・仕様",
      keywords: ["バックアップ", "データ", "復旧", "自動", "保存"],
      createdAt: "2024-01-14"
    },
    {
      id: 3,
      question: "ログインができない場合の対処法を教えてください",
      answer: "ログインできない場合は、以下の手順をお試しください：\n\n1. メールアドレスとパスワードが正しく入力されているか確認\n2. Caps Lockがオンになっていないか確認\n3. ブラウザのキャッシュをクリア\n4. 別のブラウザで試す\n5. パスワードリセット機能を使用\n\n上記で解決しない場合は、システム管理者にお問い合わせください。",
      category: "トラブルシューティング",
      keywords: ["ログイン", "パスワード", "エラー", "アクセス", "認証"],
      createdAt: "2024-01-13"
    },
    {
      id: 4,
      question: "契約の更新手続きはどのように行いますか？",
      answer: "契約更新は以下の流れで行います：\n\n1. 契約満了の1ヶ月前にメールでご案内\n2. 管理画面の「契約管理」から更新手続き\n3. 必要に応じてプラン変更も可能\n4. 決済情報の確認・更新\n5. 契約書の電子署名\n\n自動更新設定も可能です。詳細は営業担当者までお問い合わせください。",
      category: "契約",
      keywords: ["契約", "更新", "手続き", "プラン変更", "決済"],
      createdAt: "2024-01-12"
    },
    {
      id: 5,
      question: "レポート機能の使い方を教えてください",
      answer: "レポート機能の使い方は以下の通りです：\n\n1. 管理画面の「レポート」タブをクリック\n2. レポートの種類を選択（売上、アクセス解析など）\n3. 期間を指定（日次、週次、月次から選択）\n4. 必要に応じてフィルター条件を設定\n5. 「レポート生成」ボタンをクリック\n6. PDF/Excel形式でダウンロード可能\n\nカスタムレポートの作成方法については、操作マニュアルをご確認ください。",
      category: "操作方法",
      keywords: ["レポート", "使い方", "生成", "ダウンロード", "操作"],
      createdAt: "2024-01-11"
    }
  ];

  const categories = ["all", "料金", "機能・仕様", "操作方法", "契約", "トラブルシューティング", "その他"];

  const filteredFAQs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = searchTerm === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, faqData]);

  const getCategoryCount = (category: string) => {
    if (category === 'all') return faqData.length;
    return faqData.filter(faq => faq.category === category).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">社内FAQ</h1>
            </div>
            <Button
              onClick={() => setIsChatOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              AIチャット
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">よくある質問を検索</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="キーワードを入力してください..."
                className="pl-10 pr-4 py-3 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2 bg-white/80 backdrop-blur shadow-lg">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="flex flex-col items-center py-3 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <span className="font-medium">
                  {category === 'all' ? 'すべて' : category}
                </span>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {getCategoryCount(category)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {filteredFAQs.map((faq) => (
                <FAQCard key={faq.id} faq={faq} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredFAQs.length === 0 && (
          <Card className="text-center py-12 bg-white/80 backdrop-blur shadow-lg">
            <CardContent>
              <div className="text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">該当するFAQが見つかりませんでした</p>
                <p className="text-sm mb-4">別のキーワードで検索するか、AIチャットでお問い合わせください</p>
                <Button
                  onClick={() => setIsChatOpen(true)}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  AIチャットで質問
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">解決しない場合は</h3>
              <p className="mb-4 opacity-90">担当者が直接サポートいたします</p>
              <Button 
                variant="secondary" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => window.open('https://forms.google.com/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                お問い合わせフォーム
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] p-0">
          <ChatBot onClose={() => setIsChatOpen(false)} faqData={faqData} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
