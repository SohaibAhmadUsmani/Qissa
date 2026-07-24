import Groq from "groq-sdk";

let groqInstance = null;

export function getGroq() {
  if (!groqInstance) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is missing in environment variables");
    }
    groqInstance = new Groq({ apiKey });
  }
  return groqInstance;
}

export default { getGroq };
