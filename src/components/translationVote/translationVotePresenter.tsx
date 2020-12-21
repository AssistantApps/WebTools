import classNames from 'classnames';
import React from 'react';
import { Form, Placeholder, Segment, TextArea, TextAreaProps } from 'semantic-ui-react';
import { NetworkState } from '../../constants/networkState';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationSubmissionWithVotesViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionWithVotesViewModel';
import { ConditionalToolTip } from '../common/conditionalTooltip';
import { TranslationVoteItem } from './translationVoteItem';

interface IProps {
    userGuid: string;
    currentTranslation: TranslationKeyViewModel;

    // Container function
    submitTranslation: () => void;
    setTranslation: (value: string) => void;
    deleteTranslation: (value: string) => void;
    setTranslationValue: (value: string) => void;
    toggleShowSubmissionTextBox: (event: any) => void;
    reportTranslation: (value: TranslationSubmissionWithVotesViewModel) => void;

    // Container services
    status: NetworkState;
    translation: string;
    showOwnSubmissionTextBox: boolean;
    voteOptions: Array<TranslationSubmissionWithVotesViewModel>;
}

export const TranslationVotePresenter: React.FC<IProps> = (props: IProps) => {
    const submitTranslationDisabled = props.translation == null || props.translation.length < 2;

    if (props.status === NetworkState.Loading) {
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

    if (props.currentTranslation == null) {
        return (<div></div>);
    }

    if (props.userGuid == null || props.userGuid.length < 1) return (
        <Segment placeholder style={{ minHeight: 'unset' }}>
            <p style={{ textAlign: 'center' }}>Please log in to vote</p>
        </Segment>
    );

    const hasVoteOptions = props.voteOptions != null && props.voteOptions.length > 0;
    const showOwnSubmissionTextBox = props.showOwnSubmissionTextBox || !hasVoteOptions;

    return (
        <>
            <hr />
            <div className="row full pt1">
                <div className={classNames('col-12', { inVisible: showOwnSubmissionTextBox })}>
                    <p>Submissions from previous Translators</p>
                    {
                        props.voteOptions.map((voteOpt: TranslationSubmissionWithVotesViewModel) => {
                            return (
                                <TranslationVoteItem
                                    key={voteOpt.guid}
                                    details={voteOpt}
                                    onClick={() => props.setTranslation(voteOpt.guid)}
                                    onEdit={(newValue: string) => props.setTranslationValue(newValue)}
                                    onDelete={() => props.deleteTranslation(voteOpt.guid)}
                                    onReport={props.reportTranslation}
                                />
                            );
                        })
                    }
                    <p className={classNames('pt1', { inVisible: showOwnSubmissionTextBox })}>
                        <span>Don't see an option you like and want to submit your own?&nbsp;</span>
                        <a href="!" onClick={(e: any) => props.toggleShowSubmissionTextBox(e)}>click here</a>
                    </p>
                </div>
                <div className={classNames('col-12', { inVisible: hasVoteOptions })}>
                    <p style={{ textAlign: 'center' }}>There are no submissions yet</p>
                </div>
                <div className={classNames('col-12', { inVisible: !showOwnSubmissionTextBox })}>
                    <p>
                        <span>Submit your own Translation</span>
                        {
                            hasVoteOptions &&
                            <>
                                <strong>&nbsp;OR&nbsp;</strong>
                                <a href="!" onClick={(e: any) => props.toggleShowSubmissionTextBox(e)}>Vote on existing translation</a>
                            </>
                        }
                    </p>
                    <Form>
                        <TextArea
                            placeholder={`Translation for: ${props.currentTranslation.original}`}
                            style={{ marginBottom: '1em' }}
                            value={props.translation}
                            onChange={(_: any, data: TextAreaProps) => {
                                props.setTranslationValue(data.value?.toString() || '');
                            }}
                        />
                    </Form>
                    {
                        props.voteOptions.map((voteOpt: TranslationSubmissionWithVotesViewModel) => {
                            return (
                                <TranslationVoteItem
                                    key={voteOpt.guid + '-edit'}
                                    details={voteOpt}
                                    isCopyTextMode={true}
                                    onClick={() => props.setTranslationValue(voteOpt.text)}
                                    onDelete={() => { }}
                                    onReport={props.reportTranslation}
                                />
                            );
                        })
                    }
                    <ConditionalToolTip message='This will submit a translation for the currently visible item' showToolTip={true}>
                        <button className={classNames('button full mt1', { disabled: submitTranslationDisabled })}
                            onClick={props.submitTranslation}>Submit translation</button>
                    </ConditionalToolTip>
                </div>
            </div>
        </>
    );
};
