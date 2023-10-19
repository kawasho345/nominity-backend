import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { User } from "@/utils/User";

const POST = async(request) => {
    try {
        await connectDB();
        const { groupName, invitationCode, icon, userId } = await request.json();

        console.log(userId)
        const newGroup = await new Group({
            name: groupName,
            invitation_code: invitationCode,
            icon: icon,
            members: userId,
        });
        const group = await newGroup.save();
        const groupId = group._id.toString();
        await User.findByIdAndUpdate(userId, {
            $push: { join_groups: groupId },
        });

        return NextResponse.json(
            { body: groupId },
            { message: "グループを作成しました。" },
            { status: 200 },
        );
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: err },
            { status: 500 },
        );
    }
}

export { POST }