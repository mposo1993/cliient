import { useState } from 'react';

function NoteItem({ note, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(note.text);

  const startEdit = () => {
    setText(note.text);
    setEditing(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (await onSave(note._id, text.trim())) setEditing(false);
  };

  if (editing) {
    return (
      <li className="note">
        <form className="note-row" onSubmit={submit}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          <div className="actions">
            <button type="submit" disabled={!text.trim()}>Зберегти</button>
            <button type="button" onClick={() => setEditing(false)}>Скасувати</button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="note">
      <div className="note-row">
        <span>{note.text}</span>
        <div className="actions">
          <button onClick={startEdit}>Редагувати</button>
          <button onClick={() => onDelete(note._id)}>Видалити</button>
        </div>
      </div>
    </li>
  );
}

export default NoteItem;
