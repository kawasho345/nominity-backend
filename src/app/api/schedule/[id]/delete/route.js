import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Schedule } from "@/utils/Schedule";
import { Group } from '@/utils/Group';

//お知らせ削除
const DELETE = async(request, { params }) => {
    try{
        await connectDB()
        const { userId } = await request.json();
        const scheduleId = params.id;
        const schedule = await Schedule.findById(scheduleId);
        const group = await Group.findById(schedule.group_id);

        if(!group.members.includes(userId)){
            return NextResponse.json(
                { message: "他のグループのスケジュール情報は削除できません" },
                { status: 403 },
            )
        }
        await schedule.deleteOne();
        
        return NextResponse.json(
            { status: 204 },
        )
    }catch(error){
        console.log(error);
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

export { DELETE, OPTIONS }