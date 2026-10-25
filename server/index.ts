import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import Requirement from "./src/models/Requirements";
import { requirementSchema } from "./src/validation/schema";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

// Create requirement
app.post("/api/requirements", async (req: Request, res: Response) => {
  const parsed = requirementSchema.safeParse(req.body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return res
      .status(400)
      .json({ error: `${issue.path.join(".")}: ${issue.message}` });
  }
  try {
    const doc = await Requirement.create(parsed.data);
    res.status(201).json({
      message: "Requirement posted",
      category: doc.category,
      data: doc,
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// List requirements (optional filter: ?category=crew)
app.get("/api/requirements", async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const filter: Record<string, string> = {};
    if (category) filter.category = category;

    const docs = await Requirement.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

async function main() {
  await mongoose.connect(process.env.MONGO_URI as string);
  app.listen(Number(process.env.PORT) || 5000, () =>
    console.log("Server running"),
  );
}
main();
