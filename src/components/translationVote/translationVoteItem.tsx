import React from 'react';
import { Button, Icon, Label, Popup } from 'semantic-ui-react';
import { TranslationSubmissionWithVotesViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionWithVotesViewModel';
import './_translationVoteItem.scss';


interface IProps {
    details: TranslationSubmissionWithVotesViewModel;
    isCopyTextMode?: boolean;
    onClick: () => void;
    onDelete: () => void;
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

    const renderIcon = (localProps: IProps) => {
        var options = [];
        if (!localProps.isCopyTextMode) {
            options.push(
                <Label key={`vote-${localProps.details.guid}`} onClick={localProps.onClick}
                    basic pointing='left' color={localProps.details.isCurentVote ? 'green' : undefined} >
                    {
                        localProps.details.isCurentVote && <Icon name="check" />
                    }
                    <span>{localProps.details.votes} votes</span>
                </Label>
            );
            if (localProps.details.belongsToUser) {
                options.push(
                    <Label key={`delete-${localProps.details.guid}`} onClick={localProps.onDelete}
                        basic pointing='left' color="red" >
                        <Icon name="trash" style={{ marginRight: 0 }} />
                    </Label>
                );
            }
            return options;
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
                <Button as='div' labelPosition='right' className="vote-opt">
                    <Button icon onClick={props.onClick}>{translationText}</Button>
                    {renderIcon(props)}
                </Button>
            }
        />
    )
}
