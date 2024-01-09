import { AssistantAppsApiService as aaApi, AddOrEditGuideViewModel, AppViewModel, GuideContentViewModel, GuideSearchResultViewModel, GuideSearchViewModel, IUserLogin, LanguageViewModel, OAuthUserViewModel, TranslationGetGraphViewModel, TranslationImageViewModel, TranslationKeySearchDropdownViewModel, TranslationKeyViewModel, TranslationReportAddViewModel, TranslationSearchViewModel, TranslationsPerLanguageGraphViewModel, TranslationSubmissionViewModel, TranslationSubmissionWithVotesViewModel, TranslationVoteViewModel, TranslatorLeaderboardItemViewModel } from '@assistantapps/assistantapps.api.client';
import * as apiEndpoints from '../../constants/apiEndpoints';
import * as storageType from '../../constants/storageType';
import { ILoginProps } from '../../contracts/login';
import { PaginationWithValue } from '../../contracts/pagination/paginationWithValue';
import { Result, ResultWithValue } from '../../contracts/results/ResultWithValue';
import { getExpiryDateUtc } from '../../helper/dateHelper';
import { BaseApiService } from './../BaseApiService';
import { StorageService } from './../StorageService';

export class AssistantAppsApiService extends BaseApiService {
    private _api: aaApi;

    constructor() {
        super();

        const storageServ = new StorageService();
        const tokenFromStorage = storageServ.get<string>(storageType.token);
        this._api = new aaApi({
            url: window.config.apiUrl,
            authToken: (tokenFromStorage.isSuccess) ? tokenFromStorage.value : undefined,
        });
    }

    // Base
    getApps = (): Promise<ResultWithValue<Array<AppViewModel>>> => this._api.app.readAll();
    getLanguages = (): Promise<ResultWithValue<Array<LanguageViewModel>>> => this._api.language.readAll();

    // Translations
    submitTranslation = (data: TranslationSubmissionViewModel): Promise<Result> => this._api.translation.create(data);
    deleteTranslation = (guid: string): Promise<Result> => this._api.translation.del(guid);
    getTranslationsPerLangGraphData = (data: TranslationGetGraphViewModel): Promise<ResultWithValue<Array<TranslationsPerLanguageGraphViewModel>>> => this._api.translation.createSearchPerLanguage(data);

    // Translations
    getTranslationKeys = (searchObj: TranslationSearchViewModel): Promise<ResultWithValue<Array<TranslationKeyViewModel>>> => this._api.translationKey.createSearch(searchObj);
    getTranslationKeysSearchDropdown = (searchObj: TranslationSearchViewModel): Promise<ResultWithValue<Array<TranslationKeySearchDropdownViewModel>>> => this._api.translationKey.createSearchDropdown(searchObj);
    getSubmittedTranslations = (translationKeyGuid: string, languageGuid: string): Promise<ResultWithValue<Array<TranslationSubmissionWithVotesViewModel>>> => this._api.translation.readForLang(translationKeyGuid, languageGuid);

    // Translation Images
    getTranslationImages = (translationKeyGuid: string): Promise<ResultWithValue<Array<TranslationImageViewModel>>> => this._api.translationImage.readAll(translationKeyGuid);

    // Translation Votes
    getTranslationVotes = (translationKeyGuid: string): Promise<ResultWithValue<Array<TranslationVoteViewModel>>> => this._api.translationVote.readForTansKeyGuid(translationKeyGuid);
    selectTranslationVote = (data: TranslationVoteViewModel): Promise<Result> => this._api.translationVote.create(data);

    // Translation Reports
    reportTranslation = (data: TranslationReportAddViewModel): Promise<Result> => this._api.translationReport.create(data);
    getTranslators = (data: any): Promise<ResultWithValue<Array<TranslatorLeaderboardItemViewModel>>> => this._api.translationStat.readAll(data);


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
        const apiResult = await this._api.account.loginWithGoogleAuth(
            oAuthObj,
            (userAcc: IUserLogin) => {
                const token = userAcc.token;
                timeTillExpiry = parseInt(userAcc.tokenExpiry);
                userGuid = userAcc.userGuid;

                this.setInterceptors(token);
                expiryDate = getExpiryDateUtc(timeTillExpiry);

                const storageServ = new StorageService();
                storageServ.set(storageType.token, token, expiryDate);
                storageServ.set(storageType.userGuid, userGuid, expiryDate);
                storageServ.set(storageType.userName, oAuthObj.username, expiryDate);


                this._api = new aaApi({
                    url: window.config.apiUrl,
                    authToken: userAcc.token,
                })
            },
        );

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
