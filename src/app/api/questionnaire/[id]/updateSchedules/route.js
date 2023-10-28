import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Questionnaire } from '@/utils/Questionnaire';
import { Group } from "@/utils/Group";
import { Date } from '@/utils/Date';

//日程調整回答更新
const PUT = async(request, { params }) => {
    try{
        await connectDB()
        const {
            userId,
            questionnaireSchedules,
            questionnaireRemarks,   
        } = await request.json()
        const questionnaireId = params.id;

        const questionnaire = await Questionnaire.findById(questionnaireId)
        const group = await Group.findById(questionnaire.group_id);
        if(!group.members.includes(userId)){
            return NextResponse.json(
                { error: "所属外のグループの日程調整は回答できません" },
                { status: 403 },
            );
        }
        //全て受理されたかの確認フラグ
        let isAllComplete = true;
        //備考欄の更新
        const remarksMap = new Map(questionnaire.remarks);
        remarksMap.delete(userId);
        remarksMap.set(userId, questionnaireRemarks);
        const arrayRemarks = Array.from(remarksMap.entries());
        await questionnaire.updateOne({
            $set: { remarks: arrayRemarks },
        })
        //予定の更新
        await Promise.all(
            questionnaireSchedules.map(async(schedule) => {
                if(!questionnaire.date_ids.includes(schedule[0])){
                    isAllComplete = false;
                }
                const date = await Date.findById(schedule[0])
                const dateMap = new Map(date.schedules);
                dateMap.delete(userId);
                dateMap.set(userId, schedule[1]);
                const pairs = Array.from(dateMap.entries())
                await date.updateOne({
                    $set: { schedules: pairs },
                });
            })
        );
        //全て受理されたら204
        if(isAllComplete){
            return NextResponse.json(
                { status: 204 },
            );
        }
        return NextResponse.json(
            { status: 206 },
        )
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