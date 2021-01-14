import * as type from "./type";
import { ILoginProps } from '../../../contracts/login';

export const setLoadingStatus = (isLoading: boolean, text?: string) => {
    return {
        isLoading,
        text: text || 'Loading',
        type: type.LOADING,
    }
}


export const login = (login: ILoginProps) => {
    return {
        ...login,
        type: type.LOGIN,
    }
}

export const logout = () => {
    return {
        type: type.LOGOUT,
    }
}