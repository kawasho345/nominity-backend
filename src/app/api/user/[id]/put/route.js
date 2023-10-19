import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { User } from "@/utils/User";

//ユーザー情報更新
const PUT = async(request, { params }) => {
    try{
        await connectDB()
        const userId = params.id;
        const body =  await request.json();
        const { currentUserId } = body;

        if(currentUserId === userId){
            await User.findByIdAndUpdate(userId, {
                $set: body,
            });
            return NextResponse.json(
                { message: "ユーザー情報を更新しました。" },
                { status: 200 },
            )
        }else{
            return NextResponse.json(
                { message: "ログイン中のユーザー以外の情報は変更できません" },
                { status: 403 },
            )
        }
    }catch(err){
        return NextResponse.json(
            { message: err },
            { status: 500 },
        );
    }
}

export { PUT }