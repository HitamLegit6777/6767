const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('detik_token');
}

export function setAuth(auth) {
  localStorage.setItem('detik_token', auth.token);
  localStorage.setItem('detik_user', JSON.stringify(auth.user));
}

export function clearAuth() {
  localStorage.removeItem('detik_token');
  localStorage.removeItem('detik_user');
}

export function getUser() {
  const raw = localStorage.getItem('detik_user');
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (options.auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: 'Request failed.' }));
    throw new Error(payload.message || 'Request failed.');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getCategories() {
  return request('/categories');
}

export function getArticles(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });
  const qs = query.toString();
  return request(`/articles${qs ? `?${qs}` : ''}`);
}

export function getArticle(slug) {
  return request(`/articles/${slug}`);
}

export function login(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function createArticle(payload) {
  return request('/articles', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export function updateArticle(id, payload) {
  return request(`/articles/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export function deleteArticle(id) {
  return request(`/articles/${id}`, {
    method: 'DELETE',
    auth: true
  });
}

export function searchImages(query, perPage = 8) {
  const params = new URLSearchParams();
  params.set('query', query);
  params.set('per_page', String(perPage));
  return request(`/images/search?${params.toString()}`);
}
