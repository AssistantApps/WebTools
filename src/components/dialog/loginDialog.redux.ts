import { State } from '../../redux/state';

import { getIsLoading } from '../../redux/modules/common/selector';
import { setLoadingStatus } from '../../redux/modules/common/action';

export const mapStateToProps = (state: State) => {
    return {
        isLoading: getIsLoading(state)
    };
};

export const mapDispatchToProps = (dispatch: any) => {

    let newProps: any = {};
    newProps.setLoadingStatus = (isLoading: boolean) => {
        dispatch(setLoadingStatus(isLoading));
    };
    return { ...newProps };
}