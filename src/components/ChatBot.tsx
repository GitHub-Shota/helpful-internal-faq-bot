
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, ExternalLink, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  createdAt: string;
}

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  relatedFAQs?: FAQ[];
}

interface ChatBotProps {
  onClose: () => void;
  faqData: FAQ[];
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose, faqData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'こんにちは！社内FAQチャットボットです。ご質問をお聞かせください。',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const searchFAQs = (query: string): FAQ[] => {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return faqData
      .map(faq => {
        let score = 0;
        
        // 質問文での完全一致
        if (faq.question.toLowerCase().includes(query.toLowerCase())) {
          score += 10;
        }
        
        // キーワードでの一致
        faq.keywords.forEach(keyword => {
          if (keyword.toLowerCase().includes(query.toLowerCase())) {
            score += 5;
          }
        });
        
        // 回答での一致
        if (faq.answer.toLowerCase().includes(query.toLowerCase())) {
          score += 3;
        }
        
        // 部分的な単語マッチング
        searchTerms.forEach(term => {
          if (faq.question.toLowerCase().includes(term) || 
              faq.answer.toLowerCase().includes(term) ||
              faq.keywords.some(keyword => keyword.toLowerCase().includes(term))) {
            score += 1;
          }
        });
        
        return { ...faq, score };
      })
      .filter(faq => faq.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const relatedFAQs = searchFAQs(inputValue);
      let botResponse: string;

      if (relatedFAQs.length > 0) {
        botResponse = `以下のFAQが関連している可能性があります：\n\n${relatedFAQs[0].question}\n\n${relatedFAQs[0].answer}`;
        
        if (relatedFAQs.length > 1) {
          botResponse += '\n\n他にも関連するFAQがあります。詳細は下記をご確認ください。';
        }
      } else {
        botResponse = '申し訳ございませんが、該当するFAQが見つかりませんでした。\n\n担当者に確認いたしますので、こちらのフォームからお問い合わせください。';
      }

      const botMessage: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        relatedFAQs: relatedFAQs.length > 0 ? relatedFAQs : undefined
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg">
      {/* Header */}
      <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <CardTitle className="text-lg">AIチャットボット</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="text-sm">
                  {formatMessageContent(message.content)}
                </div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Related FAQs */}
        {messages.length > 0 && messages[messages.length - 1].relatedFAQs && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">関連するFAQ:</h4>
            <div className="space-y-2">
              {messages[messages.length - 1].relatedFAQs!.map((faq) => (
                <Card key={faq.id} className="p-3 bg-blue-50 border-blue-200">
                  <div className="text-sm">
                    <div className="font-medium text-blue-900 mb-1">{faq.question}</div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      {faq.category}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contact Form Link */}
        {messages.length > 1 && (
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-2">
                  解決しない場合は担当者がサポートします
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                  onClick={() => window.open('https://forms.google.com/', '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  お問い合わせフォーム
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="質問を入力してください..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
