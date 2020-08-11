import * as type from './type'
import { StateTranslationReducer } from '../../state/StateTranslationReducer';
import { TranslationItem } from '../../entities/translation/translationItem';

export const initialTranslationState: StateTranslationReducer = {
    translationItems: []
}

export const translationReducer = (state = initialTranslationState, action: any) => {
    switch (action.type) {
        case type.INITTRANSLATIONS:
            return Object.assign({}, state, {
                translationItems: [...action.translationItems],
            });
        case type.EDITITEM:
            return Object.assign({}, state, {
                translationItems: state.translationItems.map(
                    (item: TranslationItem, i) => item.key === action.key
                        ? { ...action.translationItem }
                        : item
                ),
            });
        default:
            return state
    }
}
