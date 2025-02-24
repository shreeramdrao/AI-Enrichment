# AI-Powered Profile Enrichment System

🚀 **An AI-driven system that enhances professional profiles by filling in missing job titles, education, skills, and descriptions using OpenAI GPT-4o.**

## 📌 Overview
This project is an **AI-powered profile enrichment system** designed to **automatically complete missing details** in professional profiles. It takes raw JSON input and generates structured, enriched profiles in a predefined **widget-based format**, making it ideal for HR platforms, professional networks, and automated recruitment systems.

## 🔹 Features
✅ **AI-Driven Enrichment** → Uses GPT-4o to intelligently complete missing details in profiles.  
✅ **Predefined Output Format** → Ensures enriched profiles match specific JSON structures (`quickintro.json`, `fullstory.json`, etc.).  
✅ **Automated Input Handling** → Reads input profiles from JSON files (`HighProfileInput.json`, `MediumProfileInput.json`, etc.).  
✅ **Secure API Usage** → Uses `.env` for OpenAI API key (not stored in GitHub).  
✅ **Error Handling & Logging** → Prevents invalid JSON responses, ensures data consistency.  
✅ **Output Storage** → The enriched output is saved in `enriched_output.json`, located in the root directory. Users can check the output by opening the `enriched_output.json` file after running the enrichment process.  
✅ **Custom Input & Output Templates** → Users can provide their own input JSON file and output template to generate enriched profiles based on their specific format.  

## 🔹 Tech Stack
- **Backend**: Node.js, Express.js  
- **AI Framework**: OpenAI GPT-4o  
- **Programming Language**: TypeScript  
- **Data Format**: JSON  
- **Version Control**: Git, GitHub  

## 🔹 Setup Instructions
### 📥 Installation
1️⃣ Clone the repository:
   ```sh
   git clone https://github.com/shreeramdrao/AI-Enrichment.git
   cd AI-Enrichment
   ```

2️⃣ Install dependencies:
   ```sh
   npm install
   ```

3️⃣ **Set up the OpenAI API key:**
   - Create a `.env` file in the project root:
     ```sh
     cp .env.example .env
     ```
   - Open `.env` and add your OpenAI API key:
     ```sh
     OPENAI_API_KEY=your-api-key-here
     ```

4️⃣ **Run the server:**
   ```sh
   tsc && node dist/server.js
   ```

5️⃣ **Test using cURL:**
   ```sh
   curl -X POST "http://localhost:3000/enrich-profile"
   ```

6️⃣ **Check the Output:**
   - The enriched output will be saved in the `enriched_output.json` file.
   - Open `enriched_output.json` in a text editor or use the following command:
     ```sh
     cat enriched_output.json
     ```

7️⃣ **Customizing Input & Output Templates:**
   - Users can provide their own input JSON file and output template.
   - Place the custom input file inside the `input/` folder.
   - Place the custom output template inside the `output/` folder.
   - Update the file paths in `aiEnrichment.ts` accordingly.

## 🔹 Future Enhancements
🚀 **Support for More AI Models** → Extend support for multiple AI models beyond OpenAI.  
🚀 **More Output Templates** → Add more JSON templates for different use cases.  
🚀 **Real-Time API** → Convert this into a fully hosted API for external integration.  

## 🔹 Contribution Guidelines
Want to contribute? Follow these steps:
1️⃣ Fork the repository.  
2️⃣ Create a new branch (`git checkout -b feature-branch`).  
3️⃣ Commit your changes (`git commit -m "Added new feature"`).  
4️⃣ Push to GitHub (`git push origin feature-branch`).  
5️⃣ Open a Pull Request.  

## 📌 Author
🔥 **Developed by:** [Shreerama D S](https://github.com/shreeramdrao)  
📌 **GitHub Repository:** [Repository Link ](https://github.com/shreeramdrao/AI-Enrichment.git)  
