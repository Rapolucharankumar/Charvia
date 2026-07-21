import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ResumeData {
  title?: string;
  content: any; // Raw JSON from the Resume table
}

export interface EnhancedPortfolioData {
  hero: {
    title: string;
    subtitle: string;
  };
  about: {
    text: string;
  };
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    company: string;
    role: string;
    duration: string;
    highlights: string[];
  }[];
  projects: {
    name: string;
    description: string;
    link?: string;
    technologies: string[];
  }[];
}

export async function enhanceResumeForPortfolio(resumeData: ResumeData): Promise<EnhancedPortfolioData> {
  const prompt = `
    You are an expert AI Career Coach and UX Copywriter.
    I am providing you with raw resume data. Your task is to transform this data into an engaging, professional, and modern Portfolio website structure.

    Instructions:
    1. Rewrite the professional summary into a punchy 'About Me' section.
    2. Enhance the work experience bullet points. Make them action-oriented and impactful.
    3. Suggest a compelling Hero section title and subtitle.
    4. Group skills logically.
    5. Return the result strictly as a valid JSON object matching this schema:
    {
      "hero": { "title": "...", "subtitle": "..." },
      "about": { "text": "..." },
      "skills": [ { "category": "...", "items": ["..."] } ],
      "experience": [ { "company": "...", "role": "...", "duration": "...", "highlights": ["..."] } ],
      "projects": [ { "name": "...", "description": "...", "technologies": ["..."] } ]
    }

    Resume Data:
    ${JSON.stringify(resumeData.content, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("AI returned empty response");

    return JSON.parse(jsonText) as EnhancedPortfolioData;
  } catch (error) {
    console.error("Error enhancing resume for portfolio:", error);
    throw new Error("Failed to enhance resume data.");
  }
}
