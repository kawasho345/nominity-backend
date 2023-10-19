import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Schedule } from "@/utils/Schedule";

//スケジュール情報更新
const PUT = async(request, { params }) => {
    try{
        await connectDB()
        const body =  await request.json();
        const { groupid } = body;
        const schedule_id = params.schedule_id;
        const currentschedule = await Schedule.findById(schedule_id)

        if(currentschedule.group === groupid){
            await currentschedule.updateOne({
                $set: body,
            });
            return NextResponse.json(
                { message: "スケジュール情報を更新しました。" },
                { status: 200 },
            )
        }else{
            return NextResponse.json(
                { message: "他のグループのスケジュール情報は変更できません" },
                { status: 403 },
            )
        }
    }catch(err){
        return NextResponse.json(
            { message: err },
            { status: 500 },
        );
    }
}

export { PUT }