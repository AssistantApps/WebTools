import moment from 'moment';
import * as apiEndpoints from '../constants/apiEndpoints';
import * as storageType from '../constants/storageType';
import { AppViewModel } from '../contracts/generated/ViewModel/appViewModel';
import { LanguageViewModel } from '../contracts/generated/ViewModel/languageViewModel';
import { OAuthUserViewModel } from '../contracts/generated/ViewModel/oAuthUserViewModel';
import { TranslationGetGraphViewModel } from '../contracts/generated/ViewModel/Translation/translationGetGraphViewModel';
import { TranslationKeyViewModel } from '../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationsPerLanguageGraphViewModel } from '../contracts/generated/ViewModel/Translation/translationsPerLanguageGraphViewModel';
import { TranslationSearchViewModel } from '../contracts/generated/ViewModel/Translation/translationSearchViewModel';
import { TranslationKeySearchDropdownViewModel } from '../contracts/generated/ViewModel/Translation/translationKeySearchDropdownViewModel';
import { TranslationSubmissionViewModel } from '../contracts/generated/ViewModel/Translation/translationSubmissionViewModel';
import { TranslationSubmissionWithVotesViewModel } from '../contracts/generated/ViewModel/Translation/translationSubmissionWithVotesViewModel';
import { TranslationReportAddViewModel } from '../contracts/generated/ViewModel/Translation/translationReportAddViewModel';
import { TranslationImageViewModel } from '../contracts/generated/ViewModel/Translation/translationImageViewModel';
import { TranslationVoteViewModel } from '../contracts/generated/ViewModel/Translation/translationVoteViewModel';
import { TranslatorLeaderboardItemViewModel } from '../contracts/generated/ViewModel/Translation/translatorLeaderboardItemViewModel';
import { Result, ResultWithValue } from '../contracts/results/ResultWithValue';
import { BaseApiService } from './BaseApiService';
import { StorageService } from './StorageService';
import { ILoginProps } from '../contracts/login';
import { anyObject } from '../helper/typescriptHacks';

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
    async getTranslationKeysSearchDropdown(searchObj: TranslationSearchViewModel): Promise<ResultWithValue<Array<TranslationKeySearchDropdownViewModel>>> {
        return await this.post<Array<TranslationKeySearchDropdownViewModel>>(apiEndpoints.translationKeySearchDropdown, searchObj);
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
    async reportTranslation(data: TranslationReportAddViewModel): Promise<Result> {
        return await this.post(apiEndpoints.translationReports, data);
    }
    async getTranslationsPerLangGraphData(data: TranslationGetGraphViewModel): Promise<ResultWithValue<Array<TranslationsPerLanguageGraphViewModel>>> {
        return await this.post(apiEndpoints.translationsPerLangGraph, data);
    }
    async getTranslators(data: any): Promise<ResultWithValue<Array<TranslatorLeaderboardItemViewModel>>> {
        return await this.post(apiEndpoints.translatorLeaderboard, anyObject);
    }

    async loginWithOAuth(oAuthObj: OAuthUserViewModel): Promise<ResultWithValue<ILoginProps>> {
        var userGuid = '';
        var timeTillExpiry = 0;
        var apiResult = await this.post(apiEndpoints.authUrl, oAuthObj, (headers) => {
            var token = headers.token;
            timeTillExpiry = headers.tokenexpiry;
            userGuid = headers.userguid;

            this.setInterceptors(token);
            var expiry = moment().add(timeTillExpiry, 'seconds');

            var storageServ = new StorageService();
            storageServ.set(storageType.token, token, expiry.toDate());
            storageServ.set(storageType.userGuid, userGuid, expiry.toDate());
            storageServ.set(storageType.userName, oAuthObj.username, expiry.toDate());
        });

        const loginData: ILoginProps = {
            userGuid: userGuid,
            userName: oAuthObj.username,
            secondsTillExpire: timeTillExpiry,
            userProfileUrl: oAuthObj.profileUrl,
        };

        return {
            isSuccess: apiResult.isSuccess,
            value: loginData,
            errorMessage: apiResult.errorMessage,
        };
    }
}
