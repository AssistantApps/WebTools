import * as apiEndpoints from '../constants/apiEndpoints';
import { AppViewModel } from '../contracts/generated/ViewModel/appViewModel';
import { LanguageViewModel } from '../contracts/generated/ViewModel/languageViewModel';
import { ResultWithValue } from '../contracts/results/ResultWithValue';

import { BaseApiService } from './BaseApiService';
import { TranslationKeyViewModel } from '../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationSearchViewModel } from '../contracts/generated/ViewModel/Translation/translationSearchViewModel';
import { TranslationImageViewModel } from '../contracts/generated/ViewModel/translationImageViewModel';

export class ApiService extends BaseApiService {
    async getApps(): Promise<ResultWithValue<Array<AppViewModel>>> {
        return await this.get<Array<AppViewModel>>(apiEndpoints.app);
    }
    async getLanguages(): Promise<ResultWithValue<Array<LanguageViewModel>>> {
        return await this.get<Array<LanguageViewModel>>(apiEndpoints.language);
    }
    async getTranslationKeys(searchObj: TranslationSearchViewModel): Promise<ResultWithValue<Array<TranslationKeyViewModel>>> {
        return await this.post<Array<TranslationKeyViewModel>>(apiEndpoints.translationKeySearch, searchObj);
    }
    async getTranslationImages(translationKeyGuid: string): Promise<ResultWithValue<Array<TranslationImageViewModel>>> {
        return await this.get<Array<TranslationImageViewModel>>(`${apiEndpoints.translationKeyImages}/${translationKeyGuid}`);
    }
}
