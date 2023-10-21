import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { User } from "@/utils/User";

const POST = async(request) => {
    try {
        await connectDB();
        const { groupName, groupIcon, userId } = await request.json();

        //招待コードをhash関数で作成
        const uint8 = new TextEncoder().encode(groupName + Date.now());
        const digest = await crypto.subtle.digest('SHA-256', uint8);
        const invitationCode = Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2,'0')).join('')

        const newGroup = await new Group({
            name: groupName,
            invitation_code: invitationCode,
            icon: groupIcon,
            members: userId,
        });
        const group = await newGroup.save();
        const groupId = group._id.toString();
        await User.findByIdAndUpdate(userId, {
            $push: { join_groups: groupId },
        });

        console.log(groupId)
        return NextResponse.json(
            { groupId: groupId },
            { status: 200 }, 
        );
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "通信に失敗しました。" },
            { status: 500 }, 
        );
    }
}

export { POST }