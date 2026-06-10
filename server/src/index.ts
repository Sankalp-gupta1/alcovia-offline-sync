import express from "express";
import cors from "cors";
import syncRoutes from "./routes/sync.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "alcovia-sync-server"
  });
});

app.use("/api", syncRoutes);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});