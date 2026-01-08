
import { GoogleGenAI, Type } from "@google/genai";
import { TransitRoute } from "../types";

// The API key is injected at build time by Vite or at runtime by the environment
const apiKey = process.env.API_KEY;

export const analyzeRouteSafety = async (routes: TransitRoute[]): Promise<TransitRoute[]> => {
  if (!apiKey || apiKey === "undefined") {
    console.error("CRITICAL: API_KEY is missing from environment variables.");
    return routes.map(r => ({ 
      ...r, 
      safetyScore: 50, 
      riskAnalysis: "Configuration Error: API Key not found. Please add API_KEY to your Vercel project settings." 
    }));
  }

  // Always create a fresh instance to ensure the latest config is used
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze these 3 potential transit routes for safety. 
    Evaluate each based on lighting levels, crowd density, and crime history.
    
    Routes data: ${JSON.stringify(routes)}

    Response Requirements:
    - Return a valid JSON array.
    - Each object must have: "id" (string), "safetyScore" (number, 0-100), and "riskAnalysis" (string, 150 chars max).
    - Higher scores mean SAFER routes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              safetyScore: { type: Type.NUMBER },
              riskAnalysis: { type: Type.STRING }
            },
            required: ["id", "safetyScore", "riskAnalysis"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("The AI returned an empty response.");
    
    const analysisResults = JSON.parse(text);
    
    return routes.map(route => {
      const analysis = analysisResults.find((res: any) => res.id === route.id);
      return {
        ...route,
        safetyScore: analysis?.safetyScore ?? 50,
        riskAnalysis: analysis?.riskAnalysis ?? "No specific risks detected for this segment."
      };
    });
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    let userFriendlyMessage = "Safety analysis service is temporarily unavailable.";
    
    // Check for common deployment errors
    if (error.message?.includes("leaked")) {
      userFriendlyMessage = "DEPLOYMENT ERROR: Your API key was reported as leaked. You must generate a NEW key at ai.google.dev and update your Vercel Environment Variables.";
    } else if (error.message?.includes("403") || error.message?.includes("PERMISSION_DENIED")) {
      userFriendlyMessage = "Access Denied: Please verify your API Key and ensure the Gemini API is enabled for your project.";
    } else if (error.message?.includes("quota") || error.message?.includes("429")) {
      userFriendlyMessage = "Rate limit exceeded. Please try again in a moment.";
    }

    return routes.map(r => ({ 
      ...r, 
      safetyScore: 0, 
      riskAnalysis: userFriendlyMessage 
    }));
  }
};
