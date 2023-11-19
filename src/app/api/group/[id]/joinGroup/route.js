import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { User } from "@/utils/User";
import { list } from '@/lib/list';
import { listAllergy } from '@/lib/listAllergy';

//グループ参加
const PUT = async(request, { params }) => {
    try{
        await connectDB();
        const invitationCode = params.id;
        const { userId } = await request.json();
        //招待コードをもとにグループを選定
        const joinGroup = await Group.findOne({ invitation_code: invitationCode })
        if(joinGroup){
            const joinGroupId = joinGroup._id.toString();
            //グループのメンバーにuserIdを追加
            await joinGroup.updateOne({
                $addToSet: { members: userId }
            });
            //ユーザーの所属グループにgroupIdを追加
            await User.findByIdAndUpdate(userId, {
                $addToSet: { join_groups: joinGroupId }
            });
            //グループの好き嫌いアレルギーリストを更新
            const types = [
                "favorite_food",
                "hated_food",
                "favorite_alcohol",
                "hated_alcohol",
            ]
            types.map((type) => {
                list(joinGroupId, type);    
            })
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