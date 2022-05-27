import * as type from './type';
import * as CacheKey from '../../cacheKey';
import { StateCommonReducer } from '../../state/StateCommonReducer';

export const initialCommonState: StateCommonReducer = {
    isLoading: false,
    title: "Loading",
    userGuid: '',
    userName: '',
    userProfileUrl: '',
    userDetailsExpiryDate: new Date(),
}

export const commonReducer = (state = initialCommonState, action: any) => {
    switch (action.type) {
        case type.LOADING:
            return Object.assign({}, state, {
                isLoading: action.isLoading,
                text: action.text
            });
        case type.LOGIN:
            return Object.assign({}, state, {
                userGuid: action.userGuid,
                userName: action.userName,
                userProfileUrl: action.userProfileUrl,
                userDetailsExpiryDate: action.userDetailsExpiryDate,
            });
        case type.LOGOUT:
            localStorage.removeItem(CacheKey.CommonReducerKey);
            return Object.assign({}, state, {
                userGuid: '',
                userName: '',
                userProfileUrl: '',
                userDetailsDate: null,
            });
        default:
            return state
    }
}
