// Offline Storage Module using IndexedDB
// Provides local storage for photos, logs, and tasks when offline

const DB_NAME = 'estructura360_offline';
const DB_VERSION = 1;

interface PendingMutation {
  id: string;
  type: 'log' | 'task';
  action: 'create' | 'update' | 'delete';
  endpoint: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

interface OfflineLog {
  id: string;
  projectId: number;
  notes: string | null;
  photoUrl: string | null;
  latitude: string | null;
  longitude: string | null;
  timestamp: string;
  synced: boolean;
}

interface OfflineTask {
  id: string;
  projectId: number;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  synced: boolean;
}

let db: IDBDatabase | null = null;

export async function initOfflineDB(): Promise<IDBDatabase> {
  if (db) return db;
  
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      // Store for pending mutations (sync queue)
      if (!database.objectStoreNames.contains('pendingMutations')) {
        database.createObjectStore('pendingMutations', { keyPath: 'id' });
      }
      
      // Store for offline logs
      if (!database.objectStoreNames.contains('offlineLogs')) {
        const logsStore = database.createObjectStore('offlineLogs', { keyPath: 'id' });
        logsStore.createIndex('projectId', 'projectId', { unique: false });
        logsStore.createIndex('synced', 'synced', { unique: false });
      }
      
      // Store for offline tasks
      if (!database.objectStoreNames.contains('offlineTasks')) {
        const tasksStore = database.createObjectStore('offlineTasks', { keyPath: 'id' });
        tasksStore.createIndex('projectId', 'projectId', { unique: false });
        tasksStore.createIndex('synced', 'synced', { unique: false });
      }
    };
  });
}

// Generate unique ID for offline items
export function generateOfflineId(): string {
  return `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Add item to sync queue
export async function addToSyncQueue(mutation: Omit<PendingMutation, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
  const database = await initOfflineDB();
  const transaction = database.transaction(['pendingMutations'], 'readwrite');
  const store = transaction.objectStore('pendingMutations');
  
  const item: PendingMutation = {
    ...mutation,
    id: generateOfflineId(),
    timestamp: Date.now(),
    retryCount: 0
  };
  
  store.add(item);
}

// Get all pending mutations
export async function getPendingMutations(): Promise<PendingMutation[]> {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['pendingMutations'], 'readonly');
    const store = transaction.objectStore('pendingMutations');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Remove mutation from queue after successful sync
export async function removeMutation(id: string): Promise<void> {
  const database = await initOfflineDB();
  const transaction = database.transaction(['pendingMutations'], 'readwrite');
  const store = transaction.objectStore('pendingMutations');
  store.delete(id);
}

// Save offline log entry
export async function saveOfflineLog(log: Omit<OfflineLog, 'id' | 'synced'>): Promise<OfflineLog> {
  const database = await initOfflineDB();
  const offlineLog: OfflineLog = {
    ...log,
    id: generateOfflineId(),
    synced: false
  };
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['offlineLogs'], 'readwrite');
    const store = transaction.objectStore('offlineLogs');
    const request = store.add(offlineLog);
    
    request.onsuccess = () => resolve(offlineLog);
    request.onerror = () => reject(request.error);
  });
}

// Get offline logs for a project
export async function getOfflineLogs(projectId: number): Promise<OfflineLog[]> {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['offlineLogs'], 'readonly');
    const store = transaction.objectStore('offlineLogs');
    const index = store.index('projectId');
    const request = index.getAll(projectId);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Mark log as synced
export async function markLogSynced(offlineId: string, serverId: number): Promise<void> {
  const database = await initOfflineDB();
  const transaction = database.transaction(['offlineLogs'], 'readwrite');
  const store = transaction.objectStore('offlineLogs');
  
  const getRequest = store.get(offlineId);
  getRequest.onsuccess = () => {
    const log = getRequest.result;
    if (log) {
      log.synced = true;
      log.serverId = serverId;
      store.put(log);
    }
  };
}

// Get count of pending items
export async function getPendingCount(): Promise<number> {
  const database = await initOfflineDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['pendingMutations'], 'readonly');
    const store = transaction.objectStore('pendingMutations');
    const request = store.count();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Clear synced items older than 7 days
export async function cleanupSyncedItems(): Promise<void> {
  const database = await initOfflineDB();
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  const transaction = database.transaction(['offlineLogs'], 'readwrite');
  const store = transaction.objectStore('offlineLogs');
  const request = store.openCursor();
  
  request.onsuccess = (event) => {
    const cursor = (event.target as IDBRequest).result;
    if (cursor) {
      const log = cursor.value;
      if (log.synced && new Date(log.timestamp).getTime() < sevenDaysAgo) {
        cursor.delete();
      }
      cursor.continue();
    }
  };
}
