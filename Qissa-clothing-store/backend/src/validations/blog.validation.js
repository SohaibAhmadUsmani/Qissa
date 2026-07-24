import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),

  excerpt: z.string().min(1, "Excerpt is required"),

  content: z.string().min(1, "Content is required"),

  coverImage: z.string().min(1, "Cover image is required"),

  author: z.string().optional(),

  category: z.string().min(1, "Category is required"),

  tags: z.array(z.string()).optional(),

  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});
