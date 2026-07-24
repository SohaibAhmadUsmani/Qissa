import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag, User, Loader } from 'lucide-react';
import { blogService } from '../services/blogService';

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

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setNotFound(false);
      const { data } = await blogService.getBlogBySlug(slug);
      setBlog(data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      }
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 20px', gap: 12, color: '#8a7a6e',
        fontFamily: "'Inter', sans-serif",
      }}>
        <Loader size={20} />
        <span style={{ fontSize: 13 }}>Loading article...</span>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div style={{
        textAlign: 'center', padding: '120px 20px',
        fontFamily: "'Inter', sans-serif",
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 500, color: '#1f1712', margin: '0 0 8px' }}>
          Article not found
        </h2>
        <p style={{ fontSize: 13, color: '#8a7a6e', marginBottom: 24 }}>
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/blog"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 24px', background: '#1f1712', color: '#fff',
            borderRadius: 12, textDecoration: 'none', fontSize: 13, fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} /> Back to Blogs
        </Link>
      </div>
    );
  }

  const readingTime = estimateReadingTime(blog.content);

  return (
    <div style={{
      maxWidth: 800, margin: '0 auto', padding: '40px 20px 80px',
      fontFamily: "'Playfair Display', serif",
    }}>
      {/* Back Button */}
      <Link
        to="/blog"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 500, color: '#8a7a6e', textDecoration: 'none',
          marginBottom: 32, fontFamily: "'Inter', sans-serif",
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#1f1712'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#8a7a6e'; }}
      >
        <ArrowLeft size={14} /> Back to Blogs
      </Link>

      {/* Category Badge */}
      <span style={{
        display: 'inline-block', padding: '5px 14px', borderRadius: 999,
        background: '#fdf0ed', color: '#b2493c',
        fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
        textTransform: 'uppercase', marginBottom: 16,
        fontFamily: "'Inter', sans-serif",
      }}>
        {blog.category}
      </span>

      {/* Title */}
      <h1 style={{
        fontSize: 36, fontWeight: 500, color: '#1f1712',
        lineHeight: 1.25, margin: '0 0 16px', letterSpacing: '-0.02em',
      }}>
        {blog.title}
      </h1>

      {/* Meta */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        fontSize: 13, color: '#8a7a6e', marginBottom: 32,
        fontFamily: "'Inter', sans-serif",
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <User size={13} />
          {blog.author}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Calendar size={13} />
          {formatDate(blog.publishedAt || blog.createdAt)}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock size={13} />
          {readingTime} min read
        </span>
      </div>

      {/* Cover Image */}
      <div style={{
        borderRadius: 16, overflow: 'hidden', marginBottom: 40,
        boxShadow: '0 2px 8px rgba(31,23,18,0.08)',
      }}>
        <img
          src={blog.coverImage}
          alt={blog.title}
          style={{ width: '100%', maxHeight: 480, objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          fontSize: 16, lineHeight: 1.9, color: '#2d231e',
          fontFamily: "'Inter', sans-serif",
        }}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div style={{
          marginTop: 48, paddingTop: 32, borderTop: '1px solid #f0e8e2',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Tag size={14} color="#8a7a6e" />
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  padding: '4px 12px', borderRadius: 999,
                  background: '#f5f1ee', color: '#1f1712',
                  fontSize: 12, fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Back to bottom */}
      <div style={{ textAlign: 'center', marginTop: 56 }}>
        <Link
          to="/blog"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '12px 32px', background: '#1f1712', color: '#fff',
            borderRadius: 12, textDecoration: 'none', fontSize: 13, fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#b2493c'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#1f1712'; }}
        >
          <ArrowLeft size={14} /> Back to All Articles
        </Link>
      </div>
    </div>
  );
}
