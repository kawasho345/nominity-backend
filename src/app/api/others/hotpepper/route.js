import { NextResponse } from 'next/server';

//ホットペッパーグルメ検索
const GET = async(request) => {
    try{
        const { searchParams } = new URL(request.url)
        const keyword = searchParams.get("keyword");
        const start = searchParams.get("start");

        const replaceKeyword = keyword.replace(/\s+/, " ");
        const hotpepperUrl = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";
        const result = await fetch(hotpepperUrl
            + "?key="
            + process.env.HOTPEPPER_API_KEY
            + "&keyword=" 
            + replaceKeyword
            + "&start="
            + start
            + "&format=json"
        ).then((response) => response.json())
        //名前と住所とurlとimageだけ取得
        const restaurants = result.results.shop.map((restaurant) => {
            return {
                name: restaurant.name,
                address: restaurant.address,
                url: restaurant.urls,
                image: restaurant.photo
            }
        })
        
        return NextResponse.json(
            { restaurants: restaurants},
            { status: 200 },
        );  
    }catch(error){
        console.log(error)
        return NextResponse.json(
            { error: "通信に失敗しました" },
            { status: 500 },
        );
    }
}


export { GET }