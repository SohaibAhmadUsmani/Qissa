import api from './api';

export const blogService = {
  getBlogs(params) {
    return api.get('/blogs', { params });
  },

  getBlogBySlug(slug) {
    return api.get(`/blogs/${slug}`);
  },

  getBlogCategories() {
    return api.get('/blogs/categories');
  },

  getAdminBlogs(params) {
    return api.get('/blogs/admin/all', { params });
  },

  getBlogById(id) {
    return api.get(`/blogs/admin/${id}`);
  },

  createBlog(data) {
    return api.post('/blogs/admin', data);
  },

  updateBlog(id, data) {
    return api.put(`/blogs/admin/${id}`, data);
  },

  deleteBlog(id) {
    return api.delete(`/blogs/admin/${id}`);
  },

  updateBlogStatus(id, status) {
    return api.patch(`/blogs/admin/${id}/status`, { status });
  },
};
