import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { User } from "@/utils/User"

const POST = async(request) => {
    try {
        await connectDB()
        const { username, email, profile_picture} = await request.json();

        const newUser = await new User({
            username: username,
            email: email,
            profile_picture: profile_picture,
        });
        const user = await newUser.save();

        return NextResponse.json(
            { body: user },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: err },
            { status: 500 },
        );
    }
}

export { POST }
