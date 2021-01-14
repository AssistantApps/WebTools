import { State } from '../../redux/state';

import { getIsLoading, getUserGuid, getUserName, getUserProfileUrl } from '../../redux/modules/common/selector';
import { login, logout, setLoadingStatus } from '../../redux/modules/common/action';
import { ILoginProps } from '../../contracts/login';

export const mapStateToProps = (state: State) => {
    return {
        isLoading: getIsLoading(state),
        userGuid: getUserGuid(state),
        userProfileUrl: getUserProfileUrl(state),
        userName: getUserName(state),
    };
};

export const mapDispatchToProps = (dispatch: any) => {

    let newProps: any = {};
    newProps.setLoadingStatus = (isLoading: boolean) => {
        dispatch(setLoadingStatus(isLoading));
    };
    newProps.login = (loginData: ILoginProps) => {
        dispatch(login(loginData));
    };
    newProps.logout = () => {
        dispatch(logout());
    };
    return { ...newProps };
}