import { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  const [notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/notes')
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }, []);

  const addNote = () => {
    if (!inputText.trim()) return;

    fetch('http://localhost:3001/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputText }),
    })
      .then((res) => res.json())
      .then((newNote) => {
        setNotes([...notes, newNote]);
        setInputText('');
      });
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditText(note.text);
  };

  const saveEdit = (id) => {
    fetch(`http://localhost:3001/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editText }),
    })
      .then((res) => res.json())
      .then((updatedNote) => {
        setNotes(notes.map((note) => (note._id === id ? updatedNote : note)));
        setEditingId(null);
      });
  };

  const deleteNote = (id) => {
    fetch(`http://localhost:3001/api/notes/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setNotes(notes.filter((note) => note._id !== id));
    });
  };

  return (
    <>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h1>Мої нотатки</h1>
        
        <ul style={{ padding: 0 }}>
          {notes.map((note) => (
            <li key={note._id} style={{ marginBottom: '10px', listStyle: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
                {editingId === note._id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={() => saveEdit(note._id)}>Зберегти</button>
                  </>
                ) : (
                  <>
                    <span>{note.text}</span>
                    <div>
                      <button onClick={() => startEdit(note)} style={{ marginLeft: '10px' }}>Редагувати</button>
                      <button onClick={() => deleteNote(note._id)} style={{ marginLeft: '10px' }}>Видалити</button>
                    </div>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Нова нотатка..."
            style={{ flex: 1, padding: '12px 15px', fontSize: '16px', boxSizing: 'border-box' }}
          />
          <button onClick={addNote} style={{ padding: '12px 20px', fontSize: '16px', boxSizing: 'border-box' }}>Додати</button>
        </div>
      </div>
      <SpeedInsights />
    </>
  );
}

export default App;