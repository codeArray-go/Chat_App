import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use("/api/auth", authRoutes);

// Make web ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Front-end/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Front-end", "dist", "index.html"));
  });
}

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
