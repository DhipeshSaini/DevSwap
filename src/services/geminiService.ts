import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getChatbotResponse(userMessage: string, history: { role: 'user' | 'model', text: string }[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: "You are Marcus Chen, a Senior Product Designer and UI/UX Specialist. You are professional, creative, and collaborative. You are currently discussing a potential barter swap with Dhipesh. You offer Design System & Branding services. Dhipesh offers React Dashboard Implementation. Keep your responses concise and in character for a professional designer. If the user says 'hi' or 'hey', respond with a friendly professional greeting and mention you're excited about the potential swap. Never use markdown formatting like bold or bullet points, keep it like a real chat message.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hey! Sorry, I'm a bit tied up with a design sprint right now. Let's catch up in a bit!";
  }
}
