import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Schedule } from "@/utils/Schedule";

//スケジュール削除
const DELETE = async(request, { params }) => {
    try{
        await connectDB()
        const { groupid } = await request.json();
        const schedule_id = params.schedule_id;
        const currentgroup = await Schedule.findById(schedule_id);

        if(currentgroup.group === groupid){
            await Schedule.findByIdAndDelete(schedule_id);
            await currentgroup.updateOne({
                $pull: { groups: schedule_id },
            })
            return NextResponse.json(
                { message: "スケジュールを削除しました。" },
                { status: 200},
            )
        }else{
            return NextResponse.json(
                { message: "他のグループのスケジュールは削除はできません" },
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

export { DELETE }