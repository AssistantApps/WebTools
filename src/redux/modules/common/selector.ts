import State from "../../state";

export const getIsLoading = (state: State): boolean =>
    state?.commonReducer?.isLoading || false;