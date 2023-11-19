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
            allergyText,
        } =  await request.json();
        //項目が更新されていたら、extractで食べ物の抽出を行う
        const user = await User.findById(userId);
        if(user.favorite_food_text !== favoriteFoodText){
            extract(favoriteFoodText, userId, "favorite_food");
        }
        if(user.hated_food_text !== hatedFoodText){
            extract(hatedFoodText, userId, "hated_food");
        }
        if(user.favorite_alcohol_text !== favoriteAlcoholText){
            extract(favoriteAlcoholText, userId, "favorite_alcohol");
        }
        if(user.hated_alcohol_text !== hatedAlcoholText){
            extract(hatedAlcoholText, userId, "hated_alcohol");
        }
        await user.updateOne({
            $set: {
                name: userName,
                icon: userIcon,
                favorite_food_text: favoriteFoodText,
                hated_food_text: hatedFoodText,
                favorite_alcohol_text: favoriteAlcoholText,
                hated_alcohol_text: hatedAlcoholText,
                allergy: allergy,
                allergy_text: allergyText,
            }
        })
        //所属グループのアレルギーリストを更新する
        user.join_groups.map((groupId) => {
            listAllergy(groupId);
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

const OPTIONS = () => {
    return NextResponse.json(
        { status: 204 },
    );
}

export { PUT, OPTIONS }