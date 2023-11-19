import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Group } from "@/utils/Group";
import { Post } from '@/utils/Post';

//投稿
const POST = async(request) => {
    try {
        await connectDB();
        const { userId,
                groupId, 
                postContent, 
                isBot,
            } = await request.json();

        const group = await Group.findById(groupId);
        if(group.members.includes(userId)){
            const newPost = await new Post({
                user_id: userId,
                content: postContent,
                group_id: groupId,
            });
            const post = await newPost.save();

            return NextResponse.json(
                { 
                    postContent: post.content,
                    postUserId: post.user_id,
                    isBot: false,
                },
                { status: 200 },
            ) 
        }
        //ボットからの更新も登録
        if(isBot){
            const newPost = await new Post({
                content: postContent,
                group_id: groupId,
                is_bot: true, 
            });
            const post = await newPost.save();

            return NextResponse.json(
                { 
                    postContent: post.content,
                    isBot: true,
                },
                { status: 200 },
            ) 
        }
        
        return NextResponse.json(
            { error: "所属外のグループへの投稿はできません" },
            { status: 403 }, 
        );

    }catch(error) {
        console.error(error)
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 }, 
        );
    }
}

export { POST }