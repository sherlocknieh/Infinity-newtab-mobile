/**
 * Storage utilities
 *
 * Provides a unified interface over three storage back-ends:
 *   • chromeStorage  – chrome.storage.local (persists across browser sessions)
 *   • indexeddb      – idb-backed IndexedDB (for large blobs / structured data)
 *   • localStorage   – synchronous window.localStorage (simple key-value)
 */

import { openDB, IDBPDatabase } from 'idb'

let db: IDBPDatabase | null = null

// ---------------------------------------------------------------------------
// IndexedDB initialisation
// ---------------------------------------------------------------------------

/**
 * Open (or create) the 'infinity' IndexedDB database with a single object
 * store named `storeName`.  Call this once before using the 'indexeddb' type.
 */
export async function initDB(storeName: string): Promise<void> {
  db = await openDB('infinity', 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName)
      }
    },
  })
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function getStorage(
  key: string,
  type: 'chromeStorage' | 'indexeddb' | 'localStorage' = 'chromeStorage',
  storeName = 'keyval-store',
): Promise<unknown> {
  switch (type) {
    case 'indexeddb':
      return db?.get(storeName, key)

    case 'localStorage':
      return localStorage.getItem(key)

    case 'chromeStorage':
      return new Promise(resolve =>
        chrome.storage.local.get(key, data => resolve(data[key])),
      )
  }
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

export async function setStorage(
  key: string,
  value: unknown,
  type: 'chromeStorage' | 'indexeddb' | 'localStorage' = 'chromeStorage',
  storeName = 'keyval-store',
): Promise<void> {
  switch (type) {
    case 'indexeddb':
      await db?.put(storeName, value, key)
      break

    case 'localStorage':
      localStorage.setItem(
        key,
        typeof value === 'string' ? value : JSON.stringify(value),
      )
      break

    case 'chromeStorage':
      await new Promise<void>(resolve =>
        chrome.storage.local.set({ [key]: value }, resolve),
      )
      break
  }
}

// ---------------------------------------------------------------------------
// Shallow-merge write (for object values)
// ---------------------------------------------------------------------------

export async function mergeStorage(
  key: string,
  value: Record<string, unknown>,
  type: 'chromeStorage' | 'indexeddb' | 'localStorage' = 'chromeStorage',
  storeName = 'keyval-store',
): Promise<void> {
  let existing = await getStorage(key, type, storeName)

  // localStorage stores everything as a string – parse before merging.
  if (existing && type === 'localStorage') {
    try {
      existing = JSON.parse(existing as string)
    } catch {
      existing = {}
    }
  }

  const merged =
    existing && typeof existing === 'object' && Object.keys(existing).length
      ? { ...(existing as Record<string, unknown>), ...value }
      : value

  await setStorage(key, merged, type, storeName)
}
