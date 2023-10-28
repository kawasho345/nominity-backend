import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Schedule } from "@/utils/Schedule";

//スケジュール情報取得
const GET = async(request, { params }) => {
    try{
        await connectDB();
        const groupId = params.id;

        const schedules = await Schedule.find({ group_id: groupId });
        const currentschedules = schedules.map((schedule) => {
            return {
                scheduleId: schedule._id,
                scheduleName: schedule.name,
                scheduleDate: schedule.date,
                restaurantName: schedule.restaurant_name,
                restaurantAddress: schedule.restaurant_address,
                restaurantUrl: schedule.restaurant_url,
                restaurantImage: schedule.restaurant_image,
                schedulePrice: schedule.price,
                scheduleNumberPeople: schedule.number_people,
                scheduleRemarks: schedule.remarks,
                scheduleUpdatedAt: schedule.updatedAt,
            }
        })
        
        return NextResponse.json(
            { schedules: currentschedules },
            { status: 200 },
        );  
    }catch(error){
        console.log(error)
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 },
        );
    }
}


export { GET }