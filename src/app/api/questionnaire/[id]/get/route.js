import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Questionnaire } from '@/utils/Questionnaire';
import { Group } from "@/utils/Group";
import { Date } from '@/utils/Date';

//日程調整取得
//保留
const GET = async(request, { params }) => {
    try{
        await connectDB();
        const questionnaireId = params.id;

        const questionnaire = await Questionnaire.findById(questionnaireId);
        const group = await Group.findById(questionnaire.group_id);
        const currentQuestionnaire = await Promise.all(
            questionnaire.date_ids.map(async(dateId) => {
                const date = await Date.findById(dateId);
                const dateMap = new Map(date.schedules);
                const members = [];
                group.members.map((memberId) => {
                    if(dateMap.get(memberId)){
                        members.push([memberId, dateMap.get(memberId)]);
                    }else{
                        members.push([memberId, 0]);
                    }
                })
                return [dateId, date.date, members]
            })
        )

        return NextResponse.json(
            {
                questionnaire: currentQuestionnaire,
            },
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