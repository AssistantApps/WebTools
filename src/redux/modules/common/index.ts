import * as type from './type'
import { StateCommonReducer } from '../../state/StateCommonReducer';

export const initialCommonState: StateCommonReducer = {
    isLoading: false,
    title: "Loading",
    userGuid: '',
    userName: '',
    userProfileUrl: '',
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
            });
        case type.LOGOUT:
            return Object.assign({}, state, {
                userGuid: '',
                userName: '',
                userProfileUrl: '',
            });
        default:
            return state
    }
}
