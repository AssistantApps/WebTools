/* Auto Generated */

import { AdminApprovalStatus } from "./../../Enum/adminApprovalStatus";

export interface GuideDetailViewModel {
    guid: any;
    title: string;
    subTitle: string;
    likes: number;
    views: number;
    showCreatedByUser: boolean;
    userGuid: any;
    languageCode: any[];
    minutes: number;
    tags: any[];
    originalGuideGuid?: any;
    translatorGuid?: any;
    status: AdminApprovalStatus;
    dateCreated: Date;
    dateUpdated: Date;
}
