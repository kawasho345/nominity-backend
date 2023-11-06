import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { User } from "@/utils/User";
import { list } from '@/lib/list';

const PUT = async(request, { params }) => {
    try{
        await connectDB();
        const invitationCode = params.id;
        const { userId } = await request.json();

        const joinGroup = await Group.findOne({ invitation_code: invitationCode })
        if(joinGroup){
            const joinGroupId = joinGroup._id.toString();
            await joinGroup.updateOne({
                $addToSet: { members: userId }
            });
            const joinedUser = await User.findById(userId);
            await joinedUser.ne({
                $addToSet: { join_groups: joinGroupId }
            });
            const preference = [
                "favorite_food",
                "hated_food",
                "favorite_alcohol",
                "hated_alcohol",
            ]
            preference.forEach(element => {
                list(joinGroupId, type = element);    
            });
            listAllergy(joinGroupId);
                        
            return NextResponse.json(
                { joinGroupId: joinGroupId },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: "無効な招待コードです"},
            { status: 403 },
        );
    }catch(error){
        console.error(error)
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 },
        );
    }
}

export { PUT }