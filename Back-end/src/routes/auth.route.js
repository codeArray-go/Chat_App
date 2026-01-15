import express from "express";

const router = express.Router();

router.use("/signup", (req, res) => {
  res.send("Signup Endpoint");
});

router.use("/login", (req, res) => {
  res.send("login Endpoint");
});

router.use("/logout", (req, res) => {
  res.send("logout Endpoint");
});

export default router;
