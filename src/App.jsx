import { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from './api/notes';
import NoteItem from './components/NoteItem';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getNotes(controller.signal)
      .then(setNotes)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(`Не вдалося завантажити нотатки: ${err.message}`);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  // Виконує дію, показує помилку; повертає true при успіху
  const run = async (action, errorText) => {
    setError('');
    try {
      await action();
      return true;
    } catch (err) {
      setError(`${errorText}: ${err.message}`);
      return false;
    }
  };

  const addNote = (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;
    return run(async () => {
      const newNote = await createNote(text);
      setNotes((prev) => [...prev, newNote]);
      setInputText('');
    }, 'Не вдалося додати нотатку');
  };

  const saveNote = (id, text) =>
    run(async () => {
      const updated = await updateNote(id, text);
      setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    }, 'Не вдалося зберегти нотатку');

  const removeNote = (id) =>
    run(async () => {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    }, 'Не вдалося видалити нотатку');

  return (
    <div className="app">
      <h1>Мої нотатки</h1>

      {error && <p className="error" role="alert">{error}</p>}

      {loading ? (
        <p>Завантаження...</p>
      ) : notes.length === 0 ? (
        <p>Нотаток поки немає</p>
      ) : (
        <ul className="notes">
          {notes.map((note) => (
            <NoteItem key={note._id} note={note} onSave={saveNote} onDelete={removeNote} />
          ))}
        </ul>
      )}

      <form className="add-form" onSubmit={addNote}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Нова нотатка..."
        />
        <button type="submit">Додати</button>
      </form>
    </div>
  );
}

export default App;
