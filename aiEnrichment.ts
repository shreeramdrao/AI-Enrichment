import { Request, Response } from "express";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize OpenAI API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to read input JSON from a file
const readJsonFile = (filePath: string) => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`❌ Error reading file ${filePath}:`, error);
        return null;
    }
};

// AI Enrichment Function with Streaming
export const doAIEnrichment = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        console.log("🔹 Received API request for AI enrichment");

        // Set the input file path (use actual file name as per your test case)
        const inputFilePath = path.join(__dirname, "input", "HighProfileInput.json"); // Change as needed
        const inputData = readJsonFile(inputFilePath);

        if (!inputData) {
            return res.status(400).json({ error: "Invalid input file format." });
        }

        console.log("✅ Loaded input data:", inputData);

        // Load the expected output format (modify file path as needed)
        const outputTemplatePath = path.join(__dirname, "output", "fullstory.json"); // Change as needed
        const outputTemplate = readJsonFile(outputTemplatePath);

        if (!outputTemplate) {
            return res.status(400).json({ error: "Invalid output template file format." });
        }

        console.log("✅ Loaded output template:", outputTemplate);

        // Call OpenAI API to enrich missing fields with streaming
        console.log("📜 Sending missing data to OpenAI...");
        const enrichmentPrompt = `
        You are an AI that enriches professional profiles.
        Your job is to fill missing details (job titles, education, skills, descriptions) using the given input.

        **STRICT RULES:**
        - Use the exact structure of the provided output template.
        - DO NOT add extra fields or remove existing fields.
        - Keep JSON keys and structure unchanged.
        - Use the input data to populate missing values.

        **Input Data:**
        ${JSON.stringify(inputData)}

        **Output Template Format:**
        ${JSON.stringify(outputTemplate)}

        Generate the enriched output by filling in missing values while keeping the structure identical to the provided template.
        Return only valid JSON.
        `;

        // Stream response from OpenAI
        const stream = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: enrichmentPrompt }],
            temperature: 0.2,
            stream: true, // Enables streaming
        });

        let enrichedData = "";

        // Process chunks as they arrive
        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content; // Correct way to get streamed content
            if (delta) {
                enrichedData += delta;
                process.stdout.write(delta); // Display output in real-time
            }
        }

        console.log("\n✅ OpenAI returned enriched data.");

        // Extract only the JSON object from OpenAI response
        let jsonMatch = enrichedData.match(/\{[\s\S]*\}/); // Find JSON block

        if (!jsonMatch) {
            console.error("❌ OpenAI did not return valid JSON:", enrichedData);
            return res.status(500).json({ error: "AI response was not valid JSON." });
        }

        let parsedData = JSON.parse(jsonMatch[0]); // Parse only the extracted JSON

        // Save enriched output to file
        const enrichedFilePath = path.join(__dirname, "enriched_output.json");
        fs.writeFileSync(enrichedFilePath, JSON.stringify(parsedData, null, 2), "utf8");
        console.log("✅ AI response saved to:", enrichedFilePath);

        return res.json({ message: "Enriched data saved successfully", enrichedData: parsedData });

    } catch (error: any) {
        console.error("❌ Error processing request:", error.message || error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
