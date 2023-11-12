import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Questionnaire } from '@/utils/Questionnaire';
import { Group } from "@/utils/Group";
import { Date } from '@/utils/Date';

//日程調整削除
const DELETE = async(request, { params }) => {
    try{
        await connectDB()
        const { userId } = await request.json();
        const questionnaireId = params.id;

        const questionnaire = await Questionnaire.findById(questionnaireId);
        const group = await Group.findById(questionnaire.group_id);
        if(group.members.includes(userId)){
            await Promise.all(
                questionnaire.date_ids.map(async(dateId) => {
                    return await Date.findByIdAndDelete(dateId)
                })
            )
            await questionnaire.deleteOne();
            
            return NextResponse.json(
                { status: 204 },
            );
        }else{
            return NextResponse.json(
                { error: "所属外のグループの日程調整は削除できません" },
                { status: 403 },
            );
        }
    }catch(error){
        console.error(error);
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

export { DELETE, OPTIONS }