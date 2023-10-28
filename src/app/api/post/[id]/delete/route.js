import { NextResponse } from 'next/server';
import { connectDB } from "@/utils/connectDB";
import { Post } from '@/utils/Post';

//チャット編集
const DELETE = async(request, { params }) => {
    try {
        await connectDB();
        const postId = params.id;

        const {
            userId,
        } = await request.json()

        const post = await Post.findById(postId);
        if(post.is_bot){
            return NextResponse.json(
                { error: "ボットの投稿は削除できません" },
                { status: 403 },
            )
        }
        if(post.user_id !== userId ){
            return NextResponse.json(
                { error: "他の人の投稿は削除できません"},
                { status: 403 },
            )
        }
        await post.deleteOne();

        return NextResponse.json(
            { status: 204 },
        )

    }catch(error) {
        console.error(error)
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 }, 
        );
    }
}

export { DELETE }