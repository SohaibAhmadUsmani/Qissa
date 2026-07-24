import express from "express";

import {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogs,
  getBlogBySlug,
  getAdminBlogs,
  getBlogById,
  getBlogCategories,
  changeBlogStatus,
} from "../controllers/blog.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.js";
import { validate } from "../middlewares/validate.js";
import { blogSchema } from "../validations/blog.validation.js";

const router = express.Router();

// Admin Routes (must be before public /:slug)
router.get("/admin/all", protect, adminOnly, getAdminBlogs);
router.get("/admin/:id", protect, adminOnly, getBlogById);
router.post("/admin", protect, adminOnly, validate(blogSchema), createBlog);
router.put("/admin/:id", protect, adminOnly, updateBlog);
router.delete("/admin/:id", protect, adminOnly, deleteBlog);
router.patch("/admin/:id/status", protect, adminOnly, changeBlogStatus);

// Public Routes
router.get("/categories", getBlogCategories);
router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);

export default router;
