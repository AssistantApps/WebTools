import * as type from "./type";

export const setLoadingStatus = (isLoading: boolean, text?: string) => {
    return {
        isLoading,
        text: text || 'Loading',
        type: type.LOADING,
    }
}

export const login = (userGuid: string) => {
    return {
        userGuid,
        type: type.LOGIN,
    }
}

export const logout = () => {
    return {
        type: type.LOGOUT,
    }
}