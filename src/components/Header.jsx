import { Link, NavLink } from 'react-router-dom';

export default function Header({ categories }) {
  const today = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="site-header">
      <div className="top-strip">
        <div className="top-strip__inner">
          <div className="top-strip__date">{today}</div>
          <div className="top-strip__actions">Update berita 24 jam</div>
        </div>
      </div>
      <div className="brand-bar">
        <div className="brand-bar__inner">
          <Link to="/" className="brand">
            PusatInformasi
            <span>Portal Berita</span>
          </Link>
          <div className="brand-badge">LIVE</div>
        </div>
      </div>
      <nav className="nav-bar">
        <div className="nav-bar__inner">
          <NavLink to="/" className="nav-link">
            Beranda
          </NavLink>
          {categories.map((category) => (
            <a key={category.id} href={`/#${category.slug}`} className="nav-link">
              {category.name}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
