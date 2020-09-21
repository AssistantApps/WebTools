import React from 'react'
import { Button, Icon, Label, Popup } from 'semantic-ui-react'
import { TranslationSubmissionWithVotesViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionWithVotesViewModel'

interface IProps {
    details: TranslationSubmissionWithVotesViewModel;
    isCopyTextMode?: boolean;
    onClick: () => void;
}

export const TranslationVoteItem: React.FC<IProps> = (props: IProps) => {
    const numMaxChars = 20;
    let translationTextIsLarge = false;

    var translationText = props.details.text;
    const numTextChars = props.details.text.length;
    if (numTextChars > numMaxChars) {
        translationText = props.details.text.substring(0, numMaxChars) + '...';
        translationTextIsLarge = true;
    }
    var username = props.details.username;
    const numUsernameChars = props.details.text.length;
    if (numUsernameChars > numMaxChars) {
        username = props.details.username.substring(0, numMaxChars) + '...';
    }

    var popupContent = username;
    if (translationTextIsLarge) {
        popupContent = props.details.text + ' - ' + props.details.username;
    }

    const renderIcon = () => {
        if (!props.isCopyTextMode) {
            return (
                <Label basic pointing='left' color={props.details.isCurentVote ? 'green' : undefined} >
                    {
                        props.details.isCurentVote
                            ? <Icon name="check" />
                            : null
                    }
                    <span>{props.details.votes} votes</span>
                </Label>
            );
        } else {
            return (
                <Label basic pointing='left'>
                    <Icon name="copy" />
                    <span>Copy</span>
                </Label>
            );
        }
    }

    return (
        <Popup wide
            content={popupContent}
            trigger={
                <Button as='div' labelPosition='right' onClick={props.onClick}>
                    <Button icon>{translationText}</Button>
                    {renderIcon()}
                </Button>
            }
        />
    )
}
