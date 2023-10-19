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
                { message: "グループ情報を更新しました。" },
                { status: 200 },
            )
        }else{
            return NextResponse.json(
                { message: "他のグループの情報は変更できません" },
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