import * as CacheKey from './cacheKey';

import { initialCommonState } from './modules/common/index';
import { initialSettingState } from './modules/setting/index';
import { initialTranslationState } from './modules/translation/index';
import { StateCommonReducer } from './state/StateCommonReducer';
import { StateSettingReducer } from './state/StateSettingReducer';


export const loadStateFromLocalStorage = () => {
    let commonReducer = initialCommonState;
    const storedCommonReducer = localStorage.getItem(CacheKey.CommonReducerKey);
    if (storedCommonReducer && storedCommonReducer !== "undefined") {
        commonReducer = JSON.parse(storedCommonReducer || '{}');
    }

    let settingReducer = initialSettingState;
    const storedSettingReducer = localStorage.getItem(CacheKey.SettingReducerKey);
    if (storedSettingReducer && storedSettingReducer !== "undefined") {
        settingReducer = JSON.parse(storedSettingReducer || '{}');
    }

    let translationReducer = initialTranslationState;
    const storedTranslationReducer = localStorage.getItem(CacheKey.TranslationReducerKey);
    if (storedTranslationReducer && storedTranslationReducer !== "undefined") {
        translationReducer = JSON.parse(storedTranslationReducer || '{}');
    }

    const persistedState: any = {
        settingReducer,
        commonReducer,
        translationReducer
    }
    return persistedState;
}

export const saveStateToLocalStorage = (store: any) => {
    const currentCommonReducer = store.getState().commonReducer;
    const storedCommonReducer: StateCommonReducer = JSON.parse(localStorage.getItem(CacheKey.CommonReducerKey) || '{}');
    if (storedCommonReducer == null
        || storedCommonReducer.userGuid !== currentCommonReducer.userGuid
        || storedCommonReducer.userName !== currentCommonReducer.userName
        || storedCommonReducer.userProfileUrl !== currentCommonReducer.userProfileUrl
        || storedCommonReducer.userDetailsExpiryDate !== currentCommonReducer.userDetailsExpiryDate
    ) {
        currentCommonReducer.isLoading = false;
        localStorage.setItem(CacheKey.CommonReducerKey, JSON.stringify(currentCommonReducer));
    }

    const currentSettingReducer = store.getState().settingReducer;
    const storedSettingReducer: StateSettingReducer = JSON.parse(localStorage.getItem(CacheKey.SettingReducerKey) || '{}');
    if (storedSettingReducer == null
        || storedSettingReducer.isDark !== currentSettingReducer.isDark
    ) {
        localStorage.setItem(CacheKey.SettingReducerKey, JSON.stringify(currentSettingReducer));
    }

    const currentTranslationReducer = store.getState().translationReducer;
    const storedTranslationReducer = localStorage.getItem(CacheKey.TranslationReducerKey);
    if (storedTranslationReducer == null
        || storedTranslationReducer !== JSON.stringify(currentTranslationReducer?.translationItems || [])) {
        localStorage.setItem(CacheKey.TranslationReducerKey, JSON.stringify(currentTranslationReducer));
    }
}