import { useEffect, useState } from 'react';
import { searchImages } from '../services/api.js';

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  category_id: '',
  image_url: '',
  is_featured: false
};

export default function ArticleForm({ categories, initial, onSave, onCancel, loading }) {
  const [form, setForm] = useState(emptyForm);
  const [imageQuery, setImageQuery] = useState('');
  const [imageResults, setImageResults] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        excerpt: initial.excerpt || '',
        content: initial.content || '',
        category_id: initial.category_id || '',
        image_url: initial.image_url || '',
        is_featured: Boolean(initial.is_featured)
      });
    } else {
      setForm(emptyForm);
    }
    setImageQuery('');
    setImageResults([]);
    setImageLoading(false);
    setImageError('');
  }, [initial]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      ...form,
      category_id: Number(form.category_id)
    });
  }

  async function handleImageSearch() {
    const clean = imageQuery.trim();
    if (!clean) {
      setImageResults([]);
      setImageError('');
      return;
    }

    setImageLoading(true);
    setImageError('');
    try {
      const results = await searchImages(clean, 8);
      setImageResults(results);
    } catch (err) {
      setImageResults([]);
      setImageError(err.message || 'Gagal mencari gambar.');
    } finally {
      setImageLoading(false);
    }
  }

  function handleUseImage(url) {
    setForm((prev) => ({
      ...prev,
      image_url: url
    }));
  }

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      <div className="article-form__grid">
        <label className="article-form__field">
          <span>Judul</span>
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label className="article-form__field">
          <span>Kategori</span>
          <select name="category_id" value={form.category_id} onChange={handleChange} required>
            <option value="">Pilih kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="article-form__field">
        <span>Ringkasan</span>
        <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows="3" />
      </label>
      <label className="article-form__field">
        <span>Konten</span>
        <textarea name="content" value={form.content} onChange={handleChange} rows="8" required />
      </label>
      <div className="article-form__grid">
        <label className="article-form__field">
          <span>URL Gambar</span>
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="Tempel URL gambar..."
          />
        </label>
        <label className="article-form__field checkbox">
          <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} />
          <span>Jadikan headline</span>
        </label>
      </div>
      <div className="image-search">
        <div className="image-search__row">
          <input
            value={imageQuery}
            onChange={(event) => setImageQuery(event.target.value)}
            placeholder="Cari URL gambar (contoh: teknologi, ekonomi)"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleImageSearch();
              }
            }}
          />
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleImageSearch}
            disabled={imageLoading}
          >
            {imageLoading ? 'Mencari...' : 'Cari Gambar'}
          </button>
        </div>
        {imageError && <div className="image-search__error">{imageError}</div>}
        {imageResults.length > 0 && (
          <div className="image-search__results">
            {imageResults.map((item, index) => (
              <button
                type="button"
                key={`${item.id}-${index}`}
                className="image-search__item"
                onClick={() => handleUseImage(item.full)}
              >
                <img src={item.thumb} alt={item.description || `Hasil ${index + 1}`} loading="lazy" />
                <span>Gunakan</span>
              </button>
            ))}
          </div>
        )}
        {form.image_url && (
          <div className="image-preview">
            <div className="image-preview__label">Preview gambar</div>
            <img src={form.image_url} alt="Preview gambar artikel" loading="lazy" />
          </div>
        )}
      </div>
      <div className="article-form__actions">
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Artikel'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
