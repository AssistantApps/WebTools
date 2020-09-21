import * as type from './type'
import { StateCommonReducer } from '../../state/StateCommonReducer';

const initialState: StateCommonReducer = {
    isLoading: false,
    title: "Loading",
    userGuid: '',
}

export const commonReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case type.LOADING:
            return Object.assign({}, state, {
                isLoading: action.isLoading,
                text: action.text
            });
        case type.LOGIN:
            return Object.assign({}, state, {
                userGuid: action.userGuid
            });
        case type.LOGOUT:
            return Object.assign({}, state, {
                userGuid: '',
            });
        default:
            return state
    }
}
