import { mongoose } from "mongoose";

const QuestionnaireSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 25,
        },
        date_ids: {
            type: Array,
            default: [],
        },
        overview: {
            type: String,
            maxlength: 200,
            default: "",
        },
        remarks: {
            type: Array,
            default: [],
        },
        group_id: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

export const Questionnaire = mongoose.models.Questionnaire || mongoose.model("Questionnaire", QuestionnaireSchema);