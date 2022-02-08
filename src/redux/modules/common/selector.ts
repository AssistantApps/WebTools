import { isInThePast } from "../../../helper/dateHelper";
import State from "../../state";

export const getIsLoading = (state: State): boolean =>
    state?.commonReducer?.isLoading || false;

export const getUserGuid = (state: State): string => {
    if (getIsExpiredUserDetailsDate(state)) return '';
    const value = state?.commonReducer?.userGuid || '';
    return value;
}

export const getUserProfileUrl = (state: State): string => {
    if (getIsExpiredUserDetailsDate(state)) return '';
    const value = state?.commonReducer?.userProfileUrl || '';
    return value;
}

export const getUserName = (state: State): string => {
    if (getIsExpiredUserDetailsDate(state)) return '';
    const value = state?.commonReducer?.userName || '';
    return value;
}

export const getIsExpiredUserDetailsDate = (state: State): boolean => {
    const value = state?.commonReducer?.userDetailsExpiryDate;
    if (value == null) return true;
    if (isInThePast(value)) return true;

    return false;
}