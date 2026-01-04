import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  clearAuth,
  createArticle,
  deleteArticle,
  getArticles,
  getCategories,
  getUser,
  updateArticle
} from '../services/api.js';
import ArticleForm from '../components/ArticleForm.jsx';

export default function Dashboard() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchScope, setSearchScope] = useState('title');

  const normalizedSearch = searchText.trim().toLowerCase();
  const includeContent = searchScope === 'title-content';
  const filteredArticles = normalizedSearch
    ? articles.filter((article) => {
        const title = article.title || '';
        if (!includeContent) {
          return title.toLowerCase().includes(normalizedSearch);
        }
        const content = article.content || '';
        const excerpt = article.excerpt || '';
        return `${title} ${excerpt} ${content}`.toLowerCase().includes(normalizedSearch);
      })
    : articles;

  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  async function loadData() {
    try {
      const [cats, articleList] = await Promise.all([
        getCategories(),
        getArticles({ limit: 50 })
      ]);
      setCategories(cats);
      setArticles(articleList);
    } catch (err) {
      setError(err.message || 'Gagal memuat data.');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSave(payload) {
    setSaving(true);
    setError('');

    try {
      if (editing) {
        await updateArticle(editing.id, payload);
      } else {
        await createArticle(payload);
      }
      setEditing(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan artikel.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const ok = window.confirm('Hapus artikel ini?');
    if (!ok) {
      return;
    }

    try {
      await deleteArticle(id);
      await loadData();
    } catch (err) {
      setError(err.message || 'Gagal menghapus artikel.');
    }
  }

  function handleLogout() {
    clearAuth();
    navigate('/login');
  }

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <div>
          <h2>Dashboard Admin</h2>
          <p>Kelola headline, kategori, dan berita terbaru.</p>
        </div>
        <div className="dashboard__actions">
          <button className="btn btn--ghost" onClick={() => setEditing(null)}>
            Artikel Baru
          </button>
          <button className="btn btn--dark" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </div>

      {error && <div className="dashboard__error">{error}</div>}

      <div className="dashboard__grid">
        <div className="dashboard__panel">
          <h3>{editing ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h3>
          <ArticleForm
            categories={categories}
            initial={editing}
            onSave={handleSave}
            onCancel={editing ? () => setEditing(null) : null}
            loading={saving}
          />
        </div>

        <div className="dashboard__panel">
          <h3>Daftar Artikel</h3>
          <div className="table__toolbar">
            <div className="table__search">
              <input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Cari artikel..."
              />
              <select value={searchScope} onChange={(event) => setSearchScope(event.target.value)}>
                <option value="title">Judul</option>
                <option value="title-content">Judul + Isi</option>
              </select>
            </div>
            <div className="table__count">{filteredArticles.length} artikel</div>
          </div>
          <div className="table">
            {filteredArticles.length ? (
              filteredArticles.map((article) => (
                <div key={article.id} className="table__row">
                  <div>
                    <div className="table__title">{article.title}</div>
                    <div className="table__meta">
                      {article.category} - {new Date(article.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  <div className="table__actions">
                    <button className="btn btn--ghost" onClick={() => setEditing(article)}>
                      Edit
                    </button>
                    <button className="btn btn--danger" onClick={() => handleDelete(article.id)}>
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="table__empty">Tidak ada artikel yang cocok.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

