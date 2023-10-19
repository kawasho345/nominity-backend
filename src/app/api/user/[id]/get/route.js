import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { User } from "@/utils/User"

//ユーザー情報取得
const GET = async(request, { params }) => {
    try{
        await connectDB();
        const userId = params.userId;
        const user = await User.findById(userId);
        const { password, updatedAt, ...other } = user._doc;
       
        return NextResponse.json(
            { body: other },
            { status: 200 },
        );
    }catch(err){
        return NextResponse.json(
            { message: err },
            { status: 500 },
        );
    }
}

export { GET }