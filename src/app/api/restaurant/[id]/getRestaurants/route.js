import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Restaurant } from '@/utils/Restaurant';

//お店リスト取得
const GET = async(request, { params }) => {
    try{
        await connectDB();
        const groupId = params.id;

        const restaurants = await Restaurant.find({ group_id: groupId });
        const currentrestaurants = restaurants.map((restaurant) => {
            return {
                restaurantId: restaurant._id.toString(),
                restaurantName: restaurant.name,
                restaurantAddress: restaurant.address,
                restaurantUrl: restaurant.url,
                restaurantImage: restaurant.image,
                restaurantRemarks: restaurant.remarks,
            }
        })
        
        return NextResponse.json(
            { restaurants: currentrestaurants },
            { status: 200 },
        );  
    }catch(error){
        console.log(error)
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 },
        );
    }
}


export { GET }