/* Auto Generated */

import { FeedbackQuestionType } from "./../../Enum/feedbackQuestionType";

export interface FeedbackFormAdminAnswerItemViewModel {
    feedbackFormQuestionGuid: string;
    questionType: FeedbackQuestionType;
    questionText: string;
    answer: string;
    answerCanContainSensitiveInfo: boolean;
    sortOrder: number;
}
