import { INITTRANSLATIONS, EDITITEM } from "./type";
import { TranslationItem } from "../../entities/translation/translationItem";

export const initTranslations = (translationItems: Array<TranslationItem>) => {
    return {
        translationItems,
        type: INITTRANSLATIONS,
    }
}

export const editTranslationItem = (translationItemKey: string, translationItem: TranslationItem) => {
    return {
        key: translationItemKey,
        translationItem,
        type: EDITITEM,
    }
}