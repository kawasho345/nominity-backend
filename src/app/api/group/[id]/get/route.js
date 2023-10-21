import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";

//グループ情報取得
const GET = async(request, { params }) => {
    try{
        await connectDB();
        const groupId = params.id;
        const currentGroup = await Group.findById(groupId);

        return NextResponse.json(
            {
                groupName: currentGroup.name,
                groupIcon: currentGroup.icon,
            },
            { status: 200 }, 
        );
    }catch(error){
        console.error(error)
        return NextResponse.json(
            { error: "通信に失敗しました。" },
            { status: 500 },
        );
    }
}

export { GET }