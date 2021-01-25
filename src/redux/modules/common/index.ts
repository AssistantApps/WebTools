import * as type from './type'
import { StateCommonReducer } from '../../state/StateCommonReducer';
import moment from 'moment';

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
                userDetailsExpiryDate: moment().add(action.secondsTillExpire, 'seconds'),
            });
        case type.LOGOUT:
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
