import { mongoose } from "mongoose";

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
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
    },
    { timestamps: true }
)

export const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);