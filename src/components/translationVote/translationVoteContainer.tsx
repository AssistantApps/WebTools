import React from 'react';
import Swal from 'sweetalert2';
import { NetworkState } from '../../constants/networkState';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationSubmissionViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionViewModel';
import { TranslationSubmissionWithVotesViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionWithVotesViewModel';
import { TranslationReportViewModel } from '../../contracts/generated/ViewModel/Translation/translationReportViewModel';
import { Result } from '../../contracts/results/ResultWithValue';
import { ApiService } from '../../services/ApiService';
import { StorageService } from '../../services/StorageService';
import { TranslationVotePresenter } from './translationVotePresenter';

interface IState {
    status: NetworkState;
    translation: string;
    apiService: ApiService;
    showOwnSubmissionTextBox: boolean;
    voteOptions: Array<TranslationSubmissionWithVotesViewModel>;
    storageServ: StorageService;
}

interface IProps {
    userGuid: string;
    languageGuid: string;
    currentTranslation: TranslationKeyViewModel;
}

export class TranslationVoteContainer extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            status: NetworkState.Success,
            translation: '',
            apiService: new ApiService(),
            showOwnSubmissionTextBox: false,
            voteOptions: [],
            storageServ: new StorageService(),
        };
    }

    componentDidMount() {
        this.fetchVotes();
    }

    componentDidUpdate(prevProps: IProps) {
        if (this.props.userGuid !== prevProps.userGuid ||
            this.props.languageGuid !== prevProps.languageGuid ||
            (this.props.currentTranslation?.guid || '') !== (prevProps.currentTranslation?.guid || '')) {
            this.fetchVotes();
        }
    }

    fetchVotes = async () => {
        if (this.props == null) return;
        if (this.props.currentTranslation == null) return;
        if (this.props.currentTranslation.guid == null) return;
        if (this.props.userGuid == null || this.props.userGuid.length < 1) return;

        this.setState(() => {
            return {
                status: NetworkState.Loading,
                showOwnSubmissionTextBox: false,
                translation: '',
                voteOptions: [],
            }
        });

        var translationVotesResult = await this.state.apiService.getSubmittedTranslations(this.props.currentTranslation.guid, this.props.languageGuid);
        if (!translationVotesResult.isSuccess) {
            this.setState(() => {
                return {
                    status: NetworkState.Error
                }
            });
            return;
        }
        this.setState(() => {
            return {
                status: NetworkState.Success,
                voteOptions: translationVotesResult.value
            }
        });
    }

    setTranslation = async (translationGuid: string) => {
        await this.translationApiCall(() => this.state.apiService.selectTranslationVote({
            guid: this.props.userGuid,
            translationGuid: translationGuid,
            userGuid: this.props.userGuid,
        }));
    }

    deleteTranslation = async (translationGuid: string) => {
        await this.translationApiCall(() => this.state.apiService.deleteTranslation(translationGuid));
    }

    translationApiCall = async (apiFunc: () => Promise<Result>) => {
        this.setState(() => {
            return {
                status: NetworkState.Loading
            }
        });
        if (this.props.userGuid == null || this.props.userGuid.length < 1) {
            Swal.fire({
                title: 'Login required',
                text: 'You are not logged in, you need to be logged in in order to submit translations or vote on translation. Please log in by clicking the icon in the top right.',
            })
            return;
        }
        var apiResult = await apiFunc();
        if (!apiResult.isSuccess) {
            this.setState(() => {
                return {
                    status: NetworkState.Error
                }
            });
            return;
        }
        this.setState(() => {
            return {
                status: NetworkState.Success
            }
        });
        this.fetchVotes();
    }

    submitTranslation = async () => {
        this.setState(() => {
            return {
                status: NetworkState.Loading
            }
        });
        var voteObj: TranslationSubmissionViewModel = {
            translationKeyGuid: this.props.currentTranslation.guid,
            languageGuid: this.props.languageGuid,
            text: this.state.translation,
        }
        var transResult = await this.state.apiService.submitTranslation(voteObj);
        if (!transResult.isSuccess) {
            this.setState(() => {
                return {
                    // votes: [],
                    status: NetworkState.Error
                }
            });
            return;
        }
        this.setState(() => {
            return {
                status: NetworkState.Success
            }
        });
        this.fetchVotes();
    }

    toggleShowSubmissionTextBox = (e?: any) => {
        if (e != null) e.preventDefault();
        this.setState((prevState: IState) => {
            return {
                translation: '',
                showOwnSubmissionTextBox: !prevState.showOwnSubmissionTextBox,
            }
        })
    }

    setTranslationValue = (text: string) => {
        this.setState(() => {
            return {
                translation: text,
                showOwnSubmissionTextBox: true,
            }
        })
    }

    reportTranslation = async (badTrans: TranslationSubmissionWithVotesViewModel) => {
        const { value: additionalText } = await Swal.fire({
            icon: 'question',
            title: 'Extra Info',
            text: 'Is there any extra information that you would like to point out? This may help us remove the translation item sooner',
            input: 'text',
            inputPlaceholder: 'Extra information',
            showCancelButton: true,
        });

        if (additionalText == null) return;

        this.setState(() => {
            return {
                status: NetworkState.Loading
            }
        });
        var reportObj: TranslationReportViewModel = {
            translationGuid: badTrans.guid,
            translationKey: this.props.currentTranslation.key,
            offendingText: badTrans.text,
            origText: this.props.currentTranslation.original,
            languageGuid: this.props.languageGuid,
            additionalMessage: additionalText as string,
        }
        var reportResult = await this.state.apiService.reportTranslation(reportObj);
        if (!reportResult.isSuccess) {
            this.setState(() => {
                return {
                    status: NetworkState.Error
                }
            });
            return;
        }
        Swal.fire({
            icon: 'success',
            title: 'Thank you!',
            text: 'You are helping to make the AssistantApps Translations better!',
        })
        this.setState(() => {
            return {
                status: NetworkState.Success
            }
        });
    }

    render() {
        return (
            <TranslationVotePresenter
                userGuid={this.props.userGuid}
                currentTranslation={this.props.currentTranslation}
                submitTranslation={this.submitTranslation}
                setTranslation={this.setTranslation}
                deleteTranslation={this.deleteTranslation}
                setTranslationValue={this.setTranslationValue}
                toggleShowSubmissionTextBox={this.toggleShowSubmissionTextBox}
                reportTranslation={this.reportTranslation}
                status={this.state.status}
                translation={this.state.translation}
                showOwnSubmissionTextBox={this.state.showOwnSubmissionTextBox}
                voteOptions={this.state.voteOptions}
            />
        );
    }
};
