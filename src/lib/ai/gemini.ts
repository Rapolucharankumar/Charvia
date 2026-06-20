import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const atsAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    atsScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 indicating how well the resume is formatted and its overall strength.",
    },
    missingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Keywords or skills that are missing from the resume but are typically expected for the role.",
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key strengths identified in the resume.",
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key weaknesses or areas for improvement identified in the resume.",
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable suggestions to improve the resume.",
    },
  },
  required: ["atsScore", "missingKeywords", "strengths", "weaknesses", "suggestions"],
};

export async function analyzeResume(resumeText: string, jobDescriptionText?: string) {
  let prompt = `You are an expert ATS (Applicant Tracking System) Analyzer and Technical Recruiter.
Analyze the following resume text. `;

  if (jobDescriptionText) {
    prompt += `Compare it against the provided Job Description. `;
  } else {
    prompt += `Provide a general analysis based on standard industry expectations. `;
  }

  prompt += `
Return a JSON object containing the ATS score (0-100), missing keywords, strengths, weaknesses, and actionable suggestions.

Resume Text:
"""
${resumeText}
"""
`;

  if (jobDescriptionText) {
    prompt += `
Job Description Text:
"""
${jobDescriptionText}
"""
`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: atsAnalysisSchema,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate analysis.");
  }

  return JSON.parse(response.text);
}

const jobMatchSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 indicating how well the resume matches the job description.",
    },
    missingSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key skills required by the job description that are missing from the resume.",
    },
    strongSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key skills present in the resume that strongly match the job description.",
    },
    improvementSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable suggestions to improve the resume for this specific job.",
    },
  },
  required: ["matchScore", "missingSkills", "strongSkills", "improvementSuggestions"],
};

export async function calculateJobMatch(resumeText: string, jobDescriptionText: string) {
  const prompt = `You are an expert Technical Recruiter and ATS system.
Compare the following Resume against the Job Description.

Return a JSON object containing the match score (0-100), missing skills, strong skills, and actionable improvement suggestions tailored to this specific job.

Resume Text:
"""
${resumeText}
"""

Job Description Text:
"""
${jobDescriptionText}
"""
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: jobMatchSchema,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate job match analysis.");
  }

  return JSON.parse(response.text);
}

const interviewPrepSchema = {
  type: Type.OBJECT,
  properties: {
    hrQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          modelAnswer: { type: Type.STRING },
        },
        required: ["question", "modelAnswer"]
      },
      description: "Standard HR and cultural fit questions with model answers.",
    },
    technicalQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          modelAnswer: { type: Type.STRING },
        },
        required: ["question", "modelAnswer"]
      },
      description: "Technical or role-specific questions with model answers.",
    },
    behavioralQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          modelAnswer: { type: Type.STRING },
        },
        required: ["question", "modelAnswer"]
      },
      description: "Behavioral and situational questions (STAR method) with model answers.",
    },
  },
  required: ["hrQuestions", "technicalQuestions", "behavioralQuestions"],
};

export async function generateInterviewPrep(company: string, role: string, experience: string) {
  const prompt = `You are an expert Career Coach and Interviewer.
Generate a comprehensive interview preparation guide for the following scenario:

Company: ${company}
Role: ${role}
Experience Level: ${experience}

Create 3-5 high-quality questions for each category: HR, Technical, and Behavioral.
For each question, provide a detailed, excellent "model answer" that a candidate should aim for.

Return a JSON object containing the questions and answers.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewPrepSchema,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate interview prep guide.");
  }

  return JSON.parse(response.text);
}

export interface IntroInputs {
  name: string;
  degree: string;
  college: string;
  skills: string;
  projects: string;
}

const selfIntroSchema = {
  type: Type.OBJECT,
  properties: {
    thirtySecond: {
      type: Type.STRING,
      description: "A concise, 30-second elevator pitch.",
    },
    oneMinute: {
      type: Type.STRING,
      description: "A more detailed, 1-minute professional introduction.",
    },
    hrVersion: {
      type: Type.STRING,
      description: "An introduction tailored for HR and cultural fit interviews.",
    },
    technicalVersion: {
      type: Type.STRING,
      description: "An introduction tailored for technical interviews, emphasizing skills and projects.",
    },
  },
  required: ["thirtySecond", "oneMinute", "hrVersion", "technicalVersion"],
};

export async function generateSelfIntroduction(inputs: IntroInputs) {
  const prompt = `You are an expert Career Coach.
Generate four distinct professional self-introductions for a candidate with the following background:

Name: ${inputs.name}
Degree: ${inputs.degree}
College: ${inputs.college}
Key Skills: ${inputs.skills}
Key Projects: ${inputs.projects}

Provide the following versions:
1. A 30-second elevator pitch.
2. A 1-minute comprehensive introduction.
3. An HR-focused version emphasizing soft skills and cultural fit.
4. A Technical-focused version emphasizing specific technical skills, architecture, and project impacts.

Make them sound natural, confident, and professional.
Return a JSON object containing the four versions.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: selfIntroSchema,
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate self introductions.");
  }

  return JSON.parse(response.text);
}
