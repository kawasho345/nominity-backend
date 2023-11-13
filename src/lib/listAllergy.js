import { Group } from "@/utils/Group";
import { User } from "@/utils/User";
import { connectDB } from "@/utils/connectDB";

const listAllergy = async(groupId) => {
    try{
        await connectDB();
        const group = await Group.findById(groupId);
        const allergys = await Promise.all(
            group.members.map(async(memberId) => {
                const user = await User.findById(memberId);
                return user.allergy;
            })
        )
        const setAllergy = new Set(allergys);
        const allergyTexts = await Promise.all(
            group.members.map(async(memberId) => {
                const user = await User.findById(memberId);
                return user.allergy_text;
            })
        )
        const arrayAllergy = [...setAllergy]

        await group.updateOne({
            $set: {
                allergy: arrayAllergy.join(", "),
                allergy_text: allergyTexts.join("<br />"),
            }
        });

    }catch(error){
        console.error(error);
    }
}

export { listAllergy }