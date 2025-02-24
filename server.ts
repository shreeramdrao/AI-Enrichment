import express, { Request, Response } from "express";
import { doAIEnrichment } from "./aiEnrichment";

const app = express();
app.use(express.json());

// API Endpoint for AI Enrichment
app.post("/enrich-profile", async (req: Request, res: Response) => {
    await doAIEnrichment(req, res);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});