import { mongoose } from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        user_id: {
            type: String,
            default: "",  
        },
        content: {
            type: String,
            required: true,
            maxlength: 400,
        },
        group_id: {
            type: String,
            required: true,
        },
        is_bot: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
)

export const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);