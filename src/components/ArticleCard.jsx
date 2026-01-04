import { Link } from 'react-router-dom';

export default function ArticleCard({ article, variant = 'default' }) {
  return (
    <article className={`article-card article-card--${variant}`}>
      {article.image_url && (
        <Link to={`/article/${article.slug}`} className="article-card__media">
          <img src={article.image_url} alt={article.title} loading="lazy" />
        </Link>
      )}
      <div className="article-card__body">
        <div className="article-card__meta">
          <span>{article.category}</span>
          <span>-</span>
          <span>{new Date(article.created_at).toLocaleDateString('id-ID')}</span>
        </div>
        <Link to={`/article/${article.slug}`} className="article-card__title">
          {article.title}
        </Link>
        {article.excerpt && <p className="article-card__excerpt">{article.excerpt}</p>}
      </div>
    </article>
  );
}

