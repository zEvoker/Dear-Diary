import express from "express";
import { getResponse } from "../services/aichat.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    try {
        const response = await getResponse(message, history);
        res.send(response);
    } catch (error) {
        console.error("Error getting response from AI:", error);
        res.send("Failed to get response");
    }
});

export default router;
