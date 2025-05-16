let db;

const request = indexedDB.open("WeatherNotesDB", 1);

request.onerror = () => {
  console.error("Błąd podczas otwierania IndexedDB");
};

request.onsuccess = () => {
  db = request.result;
  showNotes();
};

function showNotes() {
  const tx = db.transaction("notes", "readonly");
  const store = tx.objectStore("notes");

  const requestGet = store.getAll();

  requestGet.onsuccess = () => {
    const notes = requestGet.result;
    const notesList = document.getElementById("notes-list");

    if (notes.length === 0) {
      notesList.innerHTML = "<p>Brak zapisanych notatek.</p>";
      return;
    }

    notesList.innerHTML = notes
      .map(note => `
        <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
          <h3>${note.title}</h3>
          <p>${note.content}</p>
          <small>${new Date(note.timestamp).toLocaleString()}</small><br>
          <button onclick="deleteNote(${note.id})">Usuń</button>
        </div>
      `)
      .join("");
  };
}

function deleteNote(id) {
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");
  const requestDelete = store.delete(id);

  requestDelete.onsuccess = () => {
    showNotes(); // odśwież listę po usunięciu
  };
}
