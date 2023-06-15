/* Auto Generated */

import { PlatformType } from "./../../Enum/platformType";
import { FeedbackCategory } from "./../../Enum/feedbackCategory";

export interface FeedbackFormAdminAnswerViewModel {
    guid: string;
    submissionGuid: string;
    feedbackFormGuid: string;
    platformType: PlatformType;
    category: FeedbackCategory;
    anonymousUserGuid: string;
    dateAnswered: Date;
    answers: any[];
}
