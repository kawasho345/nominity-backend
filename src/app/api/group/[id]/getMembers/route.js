import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { User } from "@/utils/User";

//メンバー情報取得
const GET = async(request, { params }) => {
    try{
        await connectDB();
        const groupId = params.id;
        const currentGroup = await Group.findById(groupId);

        const groupMembers = await Promise.all(
            currentGroup.members.map((userId) => {
                return User.findById(userId)
            })
        )
        //メンバーのidと名前とiconだけ取得
        const members = groupMembers.map((user) => [user._id, user.username, user.icon]);

        return NextResponse.json(
            { members },
            { status: 200 },
        );
    }catch(error){
        console.error(error);
        return NextResponse.json(
            { message: "通信に失敗しました" },
            { status: 500 },
        );
    }
}

export { GET }