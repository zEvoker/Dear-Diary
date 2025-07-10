import dotenv from "dotenv";
dotenv.config({ path: '.env.local' });

export const PORT = 5555;
export const mongoDBURL = process.env.MONGODB_URL;