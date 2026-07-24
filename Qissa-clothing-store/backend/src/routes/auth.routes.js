import { Router } from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  signupSchema,
  loginSchema,
} from "../validations/auth.validator.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/signup", validate(signupSchema), signup);

router.post("/login", validate(loginSchema), login);
router.get("/test", protect, (req, res) => {
  res.json({
    success: true,
    message: "Protected route reached",
  });
});
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
});
export default router;