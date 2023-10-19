import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Schedule } from "@/utils/Schedule";

//スケジュール情報取得
const GET = async(request, { params }) => {
    try{
        await connectDB();
        const schedule_id = params.schedule_id;
        const currentschedule = await Schedule.findById(schedule_id);
        
            return NextResponse.json(
                {body: currentschedule},
                {status: 200},
            );  
    }catch(err){
        return NextResponse.json(
            { message: err },
            { status: 500 },
        );
    }
}


export { GET }