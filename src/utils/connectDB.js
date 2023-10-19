import { mongoose } from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_API_KEY);
        console.log("connect DB");
    } catch (err) {
        console.log(err);
        throw new Error();
    }
}

export { connectDB };