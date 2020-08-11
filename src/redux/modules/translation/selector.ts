import State from "../../state";
import { TranslationItem } from "../../entities/translation/translationItem";

export const getTranslationItems = (state: State): Array<TranslationItem> =>
    state?.translationReducer?.translationItems ?? [];