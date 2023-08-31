export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("costsDb", 1);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            const costsStore = db.createObjectStore("costs", { autoIncrement: true });

            costsStore.createIndex("name", "name", { unique: false });
            costsStore.createIndex("category", "category", { unique: false });
            costsStore.createIndex("month", "month", { unique: false });
            costsStore.createIndex("year", "year", { unique: false });
            costsStore.createIndex("sum", "sum", { unique: false });
            costsStore.createIndex("description", "description", { unique: false });
        };
        request.onsuccess = event => {
            resolve(event.target.result);
        };
        request.onerror = event => {
            reject(event.target.error);
        };
    });
}

export function addItem(db, item) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("costs", "readwrite");
        const store = transaction.objectStore("costs");
        const request = store.add(item);
        request.onsuccess = () => {
            resolve();
        };
        request.onerror = event => {
            reject(event.target.error);
        };
    });
}

export function getAllItems(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("costs", "readonly");
        const store = transaction.objectStore("costs");
        const items = [];

        const request = store.openCursor();

        request.onsuccess = event => {
            const cursor = event.target.result;

            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            } else {
                resolve(items);
            }
        };

        request.onerror = event => {
            reject(event.target.error);
        };
    });
}