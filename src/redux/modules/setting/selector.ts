import State from "../../state";

export const getIsDark = (state: State): boolean => state?.settingReducer?.isDark != null ? state.settingReducer.isDark : true;
export const getMenuVisibility = (state: State): boolean => state?.settingReducer?.menuIsVisible || false;