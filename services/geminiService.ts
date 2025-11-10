
import { GoogleGenAI } from "@google/genai";
import { STRATEGY_DETAILS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. The Strategy Assistant will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getStrategyExplanation = async (userPrompt: string, strategyContext: string): Promise<string> => {
  if (!API_KEY) {
    return "The Gemini API key is not configured. Please set the API_KEY environment variable to use the Strategy Assistant.";
  }
  try {
    const fullPrompt = `
      You are an expert financial analyst and AI assistant for the TSS Trading ML System.
      Your role is to explain complex trading concepts in a clear and concise way.

      Here is some context about the investment strategies in the system:
      ${JSON.stringify(STRATEGY_DETAILS, null, 2)}

      The user is currently viewing the "${strategyContext}" strategy.

      User's question: "${userPrompt}"

      Please provide a helpful and informative answer based on the user's question and the provided context.
      Keep your answer focused on financial and machine learning trading concepts.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error while trying to get an answer. Please check the console for details.";
  }
};
