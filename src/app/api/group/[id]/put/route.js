import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";

//ユーザー情報更新
const PUT = async(request, { params }) => {
    try{
        await connectDB()
        const {
            userId,
            groupName,
            groupIcon,   
        } = await request.json()
        const groupId = params.id;

        const group = await Group.findById(groupId);
        if(group.members.includes(userId)){
            await group.updateOne({
                $set: {
                    name: groupName,
                    icon: groupIcon,
                }
            });
            
            return NextResponse.json(
                { name: groupName },
                { status: 200 },
            );
        }else{
            return NextResponse.json(
                { error: "所属外のグループの情報は変更できません" },
                { status: 403 },
            );
        }
    }catch(error){
        console.error(error)
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 },
        );
    }
}

const OPTIONS = () => {
    return NextResponse.json(
        { status: 204 },
    );
}

export { PUT, OPTIONS }