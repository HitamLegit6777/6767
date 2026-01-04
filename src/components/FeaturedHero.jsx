import { Link } from 'react-router-dom';

export default function FeaturedHero({ article }) {
  if (!article) {
    return null;
  }

  return (
    <article className="featured-hero">
      <div className="featured-hero__media">
        {article.image_url && <img src={article.image_url} alt={article.title} />}
      </div>
      <div className="featured-hero__content">
        <div className="featured-hero__badge">Headline</div>
        <Link to={`/article/${article.slug}`} className="featured-hero__title">
          {article.title}
        </Link>
        {article.excerpt && <p className="featured-hero__excerpt">{article.excerpt}</p>}
        <div className="featured-hero__meta">
          {article.category} - {article.author}
        </div>
      </div>
    </article>
  );
}

