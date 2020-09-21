import State from "../../state";

export const getIsLoading = (state: State): boolean =>
    state?.commonReducer?.isLoading || false;

export const getUserGuid = (state: State): string =>
    state?.commonReducer?.userGuid || '';