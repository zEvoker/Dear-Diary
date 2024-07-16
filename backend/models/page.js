import mongoose from "mongoose";

const pageSchema = mongoose.Schema (
    {
        title: {
            type: String,
            required: false,
        },
        author: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: false,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        mood: {
            type: Number,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Page = mongoose.model('Page', pageSchema)