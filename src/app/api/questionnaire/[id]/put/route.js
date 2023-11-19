import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Questionnaire } from '@/utils/Questionnaire';
import { Group } from "@/utils/Group";
import { Date } from '@/utils/Date';

//日程調整更新
const PUT = async(request, { params }) => {
    try{
        await connectDB();
        const questionnaireId = params.id;
        const { 
            userId, 
            questionnaireName, 
            questionnaireOverview, 
            questionnaireDates,
        } = await request.json()

        const questionnaire = await Questionnaire.findById(questionnaireId);
        const group = await Group.findById(questionnaire.group_id);
        if(group.members.includes(userId)){
            const dates = await Promise.all(
                //すでに日程にidがつけられているなら更新、無ければ新規登録
                questionnaireDates.map(async(date) => {
                    if(date[0]){
                        await Date.findByIdAndUpdate(date[0], {
                            $set: { date: date[1] }
                        })
                        return date[0]
                    }
                    const newDate = await new Date({
                        date: date[1],
                    })
                    const currentDate = await newDate.save();
                    return currentDate._id.toString();
                })
            )
            await questionnaire.updateOne({
                $set: {
                    name: questionnaireName,
                    overview: questionnaireOverview,
                    date_ids: dates,
                },
            });

            return NextResponse.json(
                { status: 204 },
            );
        }else{
            return NextResponse.json(
                { error: "所属外のグループの日程調整は編集できません" },
                { status: 403 },
            );
        }
    }catch(error){
        console.error(error)
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

export { PUT, OPTIONS }