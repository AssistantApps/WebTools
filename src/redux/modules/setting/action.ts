import * as type from "./type";

export const setDarkMode = (isDark: boolean) => {
    return {
        isDark,
        type: type.DARKMODE,
    }
}

export const toggleMenu = () => {
    return {
        type: type.TOGGLEMENU,
    }
}
