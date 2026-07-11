import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { requireAuth } from "./middleware/auth";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { uploadToImgbb } from "./utils/imgbb";
import authRoutes from "./routes/authRoutes";
import recipeRoutes from "./routes/recipeRoutes";
import statsRoutes from "./routes/statsRoutes";

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/stats", statsRoutes);

app.post("/api/upload", requireAuth, async (req, res) => {
  try {
    const { base64Image } = req.body;
    if (!base64Image) {
      return res.status(400).json({ error: "No image provided" });
    }
    const url = await uploadToImgbb(base64Image);
    res.json({ url });
  } catch {
    res.status(500).json({ error: "Image upload failed. Try a smaller image" });
  }
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Savorly server running on port ${env.PORT}`);
  });
});
