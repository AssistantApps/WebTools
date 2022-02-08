import { PublishedAppsDetailsType } from '../constants/appDetails';
import { DropDownWithIcon } from '../contracts/dropdown/dropDownWithIcon';
import { AppViewModel } from '../contracts/generated/ViewModel/appViewModel';

export const appDetailsConstantToDropDownMapper = (publishedAppsDetail: PublishedAppsDetailsType) => {
    if (!publishedAppsDetail.publiclyVisible) return null;
    return {
        key: publishedAppsDetail.appType,
        text: publishedAppsDetail.gameName,
        value: publishedAppsDetail.appType,
        image: { src: publishedAppsDetail.icon },
    };
}

export const appDetailsToAppDropDownMapper = (appDetails: Array<AppViewModel>): Array<DropDownWithIcon> => {
    return appDetails.map((item: AppViewModel) => {
        return {
            key: item.guid,
            text: item.gameName,
            value: item.guid,
            image: { src: item.iconUrl },
        };
    });
}