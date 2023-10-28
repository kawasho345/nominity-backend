import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { User } from "@/utils/User";

//グループを退会
const PUT = async(request, { params }) => {
    try{
        await connectDB()
        const { userIds } = await request.json();
        const groupId = params.id;

        const group = await Group.findById(groupId);
        if(group.members.length > userIds.length){
            await Promise.all(
                userIds.map(async(userId) => {
                    await group.updateOne({
                        $pull: { members: userId }
                    })
                    await User.findByIdAndUpdate(userId, {
                        $pull: { join_groups: groupId }
                    })
                })
            )        
        
            return NextResponse.json(
                    { status: 204 },
                );
        }else{
            return NextResponse.json(
                { error: "グループメンバーは１人以上必要です"},
                { status: 405 }
            )
        }
        
    }catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 },
        );
    }
}

export { PUT }