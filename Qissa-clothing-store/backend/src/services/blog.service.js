import Blog from "../models/Blog.js";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueSlug(title) {
  let slug = slugify(title);
  let existing = await Blog.findOne({ slug });

  if (!existing) return slug;

  let counter = 1;
  while (existing) {
    const newSlug = `${slug}-${counter}`;
    existing = await Blog.findOne({ slug: newSlug });
    if (!existing) return newSlug;
    counter++;
  }

  return slug;
}

export const blogService = {
  async create(data) {
    const slug = await generateUniqueSlug(data.title);
    const blogData = {
      ...data,
      slug,
      status: data.status || "DRAFT",
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    };
    return Blog.create(blogData);
  },

  async update(id, data) {
    const blog = await Blog.findById(id);
    if (!blog) return null;

    if (data.title && data.title !== blog.title) {
      data.slug = await generateUniqueSlug(data.title);
    }

    if (data.status === "PUBLISHED" && blog.status !== "PUBLISHED") {
      data.publishedAt = new Date();
    }

    return Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },

  async changeStatus(id, status) {
    const blog = await Blog.findById(id);
    if (!blog) return null;

    const update = { status };

    if (status === "PUBLISHED" && blog.status !== "PUBLISHED") {
      update.publishedAt = new Date();
    }

    return Blog.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  },

  async delete(id) {
    const blog = await Blog.findByIdAndDelete(id);
    return blog;
  },

  async getAllPublished(query = {}) {
    const { search, category, page = 1, limit = 9 } = query;

    const filter = { status: "PUBLISHED" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const currentPage = Number(page);
    const pageLimit = Number(limit);
    const skip = (currentPage - 1) * pageLimit;

    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(pageLimit),
      Blog.countDocuments(filter),
    ]);

    return {
      blogs,
      totalBlogs,
      currentPage,
      totalPages: Math.ceil(totalBlogs / pageLimit),
    };
  },

  async getBySlug(slug) {
    return Blog.findOne({ slug, status: "PUBLISHED" });
  },

  async getById(id) {
    return Blog.findById(id);
  },

  async getAllAdmin(query = {}) {
    const { search, status, sort, page = 1, limit = 10 } = query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    else if (sort === "published") sortOption = { publishedAt: -1 };

    const currentPage = Number(page);
    const pageLimit = Number(limit);
    const skip = (currentPage - 1) * pageLimit;

    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(filter).sort(sortOption).skip(skip).limit(pageLimit),
      Blog.countDocuments(filter),
    ]);

    return {
      blogs,
      totalBlogs,
      currentPage,
      totalPages: Math.ceil(totalBlogs / pageLimit),
    };
  },

  async getCategories() {
    return Blog.distinct("category", { status: "PUBLISHED" });
  },
};
