"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doAIEnrichment = void 0;
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Initialize OpenAI API
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
// Function to read input JSON from a file
const readJsonFile = (filePath) => {
    try {
        const data = fs_1.default.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        console.error(`❌ Error reading file ${filePath}:`, error);
        return null;
    }
};
// AI Enrichment Function
const doAIEnrichment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        console.log("🔹 Received API request for AI enrichment");
        // Set the input file path (use actual file name as per your test case)
        const inputFilePath = path_1.default.join(__dirname, "input", "MediumProfileInput.json"); // Change file as needed
        const inputData = readJsonFile(inputFilePath);
        if (!inputData) {
            return res.status(400).json({ error: "Invalid input file format." });
        }
        console.log("✅ Loaded input data:", inputData);
        // Load the expected output format (modify file path as needed)
        const outputTemplatePath = path_1.default.join(__dirname, "output", "quickintro.json"); // Change this to match the required template
        const outputTemplate = readJsonFile(outputTemplatePath);
        if (!outputTemplate) {
            return res.status(400).json({ error: "Invalid output template file format." });
        }
        console.log("✅ Loaded output template:", outputTemplate);
        // Call OpenAI API to enrich missing fields
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
        const response = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "system", content: enrichmentPrompt }],
            temperature: 0.2,
        });
        if (!((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content)) {
            throw new Error("OpenAI returned an empty response.");
        }
        let rawResponse = ((_d = (_c = response.choices[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) || "";
        // Extract only the JSON object from OpenAI response
        let jsonMatch = rawResponse.match(/\{[\s\S]*\}/); // Find JSON block
        if (!jsonMatch) {
            console.error("❌ OpenAI did not return valid JSON:", rawResponse);
            return res.status(500).json({ error: "AI response was not valid JSON." });
        }
        let enrichedData = JSON.parse(jsonMatch[0]); // Parse only the extracted JSON
        console.log("✅ OpenAI returned enriched data:", enrichedData);
        // Save enriched output to file
        const enrichedFilePath = path_1.default.join(__dirname, "enriched_output.json");
        fs_1.default.writeFileSync(enrichedFilePath, JSON.stringify(enrichedData, null, 2), "utf8");
        console.log("✅ AI response saved to:", enrichedFilePath);
        return res.json({ message: "Enriched data saved successfully", enrichedData });
    }
    catch (error) {
        console.error("❌ Error processing request:", error.message || error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.doAIEnrichment = doAIEnrichment;
