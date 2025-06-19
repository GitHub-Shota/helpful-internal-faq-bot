import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FAQ } from '@/types/faq';

interface FAQCardProps {
  faq: FAQ;
}

const FAQCard: React.FC<FAQCardProps> = ({ faq }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatAnswer = (answer: string) => {
    return answer.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < answer.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      '料金': 'bg-green-100 text-green-800',
      '機能・仕様': 'bg-blue-100 text-blue-800',
      '操作方法': 'bg-purple-100 text-purple-800',
      '契約': 'bg-orange-100 text-orange-800',
      'トラブルシューティング': 'bg-red-100 text-red-800',
      'その他': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors['その他'];
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white/90 backdrop-blur border-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Badge className={getCategoryColor(faq.category)}>
                {faq.category}
              </Badge>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(faq.created_at).toLocaleDateString('ja-JP')}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="border-t pt-4">
            <div className="text-gray-700 mb-4 leading-relaxed">
              {formatAnswer(faq.answer)}
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Tag className="w-3 h-3 text-gray-400" />
              <span className="text-gray-500">キーワード:</span>
              <div className="flex flex-wrap gap-1">
                {faq.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default FAQCard;
