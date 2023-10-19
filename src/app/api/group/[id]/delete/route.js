import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { User } from "@/utils/User";

//グループ削除
const DELETE = async(request, { params }) => {
    try{
        await connectDB()
        const { currentGroupId } = await request.json();
        const groupId = params.id;

        const currentGroup = await Group.findById(currentGroupId);
        if(currentGroupId === groupId){
            await Promise.all(
                currentGroup.groupmember.map(async(memberid) => {
                    return await User.findByIdAndUpdate(memberid, {
                        $pull: { groups: groupId } 
                    })
                })
            )
            await Group.findByIdAndDelete(groupId);
            
            return NextResponse.json(
                { message: "グループを削除しました。" },
                { status: 200},
            )
        }else{
            return NextResponse.json(
                { message: "他のグループの削除はできません" },
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

export { DELETE }