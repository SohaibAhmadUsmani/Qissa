import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, Loader } from 'lucide-react';
import { blogService } from '../services/blogService';
import fabricBg from '../assets/images/background.jpg';

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-PK', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function estimateReadingTime(content) {
  if (!content) return 1;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [page, category]);

  const fetchCategories = async () => {
    try {
      const { data } = await blogService.getBlogCategories();
      setCategories(data.data || []);
    } catch {
      // silently fail
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 9 };
      if (category) params.category = category;
      const { data } = await blogService.getBlogs(params);
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setPage(1);
    try {
      setLoading(true);
      const params = { page: 1, limit: 9 };
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      const { data } = await blogService.getBlogs(params);
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const filtered = blogs;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: `url(${fabricBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.4)',
        minHeight: '100vh',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '40px 20px 80px',
          fontFamily: "'Playfair Display', serif",
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{
              fontSize: 42, fontWeight: 400, margin: '0 0 8px',
              color: '#1f1712', letterSpacing: '-0.02em',
            }}>
              The Qissa Edit
            </h1>
            <p style={{
              fontSize: 15, color: '#8a7a6e', maxWidth: 500, margin: '0 auto',
              fontFamily: "'Inter', sans-serif", lineHeight: 1.7,
            }}>
              Stories, style guides, and inspiration from the world of Qissa Wear.
            </p>
          </div>

      {/* Search & Filter */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 32,
        flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          display: 'flex', gap: 8, width: '100%', maxWidth: 480,
        }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', border: '1px solid #e5ddd6',
            borderRadius: 12, padding: '0 14px',
          }}>
            <Search size={16} color="#8a7a6e" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{
                flex: 1, border: 'none', outline: 'none', padding: '10px 0',
                fontSize: 13, color: '#1f1712', background: 'transparent',
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 20px', background: '#1f1712', color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            }}
          >
            Search
          </button>
        </div>

        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => handleCategoryChange('')}
              style={{
                padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                border: '1px solid #e5ddd6', background: !category ? '#1f1712' : '#fff',
                color: !category ? '#fff' : '#1f1712', cursor: 'pointer',
                fontFamily: "'Inter', sans-serif", transition: 'all 0.2s',
              }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(category === cat ? '' : cat)}
                style={{
                  padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                  border: '1px solid #e5ddd6',
                  background: category === cat ? '#1f1712' : '#fff',
                  color: category === cat ? '#fff' : '#1f1712', cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif", transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '80px 0', gap: 12, color: '#8a7a6e',
        }}>
          <Loader size={20} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13 }}>Loading articles...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 0', color: '#8a7a6e',
          fontFamily: "'Inter', sans-serif",
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 500, margin: '0 0 8px', color: '#1f1712' }}>No articles found</h3>
          <p style={{ fontSize: 13 }}>Try a different search or category.</p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 28,
          }}>
            {filtered.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article style={{
                  background: '#fff', borderRadius: 16, overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(31,23,18,0.06), 0 4px 12px rgba(31,23,18,0.04)',
                  transition: 'all 0.3s ease', height: '100%',
                  display: 'flex', flexDirection: 'column',
                  border: '1px solid #f0e8e2',
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(31,23,18,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(31,23,18,0.06), 0 4px 12px rgba(31,23,18,0.04)';
                  }}
                >
                  <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                    <span style={{
                      position: 'absolute', top: 12, left: 12,
                      padding: '4px 12px', borderRadius: 999,
                      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                      fontSize: 11, fontWeight: 600, color: '#1f1712',
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {blog.category}
                    </span>
                  </div>
                  <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{
                      fontSize: 18, fontWeight: 600, margin: '0 0 8px',
                      color: '#1f1712', lineHeight: 1.35,
                      fontFamily: "'Playfair Display', serif",
                    }}>
                      {blog.title}
                    </h2>
                    <p style={{
                      fontSize: 13, color: '#8a7a6e', lineHeight: 1.7,
                      margin: '0 0 16px', flex: 1,
                      fontFamily: "'Inter', sans-serif",
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {blog.excerpt}
                    </p>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      paddingTop: 16, borderTop: '1px solid #f0e8e2',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#8a7a6e', fontFamily: "'Inter', sans-serif" }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={12} />
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} />
                          {estimateReadingTime(blog.content)} min read
                        </span>
                      </div>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: 12, fontWeight: 600, color: '#b2493c',
                        fontFamily: "'Inter', sans-serif",
                      }}>
                        Read More <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, paddingTop: 40,
            }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  background: '#fff', border: '1px solid #e5ddd6', color: page <= 1 ? '#d4c9bf' : '#1f1712',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Previous
              </button>
              <span style={{ fontSize: 12, color: '#8a7a6e', margin: '0 8px', fontFamily: "'Inter', sans-serif" }}>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                style={{
                  padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  background: '#fff', border: '1px solid #e5ddd6', color: page >= totalPages ? '#d4c9bf' : '#1f1712',
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
        </div>
      </div>
    </div>
  );
}
