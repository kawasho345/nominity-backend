import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Schedule } from "@/utils/Schedule";
import { Group } from "@/utils/Group";

const POST = async(request) => {
    try {
        await connectDB()
        const {
            scheduleName,
            scheduleDate,
            restaurantName,
            restaurantAddress,
            restaurantUrl,
            restaurantImage,
            schedulePrice,
            scheduleNumberPeople,
            scheduleRemarks,
            groupId,
            userId,
        } = await request.json();

        const group = await Group.findById(groupId);
        if(!group.members.includes(userId)){
            return NextResponse.json(
                { error: "所属外のグループのスケジュール情報は作成できません" },
                { status: 403 },
            )
        }
        const newSchedule = await new Schedule({
            name: scheduleName,
            date: scheduleDate,
            restaurant_name: restaurantName,
            restaurant_address: restaurantAddress,
            restaurant_url: restaurantUrl,
            restaurant_image: restaurantImage,
            price: schedulePrice,
            number_people: scheduleNumberPeople,
            remarks: scheduleRemarks,
            group_id: groupId,
        });
        const schedule = await newSchedule.save();

        return NextResponse.json(
            { 
                scheduleId: schedule._id.toString(),
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
            },
            { status: 200 },
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 },
        );
    }
}

export { POST }