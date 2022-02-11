import { DropDownWithIcon } from '../contracts/dropdown/dropDownWithIcon';
import { LanguageViewModel } from '../contracts/generated/ViewModel/languageViewModel';
import { getImageUrlFromCountryCode } from '../helper/countryCodeHelper';

export const languageDetailsToLanguageDropDownMapper = (appDetails: Array<LanguageViewModel>): Array<DropDownWithIcon> => {

    return appDetails.filter((item: LanguageViewModel) => item.isVisible)
        .map((item: LanguageViewModel) => {
            return {
                key: item.guid,
                text: item.name,
                value: item.guid,
                image: { src: getImageUrlFromCountryCode(item.countryCode) },
            };
        });
}

export const languageDetailsToGuideLanguageDropDownMapper = (appDetails: Array<LanguageViewModel>): Array<DropDownWithIcon> => {

    return appDetails.filter((item: LanguageViewModel) => item.isVisible)
        .map((item: LanguageViewModel) => {
            return {
                key: item.guid,
                text: item.name,
                value: item.languageCode,
                image: { src: getImageUrlFromCountryCode(item.countryCode) },
            };
        });
}