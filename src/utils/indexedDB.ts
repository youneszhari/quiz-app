// utils/indexedDB.js

// Open or create the IndexedDB database
const openDB = (dbName, storeName) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        }
      };
  
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };
  
  // Save data to IndexedDB
  export const saveResultToDB = async (dbName, storeName, data) => {
    const db = await openDB(dbName, storeName);
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };
  
  // Retrieve all data from IndexedDB
  export const getAllResultsFromDB = async (dbName, storeName) => {
    const db = await openDB(dbName, storeName);
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };