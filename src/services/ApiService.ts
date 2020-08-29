import { AppViewModel } from '../contracts/generated/ViewModel/appViewModel';
import * as apiEndpoints from '../constants/apiEndpoints';

import { ResultWithValue } from '../contracts/results/ResultWithValue';

import { BaseApiService } from './BaseApiService';

export class ApiService extends BaseApiService {
    async getApps(): Promise<ResultWithValue<Array<AppViewModel>>> {
        return await this.get<Array<AppViewModel>>(apiEndpoints.app);
    }
}
