import * as apiEndpoints from '../constants/apiEndpoints';
import { AppViewModel } from '../contracts/generated/ViewModel/appViewModel';
import { LanguageViewModel } from '../contracts/generated/ViewModel/languageViewModel';
import { ResultWithValue } from '../contracts/results/ResultWithValue';

import { BaseApiService } from './BaseApiService';

export class ApiService extends BaseApiService {
    async getApps(): Promise<ResultWithValue<Array<AppViewModel>>> {
        return await this.get<Array<AppViewModel>>(apiEndpoints.app);
    }
    async getLanguages(): Promise<ResultWithValue<Array<LanguageViewModel>>> {
        return await this.get<Array<LanguageViewModel>>(apiEndpoints.language);
    }
}
