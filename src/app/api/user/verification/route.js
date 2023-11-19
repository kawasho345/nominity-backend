import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { User } from "@/utils/User"

//ユーザー情報登録、取得
const POST = async(request) => {
    try {
        await connectDB()
        const { username, email, userIcon } = await request.json();

        const currentUser = await User.findOne({ email: email });
        //ユーザーが見つからなければ新規作成
        if(currentUser === null){
            const newUser = await new User({
                username: username,
                email: email,
                icon: userIcon,
            });
            const user = await newUser.save();

            return NextResponse.json(
                {
                    userId: user._id,
                    username: user.username,
                    userIcon: user.icon,
                    joinGroupIds: user.join_groups,
                    userFavoriteFood: user.favorite_food_text,
                    userHatedFood: user.hated_food_text,
                    userFavoriteAlcohol: user.favorite_alcohol_text,
                    userHatedAlcohol: user.hated_alcohol_text,
                    userAllergy: user.allergy,
                    userAllergyText: user.allergy_text,
                },
                { status: 200 },
            );
        }

        return NextResponse.json( 
            {
                userId: currentUser._id,
                username: currentUser.username,
                userIcon: currentUser.icon,
                joinGroupIds: currentUser.join_groups,
                userFavoriteFood: currentUser.favorite_food_text,
                userHatedFood: currentUser.hated_food_text,
                userFavoriteAlcohol: currentUser.favorite_alcohol_text,
                userHatedAlcohol: currentUser.hated_alcohol_text,
                userAllergy: currentUser.allergy,
                userAllergyText: currentUser.allergy_text,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 },
        );
    }
}

export { POST }