import * as apiEndpoints from '../../constants/apiEndpoints';
import * as storageType from '../../constants/storageType';
import { AppViewModel } from '../../contracts/generated/ViewModel/appViewModel';
import { getExpiryDateUtc } from '../../helper/dateHelper';
import { GuideSearchResultViewModel } from '../../contracts/generated/ViewModel/Guide/guideSearchResultViewModel';
import { GuideSearchViewModel } from '../../contracts/generated/ViewModel/Guide/guideSearchViewModel';
import { LanguageViewModel } from '../../contracts/generated/ViewModel/languageViewModel';
import { OAuthUserViewModel } from '../../contracts/generated/ViewModel/oAuthUserViewModel';
import { TranslationGetGraphViewModel } from '../../contracts/generated/ViewModel/Translation/translationGetGraphViewModel';
import { TranslationImageViewModel } from '../../contracts/generated/ViewModel/Translation/translationImageViewModel';
import { TranslationKeySearchDropdownViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeySearchDropdownViewModel';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationSearchViewModel } from '../../contracts/generated/ViewModel/Translation/translationSearchViewModel';
import { TranslationsPerLanguageGraphViewModel } from '../../contracts/generated/ViewModel/Translation/translationsPerLanguageGraphViewModel';
import { TranslationSubmissionViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionViewModel';
import { TranslationSubmissionWithVotesViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionWithVotesViewModel';
import { TranslationVoteViewModel } from '../../contracts/generated/ViewModel/Translation/translationVoteViewModel';
import { ILoginProps } from '../../contracts/login';
import { PaginationWithValue } from '../../contracts/pagination/paginationWithValue';
import { Result, ResultWithValue } from '../../contracts/results/ResultWithValue';
import { BaseApiService } from './../BaseApiService';
import { StorageService } from './../StorageService';
import { AddOrEditGuideViewModel } from '../../contracts/generated/ViewModel/Guide/addOrEditGuideViewModel';
import { GuideContentViewModel } from '../../contracts/generated/ViewModel/Guide/guideContentViewModel';
import { TranslatorLeaderboardItemViewModel } from '../../contracts/generated/ViewModel/Translation/translatorLeaderboardItemViewModel';
import { TranslationReportAddViewModel } from '../../contracts/generated/ViewModel/Translation/translationReportAddViewModel';

export class AssistantAppsApiService extends BaseApiService {
    // Base
    getApps = (): Promise<ResultWithValue<Array<AppViewModel>>> =>
        this.get<Array<AppViewModel>>(apiEndpoints.app);
    getLanguages = (): Promise<ResultWithValue<Array<LanguageViewModel>>> =>
        this.get<Array<LanguageViewModel>>(apiEndpoints.language);

    // Translations
    getTranslationKeys = (searchObj: TranslationSearchViewModel): Promise<ResultWithValue<Array<TranslationKeyViewModel>>> =>
        this.post<Array<TranslationKeyViewModel>>(apiEndpoints.translationKeySearch, searchObj);

    getTranslationKeysSearchDropdown = (searchObj: TranslationSearchViewModel): Promise<ResultWithValue<Array<TranslationKeySearchDropdownViewModel>>> =>
        this.post<Array<TranslationKeySearchDropdownViewModel>>(apiEndpoints.translationKeySearchDropdown, searchObj);

    getTranslationImages = (translationKeyGuid: string): Promise<ResultWithValue<Array<TranslationImageViewModel>>> =>
        this.get<Array<TranslationImageViewModel>>(`${apiEndpoints.translationKeyImages}/${translationKeyGuid}`);

    getTranslationVotes = (translationKeyGuid: string): Promise<ResultWithValue<Array<TranslationVoteViewModel>>> =>
        this.get<Array<TranslationVoteViewModel>>(`${apiEndpoints.translationVotes}/${translationKeyGuid}`);

    getSubmittedTranslations = (translationKeyGuid: string, languageGuid: string): Promise<ResultWithValue<Array<TranslationSubmissionWithVotesViewModel>>> =>
        this.get<Array<TranslationSubmissionWithVotesViewModel>>(`${apiEndpoints.translation}/${translationKeyGuid}/${languageGuid}`);

    submitTranslation = (data: TranslationSubmissionViewModel): Promise<Result> =>
        this.post(apiEndpoints.translation, data);

    deleteTranslation = (guid: string): Promise<Result> =>
        this.delete(`${apiEndpoints.translation}/${guid}`);

    selectTranslationVote = (data: TranslationVoteViewModel): Promise<Result> =>
        this.post(apiEndpoints.translationVotes, data);

    reportTranslation = (data: TranslationReportAddViewModel): Promise<Result> =>
        this.post(apiEndpoints.translationReports, data);

    getTranslationsPerLangGraphData = (data: TranslationGetGraphViewModel): Promise<ResultWithValue<Array<TranslationsPerLanguageGraphViewModel>>> =>
        this.post(apiEndpoints.translationsPerLangGraph, data);

    getTranslators = (data: any): Promise<ResultWithValue<Array<TranslatorLeaderboardItemViewModel>>> =>
        this.post(apiEndpoints.translatorLeaderboard, data);


    // Guides
    getGuidesForUser = (search: GuideSearchViewModel): Promise<ResultWithValue<PaginationWithValue<Array<GuideSearchResultViewModel>>>> =>
        this.post(apiEndpoints.guide.getForCurrentUser, search);
    getGuidesById = (id: string): Promise<ResultWithValue<GuideContentViewModel>> =>
        this.get(apiEndpoints.guide.getGuideById.replace(apiEndpoints.guideParam.getGuideById, id));
    submitGuide = (newGuide: AddOrEditGuideViewModel): Promise<Result> =>
        this.post(apiEndpoints.guide.submitGuide, newGuide);
    editGuide = (guid: string, editedGuide: AddOrEditGuideViewModel): Promise<Result> =>
        this.post(apiEndpoints.guide.editGuide.replace(apiEndpoints.guideParam.editGuide, guid), editedGuide);
    deleteGuide = (guid: string): Promise<Result> =>
        this.delete(apiEndpoints.guide.deleteGuide.replace(apiEndpoints.guideParam.deleteGuide, guid));


    // Auth
    async loginWithOAuth(oAuthObj: OAuthUserViewModel): Promise<ResultWithValue<ILoginProps>> {
        let userGuid = '';
        let timeTillExpiry = 0;
        let expiryDate = new Date();
        const apiResult = await this.post(apiEndpoints.authUrl, oAuthObj, (headers) => {
            const token = headers.token;
            timeTillExpiry = headers.tokenexpiry;
            userGuid = headers.userguid;

            this.setInterceptors(token);
            expiryDate = getExpiryDateUtc(timeTillExpiry);

            const storageServ = new StorageService();
            storageServ.set(storageType.token, token, expiryDate);
            storageServ.set(storageType.userGuid, userGuid, expiryDate);
            storageServ.set(storageType.userName, oAuthObj.username, expiryDate);
        });

        const loginData: ILoginProps = {
            userGuid: userGuid,
            userName: oAuthObj.username,
            secondsTillExpire: timeTillExpiry,
            userProfileUrl: oAuthObj.profileUrl,
            userDetailsExpiryDate: expiryDate,
        };

        return {
            isSuccess: apiResult.isSuccess,
            value: loginData,
            errorMessage: apiResult.errorMessage,
        };
    }
}
