import { AdminApprovalStatus } from "../contracts/generated/Enum/adminApprovalStatus";
import { addSpacesForEnum, capitalizeFirstLetter } from "../helper/stringHelper";

export const AdminAprovalStatusOptions = Object.values(AdminApprovalStatus)
    .filter((value) => typeof value === "string")
    .map(v => v.toString())
    .map((value) => ({
        value,
        key: value,
        text: capitalizeFirstLetter(addSpacesForEnum(value))
    }));

export const DefaultAdminAprovalStatusSelection = [
    AdminApprovalStatus.pending,
    AdminApprovalStatus.inReview,
    AdminApprovalStatus.approved,
]