import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticle } from '../services/api.js';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setError('');
    getArticle(slug)
      .then((data) => {
        if (mounted) {
          setArticle(data);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || 'Artikel tidak ditemukan.');
        }
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (error) {
    return (
      <section className="article-detail">
        <div className="article-detail__error">{error}</div>
        <Link to="/" className="btn btn--ghost">
          Kembali ke beranda
        </Link>
      </section>
    );
  }

  if (!article) {
    return <div className="article-detail__loading">Memuat artikel...</div>;
  }

  return (
    <section className="article-detail">
      <div className="article-detail__breadcrumb">
        <Link to="/">Beranda</Link> / <span>{article.category}</span>
      </div>
      <h1>{article.title}</h1>
      <div className="article-detail__meta">
        <span>{article.author}</span>
        <span>-</span>
        <span>{new Date(article.created_at).toLocaleString('id-ID')}</span>
        <span>-</span>
        <span>{article.views} views</span>
      </div>
      {article.image_url && (
        <div className="article-detail__image">
          <img src={article.image_url} alt={article.title} />
        </div>
      )}
      <p className="article-detail__excerpt">{article.excerpt}</p>
      <div className="article-detail__content">
        {article.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

