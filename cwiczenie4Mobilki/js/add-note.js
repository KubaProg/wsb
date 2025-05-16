let db;

const request = indexedDB.open("WeatherNotesDB", 1);

request.onerror = () => {
  console.error("Błąd podczas otwierania IndexedDB");
};

request.onsuccess = () => {
  db = request.result;
};

request.onupgradeneeded = (event) => {
  db = event.target.result;
  const store = db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
  store.createIndex("title", "title", { unique: false });
};

document.getElementById("note-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("note-title").value;
  const content = document.getElementById("note-content").value;

  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");

  const note = {
    title,
    content,
    timestamp: new Date(),
  };

  const requestAdd = store.add(note);

  requestAdd.onsuccess = () => {
    document.getElementById("status").textContent = "Notatka zapisana!";
    document.getElementById("note-form").reset();
  };

  requestAdd.onerror = () => {
    document.getElementById("status").textContent = "Błąd zapisu notatki.";
  };
});
