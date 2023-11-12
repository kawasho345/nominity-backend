import { mongoose } from "mongoose";

const DateSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            maxLength: 50,
            required: true,  
        },
        schedules: {
            type: Object,
            default: [],
        },
    },
    { timestamps: true }
)

export const Date = mongoose.models.Date || mongoose.model("Date", DateSchema);