import { Group } from "@/utils/Group";
import { User } from "@/utils/User";
import { connectDB } from "@/utils/connectDB";

const listAllergy = async(userId, groupId) => {
    try{
        await connectDB();
        let groupIds = [groupId];
        if(userId){
            const user = await User.findById(userId);
            groupIds = user.join_groups;
        }
        await Promise.all(
            groupIds.map(async(currentGroupId) => {
                const group = await Group.findById(currentGroupId);
            })
        )
    }catch(error){
        console.error(error);
    }
}

export { listAllergy }