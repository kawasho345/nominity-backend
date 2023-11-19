import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { User } from "@/utils/User";
import { list } from '@/lib/list';
import { listAllergy } from '@/lib/listAllergy';

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
            const types = [
                "favorite_food",
                "hated_food",
                "favorite_alcohol",
                "hated_alcohol",
            ]
            types.map((type) => {
                list(groupId, type);    
            })
            listAllergy(groupId);   
        
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

const OPTIONS = () => {
    return NextResponse.json(
        { status: 204 },
    );
}

export { PUT, OPTIONS }