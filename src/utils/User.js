import { mongoose } from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 25,
        },
        email: {
            type: String,
            required: true,
            maxlength: 50,
            unique: true,
        },
        icon: {
            type: String,
            default: "",
        },
        favorite_food: {
            type: String,
            maxlength: 200,
            default: "",
        },
        hated_food: {
            type: String,
            maxlength: 200,
            default: "",
        },
        favorite_alcohol: {
            type: String,
            maxlength: 200,
            default: "",
        },
        hated_alcohol: {
            type: String,
            maxlength: 200,
            default: "",
        },
        allergy: {
            type: String,
            maxlength: 200,
            default: "",
        },
        join_groups: {
            type: Array,
            default: [],
        },
        last_group: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model("User", UserSchema);