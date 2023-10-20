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
        const joinGroupId = joinGroup._id;
        await joinGroup.updateOne({
            $pull: { groupmember: userId }
        })
        const joinedUser = await User.findById(userId);
        await joinedUser.updateOne({
            $pull: { join_groups: joinGroupId }
        })

        return NextResponse.json(
            { body: joinGroupId },
            { status: 200 },
        );
    }catch(err){
        console.log(err)
        return NextResponse.json(
            { message: "エラー" },
            { status: 500 },
        );
        
    }
}