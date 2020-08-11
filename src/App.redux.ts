import { State } from './redux/state';
import { setDarkMode, toggleMenu } from './redux/modules/setting/action';
import { getIsDark, getMenuVisibility } from './redux/modules/setting/selector';

export const mapStateToProps = (state: State) => {
    return {
        isDark: getIsDark(state),
        isMenuOpen: getMenuVisibility(state)
    };
};

export const mapDispatchToProps = (dispatch: any) => {

    let newProps: any = {};
    newProps.setDarkMode = (isDark: boolean) => {
        dispatch(setDarkMode(isDark));
    };
    newProps.toggleMenu = () => {
        dispatch(toggleMenu());
    };
    return { ...newProps };
}