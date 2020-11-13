import React from 'react';
import { Button, Icon, Label, List, Popup } from 'semantic-ui-react';
import { TranslationSubmissionWithVotesViewModel } from '../../contracts/generated/ViewModel/Translation/translationSubmissionWithVotesViewModel';
import './_translationVoteItem.scss';


interface IProps {
    details: TranslationSubmissionWithVotesViewModel;
    isCopyTextMode?: boolean;
    onClick: () => void;
    onDelete: () => void;
    onReport: (badTrans: TranslationSubmissionWithVotesViewModel) => void;
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

    var popupContent = 'Translator: ' + username;
    if (translationTextIsLarge) {
        popupContent = props.details.text + ' - Translated by: ' + props.details.username;
    }

    const renderIcon = (localProps: IProps) => {
        var options = [];
        var subOptions = [];

        if (localProps.details.belongsToUser) {
            subOptions.push(
                {
                    guid: `edit-${localProps.details.guid}`,
                    component: (
                        <Popup wide
                            content='This feature is disabled, This is to prevent people from changing the text of an approved translation to something incorrect or inappropriate which would keep the number of votes and therefore look as if it was chosen as the correct translation'
                            trigger={
                                <Label key={`edit-${localProps.details.guid}`}
                                    basic color="grey" className="notAllowed">
                                    <Icon name="edit" />
                                    <s><span>Edit</span></s>
                                </Label>
                            }
                        />
                    )
                }
            );
            subOptions.push(
                {
                    guid: `delete-${localProps.details.guid}`,
                    component: (
                        <Label key={`delete-${localProps.details.guid}`} onClick={localProps.onDelete}
                            basic color="red" className="pointer" >
                            <Icon name="trash" />
                            <span>Delete</span>
                        </Label>
                    )
                }
            );
        } else {
            subOptions.push(
                {
                    guid: `report-${localProps.details.guid}`,
                    component: (
                        <Label key={`report-${localProps.details.guid}`} onClick={() => localProps.onReport(localProps.details)}
                            basic color="red" className="pointer" >
                            <Icon name="announcement" />
                            <span>Report</span>
                        </Label>
                    )
                }
            );
        }

        const additionalCss = props.details.isCurentVote ? 'notAllowed' : '';
        const localOnClick = props.details.isCurentVote ? () => null : props.onClick;
        if (!localProps.isCopyTextMode) {
            options.push(
                <Label key={`vote-${localProps.details.guid}`} onClick={localOnClick} className={additionalCss}
                    basic pointing='left' color={localProps.details.isCurentVote ? 'green' : undefined} >
                    {
                        localProps.details.isCurentVote && <Icon name="check" />
                    }
                    <span>{localProps.details.votes} votes</span>
                </Label>
            );
        } else {
            options.push(
                <Label basic pointing='left' onClick={props.onClick}>
                    <Icon name="copy" />
                    <span>Copy</span>
                </Label>
            );
        }

        if (subOptions.length > 0) {
            // if (subOptions.length == 1) {
            //     options.push(subOptions[0].component);
            //     return options;
            // }
            options.push(
                <Popup wide on='click'
                    trigger={
                        <Label basic>
                            <Icon name="ellipsis vertical" className="m-0" />
                        </Label>
                    }>
                    <List>
                        {
                            subOptions.map((item: any) => {
                                return (
                                    <List.Item key={item.guid}>
                                        {item.component}
                                    </List.Item>
                                );
                            })
                        }
                    </List>
                </Popup>
            );
        }

        return options;
    }

    const additionalCss = props.details.isCurentVote ? 'notAllowed' : '';
    const localOnClick = props.details.isCurentVote ? () => null : props.onClick;
    return (
        <Button as='div' labelPosition='right' className="vote-opt">
            <Popup wide
                content={popupContent}
                trigger={
                    <Button icon onClick={localOnClick} className={additionalCss}>
                        {translationText}
                    </Button>
                }
            />
            {renderIcon(props)}
        </Button>
    )
}
