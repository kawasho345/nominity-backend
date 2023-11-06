import { extract } from "@/lib/extract";
import { NextResponse } from "next/server";

const PUT = async(request, { params }) => {
    try{
        const {
            // userId,
            extractText,
        } = await request.json()

        extract(extractText);
        return NextResponse.json(
            { status: 200 },
        )

    }catch(error){
        console.log(error);
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 },
        )
    }
}

export { PUT }