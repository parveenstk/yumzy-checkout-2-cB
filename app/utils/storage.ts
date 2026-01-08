// utils/storage.ts

type StorageType = 'local' | 'session';

const isClient = typeof window !== 'undefined';

// setting storage type
function getStorage(type: StorageType): Storage | null {
    if (!isClient) return null;
    return type === 'local' ? window.localStorage : window.sessionStorage;
}

// save data in local or session storage based on details proviede
export function saveToStorage<T>(key: string, value: T, type: StorageType = 'local') {
    const storage = getStorage(type);
    if (!storage) return;

    try {
        const data = JSON.stringify(value);
        storage.setItem(key, data);
    } catch (error) {
        console.error(`Error saving to ${type}Storage`, error);
    }
}

// get data from local or session storage based on details proviede
export function getFromStorage<T>(key: string, type: StorageType = 'local'): T | null {
    const storage = getStorage(type);
    if (!storage) return null;

    try {
        const item = storage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading from ${type}Storage`, error);
        return null;
    }
}

// remove data from local or session storage based on details proviede
export function removeFromStorage(key: string, type: StorageType = 'local') {
    const storage = getStorage(type);
    if (!storage) return;

    try {
        storage.removeItem(key);
    } catch (error) {
        console.error(`Error removing from ${type}Storage`, error);
    }
}

// clean all the storage
export const cleanStorage = () => {
    window.localStorage.clear()
    window.sessionStorage.clear()
};
