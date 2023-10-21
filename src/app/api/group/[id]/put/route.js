import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";

//ユーザー情報更新
const PUT = async(request, { params }) => {
    try{
        await connectDB()
        const body =  await request.json();
        const { currentGroupId } = body;
        const groupId = params.id;

        if(currentGroupId === groupId){
            await Group.findByIdAndUpdate(groupId, {
                $set: body,
            });
            return NextResponse.json(
                { status: 200 },
            );
        }else{
            return NextResponse.json(
                { error: "他のグループの情報は変更できません。" },
                { status: 403 },
            );
        }
    }catch(error){
        console.error(error)
        return NextResponse.json(
            { error: "通信に失敗しました。" },
            { status: 500 },
        );
    }
}

export { PUT }