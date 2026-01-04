import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { getCategories } from './services/api.js';

export default function App() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    getCategories()
      .then((data) => {
        if (mounted) {
          setCategories(data);
        }
      })
      .catch(() => {
        if (mounted) {
          setCategories([]);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <Header categories={categories} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home categories={categories} />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
