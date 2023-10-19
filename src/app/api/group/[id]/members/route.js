import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { User } from "@/utils/User";

const GET = async(request, { params }) => {
    try{
        await connectDB();
        const groupId = params.id;
        const currentGroup = await Group.findById(groupId);

        const members = await Promise.all(
            currentGroup.groupmember.map((userId) => {
                return User.findById(userId)
            })
        )
        const usernames = members.map((user) => user.username);
        const userIcons = members.map((user) => user.icon)

        return NextResponse.json(
            { body: {usernames, userIcons } },
            { status: 200},
        )

    }catch(err){
        console.log(err)
        return NextResponse.json(
            { message: "エラー" },
            { status: 500 },
        );
    }

}

export { GET }