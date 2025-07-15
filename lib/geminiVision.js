// lib/geminiVision.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const analyzeFishImage = async (base64Image) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are Glaucus, a lovable, friendly AI marine assistant 🐠.
Your job is to identify the fish in the image and answer like a cheerful companion.

Include:
1. Fish species name
2. Is it edible or poisonous?
3. Habitat (where it's found)
4. Is it endangered?
5. One fun fact (make it lively!)
Wrap it with emojis and friendly tone!
`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    },
  ]);

  const response = await result.response;
  return response.text();
};
