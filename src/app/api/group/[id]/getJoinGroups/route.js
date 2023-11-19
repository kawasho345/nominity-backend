import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { User } from "@/utils/User";

//所属グループ取得
const GET = async(request, { params }) => {
    try{
        await connectDB();
        const userId = params.id;
        const user = await User.findById(userId);
        
        const groups = await Promise.all(
            user.join_groups.map((groupId) => {
                return Group.findById(groupId)
            })
        )
        //各グループのidと名前とiconだけ取得
        const joinGroups = groups.map((group) => [group._id.toString(), group.name, group.icon]);

        return NextResponse.json(
            { joinGroups },
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