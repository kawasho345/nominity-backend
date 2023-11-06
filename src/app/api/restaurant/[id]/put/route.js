import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Restaurant } from '@/utils/Restaurant';
import { Group } from '@/utils/Group';

//スケジュール情報更新
const PUT = async(request, { params }) => {
    try{
        await connectDB()
        const { 
            userId,
            restaurantName,
            restaurantAddress,
            restaurantUrl,
            restaurantImage,
            restaurantRemarks,
        } = await request.json();
        const restaurantId = params.id;

        const restaurant = await Restaurant.findById(restaurantId);
        const group = await Group.findById(restaurant.group_id);
        if(!group.members.includes(userId)){
            return NextResponse.json(
                { message: "他のグループのお店リストは編集できません" },
                { status: 403 },
            )
        }
        await restaurant.updateOne({
            $set: {
                name: restaurantName,
                address: restaurantAddress,
                url: restaurantUrl,
                image: restaurantImage,
                remarks: restaurantRemarks,
            },
        });
        
        return NextResponse.json(
            { status: 204 },
        )
    }catch(error){
        console.log(error);
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