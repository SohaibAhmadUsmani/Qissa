import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Search, Loader, Plus, Edit3, Trash2, X, ImageOff, ExternalLink,
  Eye, Send, Archive, FileEdit, ChevronDown, Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { blogService } from '../../services/blogService';
import './admin.css';

const emptyBlog = {
  title: '', excerpt: '', content: '', coverImage: '',
  category: '', author: 'Qissa Wear', tags: [], status: 'DRAFT',
};

const STATUS_STYLES = {
  DRAFT: { bg: '#f0e8e2', color: '#5c4d40' },
  PUBLISHED: { bg: '#e0f7e6', color: '#1a7a3a' },
  ARCHIVED: { bg: '#fdf0d5', color: '#8a6700' },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.04em', whiteSpace: 'nowrap',
      background: style.bg, color: style.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: style.color, flexShrink: 0 }} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

function ActionMenu({ blog, onAction }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const actions = [];
  if (blog.status === 'DRAFT') {
    actions.push({ label: 'Publish', icon: Send, action: 'publish', color: '#1a7a3a' });
    actions.push({ label: 'Edit', icon: Edit3, action: 'edit' });
    actions.push({ label: 'Preview', icon: Eye, action: 'preview' });
    actions.push({ label: 'Delete', icon: Trash2, action: 'delete', color: '#b33a2e' });
  } else if (blog.status === 'PUBLISHED') {
    actions.push({ label: 'Move to Draft', icon: FileEdit, action: 'draft', color: '#8a6700' });
    actions.push({ label: 'Archive', icon: Archive, action: 'archive', color: '#8a6700' });
    actions.push({ label: 'Edit', icon: Edit3, action: 'edit' });
    actions.push({ label: 'Preview', icon: Eye, action: 'preview' });
  } else if (blog.status === 'ARCHIVED') {
    actions.push({ label: 'Publish', icon: Send, action: 'publish', color: '#1a7a3a' });
    actions.push({ label: 'Move to Draft', icon: FileEdit, action: 'draft', color: '#8a6700' });
    actions.push({ label: 'Delete', icon: Trash2, action: 'delete', color: '#b33a2e' });
  }

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        className="admin-btn--icon"
        onClick={() => setOpen(!open)}
        style={{ padding: '4px 8px' }}
      >
        <ChevronDown size={14} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', zIndex: 50,
          minWidth: 160, background: '#fff', borderRadius: 8,
          boxShadow: '0 4px 20px rgba(31,23,18,0.15)',
          border: '1px solid #e5ddd6', padding: 4, marginTop: 4,
        }}>
          {actions.map((a) => (
            <button
              key={a.action}
              onClick={() => { setOpen(false); onAction(blog, a.action); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '7px 12px', border: 'none',
                background: 'transparent', borderRadius: 6,
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                color: a.color || 'var(--admin-text)',
                fontFamily: 'var(--font-body)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f1ee'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <a.icon size={14} />
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminBlogs() {
  const navigate = useNavigate();
  const { user, token } = useSelector((s) => s.auth);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);

  // Modal state
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyBlog);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const limit = 10;

  useEffect(() => {
    if (!token || user?.role !== 'admin') { navigate('/login'); return; }
    fetchBlogs();
  }, [token, user, navigate, page, statusFilter, sort]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = { page, limit, sort };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      const { data } = await blogService.getAdminBlogs(params);
      setBlogs(data.blogs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchBlogs();
  };

  const openCreate = () => {
    setForm({ ...emptyBlog });
    setModal('create');
  };

  const openEdit = (blogId) => {
    const blog = blogs.find((b) => b._id === blogId);
    if (!blog) return;
    setForm({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      coverImage: blog.coverImage || '',
      category: blog.category || '',
      author: blog.author || 'Qissa Wear',
      tags: blog.tags || [],
      status: blog.status || 'DRAFT',
    });
    setModal(blogId);
  };

  const handleSave = async (saveStatus) => {
    if (!form.title || !form.content || !form.excerpt || !form.category || !form.coverImage) {
      toast.error('Title, content, excerpt, category, and cover image are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        status: saveStatus || form.status,
        tags: form.tags.filter((t) => t.trim()),
      };
      if (modal === 'create') {
        await blogService.createBlog(payload);
        toast.success(saveStatus === 'PUBLISHED' ? 'Blog published' : 'Blog saved as draft');
      } else {
        await blogService.updateBlog(modal, payload);
        toast.success('Blog updated');
      }
      setModal(null);
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (blog, action) => {
    switch (action) {
      case 'edit':
        openEdit(blog._id);
        break;
      case 'preview':
        window.open(`/blog/${blog.slug}`, '_blank');
        break;
      case 'publish':
        await changeStatus(blog._id, 'PUBLISHED');
        break;
      case 'draft':
        await changeStatus(blog._id, 'DRAFT');
        break;
      case 'archive':
        await changeStatus(blog._id, 'ARCHIVED');
        break;
      case 'delete':
        handleDelete(blog._id);
        break;
    }
  };

  const changeStatus = async (id, newStatus) => {
    setStatusLoading(id);
    try {
      const { data } = await blogService.updateBlogStatus(id, newStatus);
      toast.success(data.message);
      setBlogs((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus, publishedAt: data.data.publishedAt } : b)),
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change status');
    } finally {
      setStatusLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    setDeleting(id);
    try {
      await blogService.deleteBlog(id);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    if (form.tags.includes(tag)) { setTagInput(''); return; }
    setForm({ ...form, tags: [...form.tags, tag] });
    setTagInput('');
  };

  const removeTag = (idx) => {
    setForm({ ...form, tags: form.tags.filter((_, i) => i !== idx) });
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  if (!token || user?.role !== 'admin') return null;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Blogs</h1>
          <p className="admin-page-subtitle">{blogs.length} blogs total</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>
          <Plus size={16} /> Add Blog
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={16} />
          <input
            type="text"
            className="admin-search-input-field"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {search && (
            <button className="admin-search-clear" onClick={() => { setSearch(''); fetchBlogs(); }}>
              <X size={14} />
            </button>
          )}
        </div>
        <button className="admin-btn" onClick={handleSearch}>
          <Search size={14} /> Search
        </button>

        <select
          className="admin-form-select"
          style={{ width: 'auto', minWidth: 130 }}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        <select
          className="admin-form-select"
          style={{ width: 'auto', minWidth: 120 }}
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="published">Published</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-loading"><Loader size={24} /><p>Loading blogs...</p></div>
      ) : blogs.length === 0 ? (
        <div className="admin-empty">
          <FileText size={40} strokeWidth={1} />
          <h3>No blogs found</h3>
          <p>{search || statusFilter ? 'Try a different filter.' : 'Create your first blog post.'}</p>
        </div>
      ) : (
        <>
          <div className="admin-card">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 50 }}></th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Published Date</th>
                    <th>Created Date</th>
                    <th style={{ width: 80 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog._id}>
                      <td>
                        {blog.coverImage ? (
                          <img src={blog.coverImage} alt="" className="admin-product-img" />
                        ) : (
                          <div className="admin-product-img-placeholder">
                            <ImageOff size={16} />
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {blog.title}
                      </td>
                      <td style={{ color: 'var(--admin-text-muted)' }}>{blog.category}</td>
                      <td>
                        {statusLoading === blog._id ? (
                          <Loader size={14} />
                        ) : (
                          <StatusBadge status={blog.status} />
                        )}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                        {formatDate(blog.publishedAt)}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>
                        {formatDate(blog.createdAt)}
                      </td>
                      <td>
                        <ActionMenu blog={blog} onAction={handleAction} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button className="admin-page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <span className="admin-page-info">Page {page} of {totalPages}</span>
              <button className="admin-page-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ width: 'min(720px, calc(100% - 32px))' }}>
            <div className="admin-modal-header">
              <h2>{modal === 'create' ? 'Add Blog' : 'Edit Blog'}</h2>
              <button className="admin-modal-close" onClick={() => setModal(null)}><X size={18} /></button>
            </div>
            <div className="admin-modal-body" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
              <div className="admin-form-group">
                <label>Cover Image URL *</label>
                <input
                  className="admin-form-input"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {form.coverImage && (
                  <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', maxHeight: 120 }}>
                    <img src={form.coverImage} alt="Preview" style={{ width: '100%', height: 120, objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
              </div>
              <div className="admin-form-group">
                <label>Title *</label>
                <input className="admin-form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Blog title" />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category *</label>
                  <input className="admin-form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Fashion, Style" />
                </div>
                <div className="admin-form-group">
                  <label>Author</label>
                  <input className="admin-form-input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Qissa Wear" />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Tags</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    className="admin-form-input"
                    style={{ flex: 1 }}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button className="admin-btn admin-btn--sm" type="button" onClick={addTag}>Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {form.tags.map((tag, idx) => (
                    <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: 'var(--admin-bg)', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
                      {tag}
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-muted)', padding: 0, display: 'flex' }} onClick={() => removeTag(idx)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="admin-form-group">
                <label>Short Excerpt *</label>
                <textarea className="admin-form-textarea" rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief description of the blog..." />
              </div>
              <div className="admin-form-group">
                <label>Main Content *</label>
                <textarea className="admin-form-textarea" rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your blog content here... (supports HTML)" />
              </div>
            </div>
            <div className="admin-modal-footer" style={{ gap: 8, flexWrap: 'wrap' }}>
              <button className="admin-btn" onClick={() => setModal(null)}>Cancel</button>
              <div style={{ flex: 1 }} />
              {modal === 'create' ? (
                <>
                  <button
                    className="admin-btn"
                    onClick={() => handleSave('DRAFT')}
                    disabled={saving}
                    style={{ borderColor: '#d4c9bf', color: '#5c4d40' }}
                  >
                    {saving ? <Loader size={14} /> : <FileEdit size={14} />}
                    Save Draft
                  </button>
                  <button
                    className="admin-btn admin-btn--primary"
                    onClick={() => handleSave('PUBLISHED')}
                    disabled={saving}
                  >
                    {saving ? <Loader size={14} /> : <Send size={14} />}
                    Publish
                  </button>
                </>
              ) : (
                <>
                  {form.status !== 'PUBLISHED' && (
                    <button
                      className="admin-btn admin-btn--primary"
                      onClick={() => handleSave('PUBLISHED')}
                      disabled={saving}
                    >
                      {saving ? <Loader size={14} /> : <Send size={14} />}
                      Publish
                    </button>
                  )}
                  {form.status !== 'DRAFT' && (
                    <button
                      className="admin-btn"
                      onClick={() => handleSave('DRAFT')}
                      disabled={saving}
                      style={{ borderColor: '#d4c9bf', color: '#5c4d40' }}
                    >
                      {saving ? <Loader size={14} /> : <FileEdit size={14} />}
                      Save as Draft
                    </button>
                  )}
                  {form.status !== 'ARCHIVED' && (
                    <button
                      className="admin-btn"
                      onClick={() => handleSave('ARCHIVED')}
                      disabled={saving}
                      style={{ borderColor: '#f5c6c1', color: '#8a6700' }}
                    >
                      {saving ? <Loader size={14} /> : <Archive size={14} />}
                      Archive
                    </button>
                  )}
                  {!saving && (
                    <button
                      className="admin-btn"
                      onClick={() => handleSave(form.status)}
                      disabled={saving}
                    >
                      Save Changes
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
