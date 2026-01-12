import { useState, useEffect } from 'react';
import { subscribeToStatus, initSyncManager, triggerSync, getConnectionStatus } from '@/lib/syncManager';

type ConnectionStatus = 'online' | 'offline' | 'syncing';

let initialized = false;

export function useOfflineStatus() {
  const [status, setStatus] = useState<ConnectionStatus>(getConnectionStatus());
  const [pendingCount, setPendingCount] = useState(0);
  
  useEffect(() => {
    // Initialize sync manager once
    if (!initialized) {
      initSyncManager();
      initialized = true;
    }
    
    // Subscribe to status changes
    const unsubscribe = subscribeToStatus((newStatus, count) => {
      setStatus(newStatus);
      setPendingCount(count);
    });
    
    return unsubscribe;
  }, []);
  
  return {
    status,
    isOnline: status === 'online',
    isOffline: status === 'offline',
    isSyncing: status === 'syncing',
    pendingCount,
    triggerSync
  };
}
