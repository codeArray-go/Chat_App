import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";

const app = express();
const __dirname = path.resolve();

app.use(express.json()); //req.body
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoute);

const PORT = ENV.PORT;

// Make web ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Front-end/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../Front-end", "dist", "index.html"));
  });
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        "Your MongoDB database is connected successfully to port: ",
        PORT
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to Database ", err);
    process.exit(1); // Exit code 1 for error and 0 for fine working.
  });
