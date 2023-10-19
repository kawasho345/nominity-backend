

const GET = async(request) => {
    try{
        //データベース照合
        let currentuser = await User.findOne({ email: session.user.email });
        if(currentuser === null){
            //無ければ新規作成
            await fetch(process.env.NEXT_PUBLIC_HOST_URL+"/api/user/register", {
                method: "POST",
                body: JSON.stringify({
                    username: session.user.name,
                    email: session.user.email,
                    profile_picture: session.user.image,
                }),
                cache: "no-cache",
            })
            currentuser = await User.findOne({ email: session.user.email });
        }
        const { updatedAt, ...other } = currentuser._doc;
        
        return NextResponse.json(
            { body: other },
            { status: 200 },
        );
    }catch(err){
        return NextResponse.json(
            { message: err },
            { status: 500 },
        );
    }
}

export { GET }