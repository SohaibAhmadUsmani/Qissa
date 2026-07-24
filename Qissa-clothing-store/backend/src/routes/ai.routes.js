import express from "express";
import { testAI, stylistAI } from "../controllers/ai.controller.js";

const router = express.Router();

router.get("/test", testAI);
router.post("/stylist", stylistAI);

export default router;
