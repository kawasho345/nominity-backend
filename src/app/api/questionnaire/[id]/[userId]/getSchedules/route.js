import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Questionnaire } from '@/utils/Questionnaire';
import { Date } from '@/utils/Date';

//日程調整回答取得
const GET = async(request, { params }) => {
    try{
        await connectDB();
        const questionnaireId = params.id;
        const userId = params.userId;

        const questionnaire = await Questionnaire.findById(questionnaireId);
        const dateSchedules = await Promise.all(
            questionnaire.date_ids.map(async(dateId) => {
                const date = await Date.findById(dateId);
                const dateMap = new Map(date.schedules)
                return [dateId, date.date, dateMap.get(userId)]
            })
        )

        return NextResponse.json(
            { dateSchedules: dateSchedules },
            { status: 200 }, 
        );
    }catch(error){
        console.error(error)
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 },
        );
    }
}

export { GET }