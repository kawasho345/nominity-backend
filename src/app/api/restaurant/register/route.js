import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from '@/utils/Group';
import { Restaurant } from '@/utils/Restaurant';

//お店リストへ登録
const POST = async(request) => {
    try {
        await connectDB()
        const {
            restaurantName,
            restaurantAddress,
            restaurantUrl,
            restaurantImage,
            restaurantRemarks,
            groupId,
            userId,
        } = await request.json();

        const group = await Group.findById(groupId);
        if(!group.members.includes(userId)){
            return NextResponse.json(
                { error: "所属外のグループのお店リストは作成できません" },
                { status: 403 },
            )
        }
        const newRestaurant = await new Restaurant({
            name: restaurantName,
            address: restaurantAddress,
            url: restaurantUrl,
            image: restaurantImage,
            remarks: restaurantRemarks,
            group_id: groupId,
        });
        const restaurant = await newRestaurant.save();

        return NextResponse.json(
            { 
                restaurantId: restaurant._id.toString(),
                restaurantName: restaurant.name,
                restaurantAddress: restaurant.address,
                restaurantUrl: restaurant.url,
                restaurantImage: restaurant.image,
                restaurantRemarks: restaurant.remarks,
            },
            { status: 200 },
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 },
        );
    }
}

export { POST }