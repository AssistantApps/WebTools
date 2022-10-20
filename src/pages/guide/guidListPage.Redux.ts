import { State } from '../../redux/state';
import { getUserGuid } from '../../redux/modules/common/selector';

export const mapStateToProps = (state: State) => {
    return {
        userGuid: getUserGuid(state),
    };
};

// export const mapDispatchToProps = (dispatch: any) => {

//     let newProps: any = {};
//     newProps.setLoadingStatus = (isLoading: boolean) => {
//         dispatch(setLoadingStatus(isLoading));
//     };
//     newProps.login = (loginData: ILoginProps) => {
//         dispatch(login(loginData));
//     };
//     newProps.logout = () => {
//         dispatch(logout());
//     };
//     return { ...newProps };
// }