import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Questionnaire } from '@/utils/Questionnaire';
import { Group } from "@/utils/Group";
import { Date } from '@/utils/Date';
import { User } from "@/utils/User";

//日程調整取得
const GET = async(request, { params }) => {
    try{
        await connectDB();
        const groupId = params.id;

        const group = await Group.findById(groupId);
        const questionnaires = await Questionnaire.find({ group_id: groupId });
        const currentQuestionnaires = await Promise.all(
            questionnaires.map(async(questionnaire) => {
                const membersSchedule = await Promise.all(
                    group.members.map(async(memberId) => {
                        const user = await User.findById(memberId);
                        const memberSchedule = await Promise.all(
                            //日程調整に登録された各日程の情報を成形して返す
                            questionnaire.date_ids.map(async(dateId) => {
                                const date = await Date.findById(dateId);
                                const dateMap = new Map(date.schedules);
                                //ユーザーごとに情報が登録されているならその値を、無ければ0を返す
                                if(dateMap.get(memberId)){
                                    return dateMap.get(memberId);
                                }else{
                                    return 0;
                                }
                            })
                        )
                        return [user._id, user.username, ...memberSchedule];
                    })
                )
                const questionnaireDates = await Promise.all(
                    questionnaire.date_ids.map(async(dateId) => {
                        const date = await Date.findById(dateId);
                        return [dateId, date.date];
                    })
                )
                
                return {
                    questionnaireId: questionnaire._id,
                    questionnaireName: questionnaire.name,
                    questionnaireOverview: questionnaire.overview,
                    membersSchedule: membersSchedule,
                    questionnaireDates: questionnaireDates,
                    questionnaireRemarks: questionnaire.remarks,
                }
            })
        )

        return NextResponse.json(
            { questionnaires: currentQuestionnaires },
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