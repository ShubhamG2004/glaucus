import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export const analyzeFishImage = async (base64Image, question = null) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let prompt;
  
  if (question) {
    // For follow-up questions
    prompt = `
      You are Glaucus, a marine biology expert AI. 
      A user has asked about a previously uploaded fish image: "${question}"
      
      Please provide a detailed, accurate answer about the fish in the image, including:
      - Species identification (if not already identified)
      - Behavior and characteristics
      - Habitat information
      - Conservation status
      - Answer to their specific question
      - Any other relevant information
      
      Format your response with clear paragraphs and use emojis where appropriate.
      Maintain a friendly but professional tone.
    `;
  } else {
    // For initial analysis
    prompt = `
      You are Glaucus, a friendly AI marine biology expert 🐠.
      Analyze the fish in this image and provide a comprehensive identification.

      Include these details in your response:
      1. Common name and scientific name (if possible)
      2. Physical characteristics
      3. Edibility/toxicity information
      4. Natural habitat and distribution
      5. Conservation status
      6. One interesting fact about this species
      
      Format your response with clear sections and use emojis to make it engaging.
      Keep the tone professional but friendly.
    `;
  }

  try {
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
  } catch (error) {
    console.error("Error analyzing fish image:", error);
    throw error;
  }
};