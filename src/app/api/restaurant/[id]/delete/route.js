import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Restaurant } from '@/utils/Restaurant';
import { Group } from '@/utils/Group';

//お店リストから削除
const DELETE = async(request, { params }) => {
    try{
        await connectDB()
        const { userId } = await request.json();
        const restaurantId = params.id;
        const restaurant = await Restaurant.findById(restaurantId);
        const group = await Group.findById(restaurant.group_id);

        if(!group.members.includes(userId)){
            return NextResponse.json(
                { message: "他のグループのお店リストは削除できません" },
                { status: 403 },
            )
        }
        await restaurant.deleteOne();
        
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

export { DELETE, OPTIONS }