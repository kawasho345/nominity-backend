import { Group } from "@/utils/Group";
import { User } from "@/utils/User";
import { connectDB } from "@/utils/connectDB";

const listAllergy = async(groupId) => {
    try{
        await connectDB();
        const group = await Group.findById(groupId);
        //表示推奨アレルギーを集計
        const allergys = await Promise.all(
            group.members.map(async(memberId) => {
                const user = await User.findById(memberId);
                return user.allergy;
            })
        )
        const setAllergy = new Set(allergys.flat());
        const arrayAllergy = [...setAllergy];
        const allergyTexts = await Promise.all(
            group.members.map(async(memberId) => {
                const user = await User.findById(memberId);
                return user.allergy_text;
            })
        )
        //その他アレルギーを集計。ただし、空白を除くためsetで単一化
        const setAllergyTexts = new Set(allergyTexts);
        const arrayAllergyTexts = [...setAllergyTexts];

        await group.updateOne({
            $set: {
                allergy: arrayAllergy.join(", "),
                allergy_text: arrayAllergyTexts,
            }
        });

    }catch(error){
        console.error(error);
    }
}

export { listAllergy }