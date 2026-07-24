import { blogService } from "../services/blog.service.js";

export const createBlog = async (req, res) => {
  try {
    const blog = await blogService.create(req.body);

    res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await blogService.update(req.params.id, req.body);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await blogService.delete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const result = await blogService.getAllPublished(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await blogService.getBySlug(req.params.slug);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminBlogs = async (req, res) => {
  try {
    const result = await blogService.getAllAdmin(req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await blogService.getById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBlogCategories = async (req, res) => {
  try {
    const categories = await blogService.getCategories();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const changeBlogStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be DRAFT, PUBLISHED, or ARCHIVED.",
      });
    }

    const blog = await blogService.changeStatus(req.params.id, status);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    const messages = {
      PUBLISHED: "Blog published successfully.",
      DRAFT: "Blog moved to draft.",
      ARCHIVED: "Blog archived successfully.",
    };

    res.status(200).json({
      success: true,
      message: messages[status],
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
