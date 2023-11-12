import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Post } from '@/utils/Post';
import { User } from "@/utils/User";

//チャットタイムライン取得
const GET = async(request, { params }) => {
    try {
        await connectDB();
        const groupId = params.id;

        const posts = await Post.find({ group_id: groupId });
        const currentposts = await Promise.all(
            posts.map(async(post) => {
                let postUsername = "";
                let postUserIcon = "";
                if(!post.is_bot){
                    const user = await User.findById(post.user_id);
                    postUsername = user.username;
                    postUserIcon = user.icon;
                }

                return {
                    postId: post._id,
                    postUserId: post.user_id,
                    postUsername: postUsername,
                    postUserIcon: postUserIcon,
                    postContent: post.content,
                    postGroupId: post.group_id,
                    isBot: post.is_bot,
                    postCreatedAt: post.createdAt,
                    postUpdatedAt: post.updatedAt,
                }
            })
        )

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