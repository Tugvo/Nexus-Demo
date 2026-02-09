import { GoogleGenAI, Type } from "@google/genai";
import { Agent } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAgentRecommendations = async (
  query: string,
  availableAgents: Agent[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Demo Mode: API Key missing. In a real environment, I would analyze your request against our database to find the perfect agent.";
  }

  try {
    const agentsContext = availableAgents.map(a => 
      `ID: ${a.id}, Name: ${a.name}, Description: ${a.description}, Category: ${a.category}, Price: ${a.price}`
    ).join('\n');

    const prompt = `
      You are an expert AI consultant for the NexusAI marketplace.
      User Query: "${query}"
      
      Available Agents in Database:
      ${agentsContext}
      
      Task: Recommend 1-2 specific agents from the list above that best solve the user's problem. 
      Explain WHY you chose them. If no agent fits perfectly, suggest a general category or feature they should look for.
      Keep the tone helpful and professional.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Low latency
      }
    });

    return response.text || "I couldn't generate a recommendation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error analyzing your request. Please try again later.";
  }
};
