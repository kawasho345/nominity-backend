import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { User } from "@/utils/User"

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
                { body: {
                    userId: user._id.toString(),
                    username: user.username,
                    userIcon: user.icon,
                    joinGroups: user.join_groups,
                    lastGroup: user.last_group,
                }},
                { status: 200 },
            );
        }

        return NextResponse.json(
            { body: {
                userId: currentUser._id,
                username: currentUser.username,
                userIcon: currentUser.icon,
                joinGroups: currentUser.join_groups,
                lastGroup: currentUser.last_group,
            }},
            { status: 200 },
        );
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: err },
            { status: 500 },
        );
    }
}

export { POST }