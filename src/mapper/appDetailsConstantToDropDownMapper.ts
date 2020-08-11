import { publishedAppsDetailsType } from "../constants/appDetails";

export const appDetailsConstantToDropDownMapper = (publishedAppsDetail: publishedAppsDetailsType) => {
    if (!publishedAppsDetail.publiclyVisible) return null;
    return {
        key: publishedAppsDetail.appType,
        text: publishedAppsDetail.gameName,
        value: publishedAppsDetail.appType,
        image: { src: publishedAppsDetail.icon },
    };
}