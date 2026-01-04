import { useEffect, useState } from 'react';
import { getArticles } from '../services/api.js';
import FeaturedHero from '../components/FeaturedHero.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import BreakingTicker from '../components/BreakingTicker.jsx';

export default function Home({ categories }) {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [categorySections, setCategorySections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [featuredData, trendingData, latestData] = await Promise.all([
          getArticles({ featured: 'true', limit: 5 }),
          getArticles({ sort: 'popular', limit: 6 }),
          getArticles({ limit: 12 })
        ]);

        if (mounted) {
          setFeatured(featuredData);
          setTrending(trendingData);
          setLatest(latestData);
        }
      } catch {
        if (mounted) {
          setFeatured([]);
          setTrending([]);
          setLatest([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadCategorySections() {
      if (!categories.length) {
        return;
      }
      try {
        const picked = categories.slice(0, 4);
        const results = await Promise.all(
          picked.map((cat) => getArticles({ category: cat.slug, limit: 4 }))
        );
        if (mounted) {
          setCategorySections(
            picked.map((cat, index) => ({ category: cat, articles: results[index] }))
          );
        }
      } catch {
        if (mounted) {
          setCategorySections([]);
        }
      }
    }

    loadCategorySections();

    return () => {
      mounted = false;
    };
  }, [categories]);

  return (
    <div className="home">
      <BreakingTicker items={trending.slice(0, 4)} />
      <section className="hero-grid">
        <FeaturedHero article={featured[0]} />
        <div className="hero-side">
          <div className="section-header">
            <h2>Terpopuler</h2>
            <span>Update cepat pilihan pembaca</span>
          </div>
          <div className="hero-list">
            {trending.map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </div>
      </section>

      <section className="latest">
        <div className="section-header">
          <h2>Berita Terkini</h2>
          <span>Rangkuman harian untuk kamu</span>
        </div>
        {loading ? (
          <div className="skeleton-grid">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="skeleton-card" />
            ))}
          </div>
        ) : (
          <div className="latest-grid">
            {latest.map((article) => (
              <ArticleCard key={article.id} article={article} variant="stacked" />
            ))}
          </div>
        )}
      </section>

      <section className="category-sections">
        {categorySections.map((section) => (
          <div key={section.category.id} id={section.category.slug} className="category-block">
            <div className="section-header">
              <h3>{section.category.name}</h3>
              <span>Update terbaru {section.category.name.toLowerCase()}</span>
            </div>
            <div className="category-grid">
              {section.articles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="tight" />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
