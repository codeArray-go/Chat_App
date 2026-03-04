import { ENV } from "./lib/env.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import { createTables } from "./models/Table.js";

// const __dirname = path.resolve();

/* ---------- BODY PARSERS ---------- */
app.use(express.json({ limit: "15mb" })); // req.body
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

/* ---------- CORS ---------- */
app.use(
  cors({ origin: [ENV.CLIENT_URL, ENV.CLIENT_URL_2], credentials: true }),
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "Server alive 🚀" });
});

const PORT = ENV.PORT;

const startServer = async () => {
  try {
    await createTables();

    console.log("Database is connected successfully");
    server.listen(PORT, () => {
      console.log("Server running on port:", PORT);
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
};

startServer();
