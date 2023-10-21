import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { User } from "@/utils/User";

const PUT = async(request, { params }) => {
    try{
        await connectDB();
        const invitationCode = params.id;
        const { userId } = await request.json();

        const joinGroup = await Group.findOne({ invitation_code: invitationCode })
        if(joinGroup){

            const joinGroupId = joinGroup._id;
            await joinGroup.updateOne({
                $addToSet: { groupmember: userId }
            });
            const joinedUser = await User.findById(userId);
            await joinedUser.updateOne({
                $addToSet: { join_groups: joinGroupId }
            });
            return NextResponse.json(
                { joinGroupId: joinGroupId },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { error: "無効な招待コードです。"},
            { status: 403 },
        );
    }catch(error){
        console.error(error)
        return NextResponse.json(
            { error: "通信に失敗しました。" },
            { status: 500 },
        );
    }
}

export { PUT }