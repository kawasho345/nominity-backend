import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { User } from "@/utils/User";

//グループ削除
const DELETE = async(request, { params }) => {
    try{
        await connectDB()
        const { userId } = await request.json();
        const groupId = params.id;

        const group = await Group.findById(groupId);
        if(group.members.includes(userId)){
            //メンバーの所属グループからgroupIdを削除
            await Promise.all(
                group.members.map(async(memberId) => {
                    return await User.findByIdAndUpdate(memberId, {
                        $pull: { join_groups: groupId } 
                    })
                })
            )
            await group.deleteOne();
            
            return NextResponse.json(
                { status: 204 },
            );
        }else{
            return NextResponse.json(
                { error: "所属外のグループの削除はできません" },
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