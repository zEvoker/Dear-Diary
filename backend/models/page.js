import mongoose from "mongoose";

const pageSchema = mongoose.Schema (
    {
        content: {
            type: [String],
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Page = mongoose.model('Page', pageSchema)