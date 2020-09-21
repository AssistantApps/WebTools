import React from 'react'
import { Button, Icon, Label, Popup } from 'semantic-ui-react'
import { TranslationSubmissionWithVotesViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionWithVotesViewModel'

interface IProps {
    details: TranslationSubmissionWithVotesViewModel;
    onClick: () => void;
}

export const TranslationVoteItem: React.FC<IProps> = (props: IProps) => {
    var translationText = props.details.text;
    const numTextChars = props.details.text.length;
    if (numTextChars > 20) {
        translationText = props.details.text.substring(0, 7) + '...';
    }
    var username = props.details.username;
    const numUesrnameChars = props.details.text.length;
    if (numUesrnameChars > 20) {
        username = props.details.username.substring(0, 7) + '...';
    }
    return (
        <Popup wide
            content={username}
            trigger={
                <Button as='div' labelPosition='right' onClick={props.onClick}>
                    <Button icon>{translationText}</Button>
                    <Label basic pointing='left' color={props.details.isCurentVote ? 'green' : undefined} >
                        {
                            props.details.isCurentVote
                                ? <Icon name="check" />
                                : null
                        }
                        {props.details.votes} votes
            </Label>
                </Button>
            }
        />
    )
}
