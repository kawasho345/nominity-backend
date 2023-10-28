import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Post } from '@/utils/Post';

//チャットタイムライン取得
const GET = async(request, { params }) => {
    try {
        await connectDB();
        const groupId = params.id;

        const posts = await Post.find({ group_id: groupId });
        const currentposts = posts.map((post) => {
            return {
                postId: post._id,
                postUserId: post.user_id,
                postContent: post.content,
                postGroupId: post.group_id,
                isBot: post.is_bot,
                postCreateAt: post.createAt,
            }
        })

        return NextResponse.json(
            { posts: currentposts },
            { status: 200 },
        )

    }catch(error) {
        console.error(error)
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 }, 
        );
    }
}

export { GET }