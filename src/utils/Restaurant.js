import { mongoose } from "mongoose";

const RestaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, 
            maxlength: 100, 
        },
        address: {
            type: String,
            default: "",
            maxlength: 100,
        },
        url: {
            type: String,
            default: "",
            maxlength: 500,
        },
        image: {
            type: String,
            default: "",
        },
        remarks: {
            type: String,
            maxlength: 200,
            default: "",
        },
        group_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

export const Restaurant = mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);