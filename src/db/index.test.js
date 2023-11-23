import { render, screen } from "@testing-library/react";
import { initDB, addUser, getMessages } from "./"; // Update the path

describe("IndexedDB functions", () => {
  // Set up a virtual IndexedDB for testing
  beforeAll(() => {
    const request = indexedDB.open("MyChatBoxDatabase", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore("messages", { keyPath: "id", autoIncrement: true });
    };
  });

  // Clean up the virtual IndexedDB after testing
  afterAll(() => {
    const request = indexedDB.deleteDatabase("MyChatBoxDatabase");
    request.onsuccess = () => {
      console.log("Deleted test database successfully");
    };
  });

  test("initDB resolves with a valid database instance", async () => {
    const db = await initDB();
    expect(db).toBeDefined();
  });

  test("getMessages resolves with an array of messages", async () => {
    const messages = await getMessages();
    expect(Array.isArray(messages)).toBe(true);
  });
});
