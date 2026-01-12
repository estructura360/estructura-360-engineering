import { useOfflineStatus } from '@/hooks/use-offline';
import { WifiOff, Cloud, CloudUpload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OfflineBanner() {
  const { status, pendingCount, triggerSync } = useOfflineStatus();
  
  if (status === 'online' && pendingCount === 0) {
    return null;
  }
  
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg flex items-center gap-3 text-sm font-medium transition-all duration-300 ${
      status === 'offline' 
        ? 'bg-amber-500 text-white' 
        : status === 'syncing'
        ? 'bg-blue-500 text-white'
        : 'bg-green-500 text-white'
    }`}>
      {status === 'offline' ? (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Sin conexión</span>
          {pendingCount > 0 && (
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
            </span>
          )}
        </>
      ) : status === 'syncing' ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Sincronizando...</span>
        </>
      ) : (
        <>
          <CloudUpload className="h-4 w-4" />
          <span>{pendingCount} por sincronizar</span>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-6 px-2 text-white hover:bg-white/20"
            onClick={() => triggerSync()}
          >
            Sincronizar
          </Button>
        </>
      )}
    </div>
  );
}
