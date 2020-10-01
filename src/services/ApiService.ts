import moment from 'moment';
import * as apiEndpoints from '../constants/apiEndpoints';
import * as storageType from '../constants/storageType';
import { AppViewModel } from '../contracts/generated/ViewModel/appViewModel';
import { LanguageViewModel } from '../contracts/generated/ViewModel/languageViewModel';
import { OAuthUserViewModel } from '../contracts/generated/ViewModel/oAuthUserViewModel';
import { TranslationKeyViewModel } from '../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationSearchViewModel } from '../contracts/generated/ViewModel/Translation/translationSearchViewModel';
import { TranslationSubmissionViewModel } from '../contracts/generated/ViewModel/Translation/translationSubmissionViewModel';
import { TranslationSubmissionWithVotesViewModel } from '../contracts/generated/ViewModel/Translation/translationSubmissionWithVotesViewModel';
import { TranslationVoteViewModel } from '../contracts/generated/ViewModel/Translation/translationVoteViewModel';
import { TranslationImageViewModel } from '../contracts/generated/ViewModel/Translation/translationImageViewModel';
import { Result, ResultWithValue } from '../contracts/results/ResultWithValue';
import { BaseApiService } from './BaseApiService';
import { StorageService } from './StorageService';

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
    async getTranslationVotes(translationKeyGuid: string): Promise<ResultWithValue<Array<TranslationVoteViewModel>>> {
        return await this.get<Array<TranslationVoteViewModel>>(`${apiEndpoints.translationVotes}/${translationKeyGuid}`);
    }
    async getSubmittedTranslations(translationKeyGuid: string, languageGuid: string): Promise<ResultWithValue<Array<TranslationSubmissionWithVotesViewModel>>> {
        return await this.get<Array<TranslationSubmissionWithVotesViewModel>>(`${apiEndpoints.translation}/${translationKeyGuid}/${languageGuid}`);
    }
    async submitTranslation(data: TranslationSubmissionViewModel): Promise<Result> {
        return await this.post(apiEndpoints.translation, data);
    }
    async deleteTranslation(guid: string): Promise<Result> {
        return await this.delete(`${apiEndpoints.translation}/${guid}`);
    }
    async selectTranslationVote(data: TranslationVoteViewModel): Promise<Result> {
        return await this.post(apiEndpoints.translationVotes, data);
    }

    async loginWithOAuth(oAuthObj: OAuthUserViewModel): Promise<ResultWithValue<string>> {
        var userGuid = '';
        var apiResult = await this.post(apiEndpoints.authUrl, oAuthObj, (headers) => {
            var token = headers.token;
            var tokenExpiry = headers.tokenexpiry;
            var username = headers.username;
            userGuid = headers.userguid;

            this.setInterceptors(token);
            var expiry = moment().add(tokenExpiry, 'seconds');

            var storageServ = new StorageService();
            storageServ.set(storageType.token, token, expiry.toDate());
            storageServ.set(storageType.userGuid, userGuid, expiry.toDate());
            storageServ.set(storageType.userName, username, expiry.toDate());
        });


        return {
            isSuccess: apiResult.isSuccess,
            value: userGuid,
            errorMessage: apiResult.errorMessage,
        };
    }
}
