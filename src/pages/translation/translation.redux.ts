import { State } from '../../redux/state';

import { initTranslations, editTranslationItem } from '../../redux/modules/translation/action';
import { TranslationItem } from '../../redux/entities/translation/translationItem';
import { getTranslationItems } from '../../redux/modules/translation/selector';

export const mapStateToProps = (state: State) => {
    return {
        translationItems: getTranslationItems(state)
    };
};

export const mapDispatchToProps = (dispatch: any) => {

    let newProps: any = {};
    newProps.initTranslations = (translationItems: TranslationItem[]) => {
        dispatch(initTranslations(translationItems));
    };
    newProps.editTranslationItem = (translationItemKey: string, translationItem: TranslationItem) => {
        dispatch(editTranslationItem(translationItemKey, translationItem));
    };
    return { ...newProps };
}