import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { Questionnaire } from '@/utils/Questionnaire';
import { Date } from '@/utils/Date';

//日程調整作成
const POST = async(request) => {
    try {
        await connectDB();
        const { userId, 
                groupId,
                questionnaireName, 
                questionnaireOverview,
                questionnaireDates 
            } = await request.json();

        const group = await Group.findById(groupId);
        if(group.members.includes(userId)){
            const dates = await Promise.all(
                questionnaireDates.map(async(date) => {
                    const newDate = await new Date({
                        date: date,
                    });
                    const currentDate = await newDate.save();
                    return currentDate._id.toString();
                })
            )
            const newQuestionnaire = await new Questionnaire({
                name: questionnaireName,
                date_ids: dates,
                overview: questionnaireOverview,
                group_id: groupId,
            })
            const questionnaire = await newQuestionnaire.save();

            return NextResponse.json(
                { questionnaire: questionnaire },
                { status: 200 },
            ) 

        }else{
            return NextResponse.json(
                { error: "所属外のグループの日程調整は作成できません" },
                { status: 403 }, 
            );
        }
    }catch(error) {
        console.error(error)
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 }, 
        );
    }
}

export { POST }