import { ENV } from "./lib/env.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
// import path from "path";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

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

const PORT = ENV.PORT;

/* ---------- For deployment ---------- */
// if (ENV.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../Front-end/dist")));

//   app.get("*", (_, res) => {
//     res.sendFile(path.join(__dirname, "../Front-end", "dist", "index.html"));
//   });
// }

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(
        "Your MongoDB database is connected successfully to port: ",
        PORT,
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to Database ", err);
    process.exit(1); // Exit code 1 for error and 0 for fine working.
  });
