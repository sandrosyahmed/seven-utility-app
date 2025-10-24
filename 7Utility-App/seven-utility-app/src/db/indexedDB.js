// src/db/indexedDB.js
// Simple local IndexedDB wrapper for storing items

export const DB = (function () {
  const DB_NAME = "SevenUtilityDB";
  const VERSION = 1;
  const STORE = "items";

  function open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function tx(storeName, mode, fn) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(storeName, mode);
      const s = t.objectStore(storeName);
      const r = fn(s);
      t.oncomplete = () => resolve(r);
      t.onerror = () => reject(t.error || r?.error);
    });
  }

  return {
    async put(item) {
      item.updatedAt = Date.now();
      if (!item.id) item.id = crypto.randomUUID();
      await tx(STORE, "readwrite", (s) => s.put(item));
      return item;
    },
    async get(id) {
      const db = await open();
      return new Promise((resolve, reject) => {
        const t = db.transaction(STORE, "readonly");
        const s = t.objectStore(STORE);
        const r = s.get(id);
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
      });
    },
    async delete(id) {
      await tx(STORE, "readwrite", (s) => s.delete(id));
      return true;
    },
    async all() {
      const db = await open();
      return new Promise((resolve, reject) => {
        const t = db.transaction(STORE, "readonly");
        const s = t.objectStore(STORE);
        const all = s.getAll();
        all.onsuccess = () => resolve(all.result || []);
        all.onerror = () => reject(all.error);
      });
    },
    async clear() {
      await tx(STORE, "readwrite", (s) => s.clear());
      return true;
    },
  };
})();
