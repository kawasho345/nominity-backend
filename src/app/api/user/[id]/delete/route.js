import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { User } from "@/utils/User";

//ユーザーアカウント削除
const DELETE = async(request, { params }) => {
    try{
        await connectDB();
        const userId = params.id;
        const { currentUserId } = await request.json();

        if(currentUserId === userId){
            await User.findByIdAndDelete(userId);
            return NextResponse.json(
                { message: "アカウントを削除しました" },
                { status: 200 },
            );
        }else{
            return NextResponse.json(
                { error: "ログイン中のユーザー以外の削除はできません" },
                { status: 403 },
            );
        }
    }catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 }, 
        );
    }
}

export { DELETE }