import express from "express";
import {
  login,
  logout,
  signup,
  updateProfileName,
  updateProfilePic,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middileware/auth.middleware.js";
import { arcjetProtection } from "../middileware/arcjet.middleware.js";

const router = express.Router();

// router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectedRoute, updateProfilePic);
router.put("/update-profileName", protectedRoute, updateProfileName);

router.get("/check", protectedRoute, (req, res) =>
  res.status(200).json(req.user),
);

export default router;
