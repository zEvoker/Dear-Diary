import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

let isAwaitingResponse = false;

async function getResponse(msg, history) {
    if (isAwaitingResponse) {
        return "Please wait";
    }

    isAwaitingResponse = true;

    try {
        const model = genAI.getGenerativeModel({ model : "gemini-pro"})
        const chat = model.startChat( {
            history: history || [],
        })
        const result = await chat.sendMessage(msg);
        if (result.response && result.response.candidates && result.response.candidates.length > 0) {
            const firstCandidate = result.response.candidates[0];
            if (firstCandidate.content && firstCandidate.content.parts && firstCandidate.content.parts.length > 0) {
                const text = firstCandidate.content.parts[0].text;
                isAwaitingResponse = false;
                return text;
            }
        }
        throw new Error("unexpected error");
    } catch (error) {
        console.error("Error: ", error);
        isAwaitingResponse = false;
        throw error;
    }
}

export { getResponse };
