import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { User } from "@/utils/User";
import { extract } from "@/lib/extract";
import { listAllergy } from "@/lib/listAllergy";

//ユーザー情報更新
const PUT = async(request, { params }) => {
    try{
        await connectDB()
        const userId = params.id;
        const {
            userName,
            userIcon,
            favoriteFoodText,
            hatedFoodText,
            favoriteAlcoholText,
            hatedAlcoholText,
            allergy,
        } =  await request.json();

        const user = await User.findById(userId);
        if(user.favorite_food_text !== favoriteFoodText){
            extract(text = favoriteFoodText, userId, type = "favorite_food");
        }
        if(user.hated_food_text !== hatedFoodText){
            extract(text = hatedFoodText, userId, type = "hated_food");
        }
        if(user.favorite_alcohol_text !== favoriteAlcoholText){
            extract(text = favoriteAlcoholText, userId, type = "favorite_alcohol");
        }
        if(user.hated_alcohol_text !== hatedAlcoholText){
            extract( text = hatedAlcoholText, userId, type = "hated_alcohol");
        }
        // if(user.allergy !== allergy){
        //     listAllergy(userId);
        // }
        await user.updateOne(userId, {
            $set: {
                name: userName,
                icon: userIcon,
                favorite_food_text: favoriteFoodText,
                hated_food_text: hatedFoodText,
                favorite_alcohol_text: favoriteAlcoholText,
                hated_alcohol_text: hatedAlcoholText,
                allergy: allergy,
            }
        })

        return NextResponse.json(
            { status: 204 },
        )

    }catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 },
        );
    }
}

export { PUT }