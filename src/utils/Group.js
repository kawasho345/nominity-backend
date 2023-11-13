import { mongoose } from "mongoose";

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 25,
        },
        invitation_code: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: "",
        },
        members: {
            type: Array,
            default: [],
        },
        favorite_food: {
            type: String,
            default: "",
        },
        hated_food: {
            type: String,
            default: "",
        },
        favorite_alcohol: {
            type: String,
            default: "",
        },
        hated_alcohol: {
            type: String,
            default: "",
        },
        allergy: {
            type: String,
            default: "",
        },
        allergy_text: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
)

export const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);