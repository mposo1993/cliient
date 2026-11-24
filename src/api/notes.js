const BASE = `${import.meta.env.VITE_API_URL ?? 'https://test-nonatki-server.onrender.com'}/api/notes`;

async function request(url = BASE, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    throw new Error(`Помилка сервера (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

export const getNotes = async (signal) => {
  const data = await request(BASE, { signal });
  if (!Array.isArray(data)) throw new Error('Неочікувана відповідь сервера');
  return data;
};

export const createNote = (text) =>
  request(BASE, { method: 'POST', body: JSON.stringify({ text }) });

export const updateNote = (id, text) =>
  request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify({ text }) });

export const deleteNote = (id) => request(`${BASE}/${id}`, { method: 'DELETE' });
