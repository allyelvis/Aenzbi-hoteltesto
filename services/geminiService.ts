
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Sale } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

// This is a simplified check. In a real app, you would not expose the key to the client.
const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateMenuItemDescription = async (itemName: string, category: string): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Please set the API_KEY environment variable.";
  try {
    const prompt = `Generate a short, enticing, and creative menu description for an item named "${itemName}" which is in the "${category}" category. Keep it under 25 words.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating menu description:", error);
    return "Failed to generate description. Please try again later.";
  }
};


export const analyzeSalesData = async (sales: Sale[], question: string): Promise<string> => {
    if (!API_KEY) return "API Key not configured. Please set the API_KEY environment variable.";
    try {
        const salesDataSummary = JSON.stringify(sales.map(s => ({
            date: s.date,
            total: s.total,
            items: s.items.map(i => `${i.quantity}x ${i.name} (${i.category})`).join(', ')
        })), null, 2);

        const prompt = `
You are an expert hospitality data analyst for a system named "Aenzbi HotelResto".
Analyze the following sales data and answer the user's question.
Provide a concise, clear, and friendly answer. If the data doesn't support an answer, say so politely.

**Sales Data (JSON format):**
${salesDataSummary}

**User's Question:**
"${question}"
`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing sales data:", error);
        return "Failed to analyze data. The AI model may be temporarily unavailable.";
    }
};
