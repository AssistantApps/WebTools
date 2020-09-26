import classNames from 'classnames';
import React from 'react';
import { Form, Placeholder, Segment, TextArea, TextAreaProps } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { NetworkState } from '../../constants/networkState';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationSubmissionViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionViewModel';
import { TranslationSubmissionWithVotesViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionWithVotesViewModel';
import { Result } from '../../contracts/results/ResultWithValue';
import { ApiService } from '../../services/ApiService';
import { StorageService } from '../../services/StorageService';
import { ConditionalToolTip } from '../common/conditionalTooltip';
import { TranslationVoteItem } from './translationVoteItem';

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
                showOwnSubmissionTextBox: !prevState.showOwnSubmissionTextBox
            }
        })
    }

    setTranslationValue = (text: string) => {
        this.setState(() => {
            return {
                translation: text
            }
        })
    }

    render() {
        const textAreaFunc = (_: any, data: TextAreaProps) => {
            const text: any = data.value;
            this.setState(() => {
                return {
                    translation: text
                }
            });
        };

        const submitTranslationDisabled = this.state.translation == null || this.state.translation.length < 2;

        if (this.state.status === NetworkState.Loading) {
            return (
                <>
                    <hr />
                    <div className="row full">
                        <div className="col-12 pb2">
                            <Placeholder style={{ margin: '0 auto' }}>
                                <Placeholder.Line />
                                <Placeholder.Line />
                                <Placeholder.Line />
                            </Placeholder>
                        </div>
                    </div>
                </>
            );
        }

        if (this.props.currentTranslation == null) {
            return (<div></div>);
        }

        if (this.props.userGuid == null || this.props.userGuid.length < 1) return (
            <Segment placeholder style={{ minHeight: 'unset' }}>
                <p style={{ textAlign: 'center' }}>Please log in to vote</p>
            </Segment>
        );

        const hasVoteOptions = this.state.voteOptions != null && this.state.voteOptions.length > 0;
        const showOwnSubmissionTextBox = this.state.showOwnSubmissionTextBox || !hasVoteOptions;

        return (
            <>
                <hr />
                <div className="row full pt1">
                    <div className={classNames("col-12", { inVisible: showOwnSubmissionTextBox })}>
                        <p>Submissions from previous Translators</p>
                        {
                            this.state.voteOptions.map((voteOpt: TranslationSubmissionWithVotesViewModel, index: number) => {
                                return (
                                    <TranslationVoteItem
                                        key={voteOpt.guid}
                                        details={voteOpt}
                                        onClick={() => this.setTranslation(voteOpt.guid)}
                                        onDelete={() => this.deleteTranslation(voteOpt.guid)}
                                    />
                                );
                            })
                        }
                        <p className={classNames("pt1", { inVisible: showOwnSubmissionTextBox })}>
                            <span>Don't see an option you like and want to submit your own?&nbsp;</span>
                            <a href="!" onClick={(e: any) => this.toggleShowSubmissionTextBox(e)}>click here</a>
                        </p>
                    </div>
                    <div className={classNames("col-12", { inVisible: hasVoteOptions })}>
                        <p style={{ textAlign: 'center' }}>There are no submissions yet</p>
                    </div>
                    <div className={classNames("col-12", { inVisible: !showOwnSubmissionTextBox })}>
                        <p>
                            <span>Submit your own Translation</span>
                            {
                                hasVoteOptions &&
                                <>
                                    <strong>&nbsp;OR&nbsp;</strong>
                                    <a href="!" onClick={(e: any) => this.toggleShowSubmissionTextBox(e)}>Vote on existing translation</a>
                                </>
                            }
                        </p>
                        <Form>
                            <TextArea
                                placeholder={`Translation for: ${this.props.currentTranslation.original}`}
                                style={{ marginBottom: '1em' }}
                                value={this.state.translation}
                                onChange={textAreaFunc}
                            />
                        </Form>
                        {
                            this.state.voteOptions.map((voteOpt: TranslationSubmissionWithVotesViewModel, index: number) => {
                                return (
                                    <TranslationVoteItem
                                        key={voteOpt.guid + '-edit'}
                                        details={voteOpt}
                                        isCopyTextMode={true}
                                        onClick={() => this.setTranslationValue(voteOpt.text)}
                                        onDelete={() => { }}
                                    />
                                );
                            })
                        }
                        <ConditionalToolTip message='This will submit a translation for the currently visible item' showToolTip={true}>
                            <button className={classNames('button full mt1', { disabled: submitTranslationDisabled })}
                                onClick={this.submitTranslation}>Submit translation</button>
                        </ConditionalToolTip>
                    </div>
                </div>
            </>
        );
    }
};
