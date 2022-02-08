import { AppType } from './appType';

export interface PublishedAppsDetailsType {
    name: string;
    gameName: string;
    appType: AppType;
    icon: string;
    logo: string;
    githubRepo: string;
    languageFolder: string;
    publiclyVisible: boolean;
}

export const publishedAppsDetails: Array<PublishedAppsDetailsType> = [
    {
        name: 'Assistant for No Man\'s Sky',
        gameName: 'No Man\'s Sky',
        appType: AppType.NoMansSky,
        icon: '/assets/img/icon/assistantNMS.png',
        logo: '/assets/img/assistantNMS.png',
        githubRepo: '',
        languageFolder: '',
        publiclyVisible: true,
    },
    {
        name: 'Assistant for Scrap Mechanic',
        gameName: 'Scrap Mechanic',
        appType: AppType.ScrapMechanic,
        icon: '/assets/img/icon/assistantSMS.png',
        logo: '/assets/img/assistantSMS.png',
        githubRepo: '',
        languageFolder: '',
        publiclyVisible: true,
    },
    {
        name: 'Assistant for Hytale',
        gameName: 'Hytale',
        appType: AppType.Hytale,
        icon: '/assets/img/icon/assistantHyt.png',
        logo: '/assets/img/assistantHyt.png',
        githubRepo: '',
        languageFolder: '',
        publiclyVisible: false,
    }
]