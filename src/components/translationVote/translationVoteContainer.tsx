import classNames from 'classnames';
import React from 'react';
import { Form, Placeholder, TextArea, TextAreaProps } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { NetworkState } from '../../constants/networkState';
import * as storageType from '../../constants/storageType';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationSubmissionViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionViewModel';
import { TranslationSubmissionWithVotesViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionWithVotesViewModel';
import { TranslationVoteViewModel } from '../../contracts/generated/ViewModel/Translation/translationVoteViewModel';
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

    fetchVotes = async () => {
        if (this.props == null) return;
        if (this.props.currentTranslation == null) return;
        if (this.props.currentTranslation.key == null) return;

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
        this.setState(() => {
            return {
                status: NetworkState.Loading
            }
        });
        var userGuid = this.state.storageServ.get<string>(storageType.userGuid);
        if (userGuid == null || userGuid.isSuccess === false || userGuid.value == null) {
            Swal.fire({
                title: 'Login required',
                text: 'You are not logged in, you need to be logged in in order to submit translations or vote on translation. Please log in by clicking the icon in the top right.',
            })
            return;
        }
        var voteObj: TranslationVoteViewModel = {
            guid: userGuid.value,
            translationGuid: translationGuid || this.props.currentTranslation.guid,
            userGuid: userGuid.value,
        }
        var transKeyResult = await this.state.apiService.selectTranslationVote(voteObj);
        if (!transKeyResult.isSuccess) {
            this.setState(() => {
                return {
                    // voteOptions: [],
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

        return (
            <>
                <hr />
                <div className="row full pt1">
                    <div className="col-12">
                        <p>Submissions from previous Translators</p>
                        {
                            this.state.voteOptions.map((voteOpt: TranslationSubmissionWithVotesViewModel, index: number) => {
                                return (
                                    <TranslationVoteItem
                                        key={voteOpt.translationKeyGuid + '' + index}
                                        title={voteOpt.text}
                                        isSelected={voteOpt.isCurentVote}
                                        numberOfVotes={voteOpt.votes}
                                        onClick={() => this.setTranslation(voteOpt.translationKeyGuid)}
                                    />
                                );
                            })
                        }
                        <p className={classNames("pt1", { inVisible: this.state.showOwnSubmissionTextBox })}>Don't see an option and would like to submit your own? <a href="!" onClick={(e: any) => {
                            e.preventDefault();
                            this.setState(() => {
                                return {
                                    showOwnSubmissionTextBox: true
                                }
                            })
                        }}>click here</a></p>
                    </div>
                    <div className={classNames("col-12 pt1", { inVisible: !this.state.showOwnSubmissionTextBox })}>
                        <p>Submit your own Translation</p>
                        <Form>
                            <TextArea
                                placeholder={`Translation for: ${this.props.currentTranslation.original}`}
                                style={{ marginBottom: '1em' }}
                                value={this.state.translation}
                                onChange={textAreaFunc}
                            />
                        </Form>
                        <ConditionalToolTip message='This will submit a translation for the currently visible item' showToolTip={true}>
                            <button className={classNames('button full', { disabled: submitTranslationDisabled })}
                                onClick={this.submitTranslation}>Submit translation</button>
                        </ConditionalToolTip>
                    </div>
                </div>
            </>
        );
    }
};
