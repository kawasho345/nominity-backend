import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Schedule } from "@/utils/Schedule";
import { Group } from "@/utils/Group";

const POST = async(request) => {
    try {
        await connectDB()
        const {
            schedulename,
            date,
            restaurantname,
            address,
            url,
            restaurantpicture,
            price,
            numberofpeople,
            memo,
            groupid,
        } = await request.json();

        const newSchedule = await new Schedule({
            schedulename: schedulename,
            date: date,
            restaurantname: restaurantname,
            address: address,
            url: url,
            restaurantpicture: restaurantpicture,
            price: price,
            numberofpeople: numberofpeople,
            memo: memo,
            group: groupid,
        });
        const schedule = await newSchedule.save();

        await Group.findByIdAndUpdate(groupid, {
            $push: { schedules: schedule._id.toString() },
        });

        return NextResponse.json(
            { body: schedule },
            { message: "スケジュールを作成しました。" },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json(
            { message: err },
            { status: 500 },
        );
    }
}

export { POST }