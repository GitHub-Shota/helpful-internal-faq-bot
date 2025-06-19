
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SyncButtonProps {
  onSync: () => Promise<void>;
  disabled?: boolean;
}

const SyncButton: React.FC<SyncButtonProps> = ({ onSync, disabled = false }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await onSync();
      toast({
        title: "同期完了",
        description: "Googleスプレッドシートからのデータ同期が完了しました。",
      });
    } catch (error) {
      console.error('同期エラー:', error);
      toast({
        title: "同期エラー",
        description: "データの同期中にエラーが発生しました。",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={disabled || isSyncing}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isSyncing ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {isSyncing ? '同期中...' : 'Googleシートから同期'}
    </Button>
  );
};

export default SyncButton;
