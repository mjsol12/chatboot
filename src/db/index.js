const dbName = "MyChatBoxDatabase";
const dbVersion = 1;
let db;

const initDB = () => {
  return new Promise((resolve, reject) => {
    // Open (or create) a database
    const request = indexedDB.open(dbName, dbVersion);

    // This event is only implemented in recent browsers
    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      // Create an object store (kind of like a table in a relational database)

      if (!db.objectStoreNames.contains("messages")) {
        db.createObjectStore("messages", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = function (event) {
      db = request.result;
      resolve(db);
    };

    request.onerror = function (event) {
      reject(`Error opening database: ${event.target.error}`);
    };
  });
};

const addUser = (user) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["messages"], "readwrite");
    const objectStore = transaction.objectStore("messages");

    const addUserRequest = objectStore.add(user);

    addUserRequest.onsuccess = () => {
      resolve("User added successfully!");
    };

    addUserRequest.onerror = (event) => {
      reject(`Error adding user: ${event.target.error}`);
    };
  });
};

const getMessages = () => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["messages"], "readonly");
    const objectStore = transaction.objectStore("messages");
    const getAllRequest = objectStore.getAll();

    getAllRequest.onsuccess = () => {
      resolve(getAllRequest.result);
    };

    getAllRequest.onerror = (event) => {
      reject(`Error getting users: ${event.target.error}`);
    };
  });
};

export { initDB, addUser, getMessages };
