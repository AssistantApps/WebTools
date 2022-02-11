export const app = 'app';
export const language = 'language';
export const translation = 'translation';
export const translationKeySearch = 'translationKey/Search';
export const translationKeySearchDropdown = 'translationKey/SearchDropdown';
export const translationKeyImages = 'translationImage';
export const translationVotes = 'translationvote';
export const translationReports = 'translationReport';
export const translationsPerLangGraph = 'translation/Graph/TranslationsPerLanguage';
export const translatorLeaderboard = 'translationStats/TranslatorLeaderboard';
export const authUrl = 'Account/Login';

export const guideParam = {
    getGuideById: ':guid',
    editGuide: ':guid',
    deleteGuide: ':guid',
}
export const guide = {
    getForCurrentUser: 'GuideDetail/User',
    getGuideById: `GuideContent/${guideParam.getGuideById}`,
    submitGuide: 'GuideDetail',
    editGuide: `GuideDetail/${guideParam.editGuide}`,
    deleteGuide: `GuideContent/${guideParam.deleteGuide}`,
}
