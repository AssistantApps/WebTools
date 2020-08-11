import * as CacheKey from './cacheKey';

import { initialSettingState } from './modules/setting/index';
import { initialTranslationState } from './modules/translation/index';


export const loadStateFromLocalStorage = () => {
    let settingReducer = initialSettingState;
    let storedSettingReducer = localStorage.getItem(CacheKey.SettingReducerKey);
    if (storedSettingReducer && storedSettingReducer !== "undefined") {
        settingReducer = JSON.parse(storedSettingReducer || '{}');
    }

    let translationReducer = initialTranslationState;
    let storedTranslationReducer = localStorage.getItem(CacheKey.TranslationReducerKey);
    if (storedTranslationReducer && storedTranslationReducer !== "undefined") {
        translationReducer = JSON.parse(storedTranslationReducer || '{}');
    }

    let persistedState: any = {
        settingReducer,
        translationReducer
    }
    return persistedState;
}

export const saveStateToLocalStorage = (store: any) => {
    var currentSettingReducer = store.getState().settingReducer;
    var storedSettingReducer = JSON.parse(localStorage.getItem(CacheKey.SettingReducerKey) || '{}');
    if (storedSettingReducer == null
        || storedSettingReducer.isDark !== currentSettingReducer.isDark) {
        localStorage.setItem(CacheKey.SettingReducerKey, JSON.stringify(currentSettingReducer));
    }

    var currentTranslationReducer = store.getState().translationReducer;
    var storedTranslationReducer = localStorage.getItem(CacheKey.TranslationReducerKey);
    if (storedTranslationReducer == null
        || storedTranslationReducer !== JSON.stringify(currentTranslationReducer?.translationItems || [])) {
        localStorage.setItem(CacheKey.TranslationReducerKey, JSON.stringify(currentTranslationReducer));
    }
}