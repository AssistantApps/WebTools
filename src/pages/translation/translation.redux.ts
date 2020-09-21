import { State } from '../../redux/state';

import { initTranslations, editTranslationItem } from '../../redux/modules/translation/action';
import { TranslationItem } from '../../redux/entities/translation/translationItem';
import { getTranslationItems } from '../../redux/modules/translation/selector';
import { getUserGuid } from '../../redux/modules/common/selector';
import { StorageService } from '../../services/StorageService';
import * as storageType from '../../constants/storageType';

export const mapStateToProps = (state: State) => {
    let userGuidFromStorage = '';
    const storageServ = new StorageService();
    const userGuidFromStorageResult = storageServ.get<string>(storageType.userGuid);
    if (userGuidFromStorageResult.isSuccess) userGuidFromStorage = userGuidFromStorageResult.value;
    return {
        translationItems: getTranslationItems(state),
        userGuid: getUserGuid(state) || userGuidFromStorage,
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