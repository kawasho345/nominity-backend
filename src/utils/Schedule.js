import { mongoose } from "mongoose";

const ScheduleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 25,
        },
        date: {
            type: String,
            default: "",
            maxlength: 100,
        },
        restaurant_name: {
            type: String,
            maxlength: 100,
            default: "",
        },
        restaurant_address: {
            type: String,
            maxlength: 100,
            default: "",
        },
        restaurant_url: {
            type: String,
            maxlength: 500,
            default: "",
        },
        restaurant_image: {
            type: String,
            default: "",
        },
        price: {
            type: String,
            maxlength: 100,
            default: "",
        },
        number_people: {
            type: String, 
            default: "",
            maxlength: 50,
        },
        remarks: {
            type: String,
            maxlength: 200,
            default: "",
        },
        group_id: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
)

export const Schedule = mongoose.models.Schedule || mongoose.model("Schedule", ScheduleSchema);