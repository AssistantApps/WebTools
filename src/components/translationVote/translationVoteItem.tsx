import React from 'react'
import { Button, Icon, Label } from 'semantic-ui-react'

interface IProps {
    title: string;
    isSelected: boolean;
    numberOfVotes: number;
    onClick: () => void;
}

export const TranslationVoteItem: React.FC<IProps> = (props: IProps) => {
    return (
        <Button as='div' labelPosition='right' onClick={props.onClick}>
            <Button icon>{props.title}</Button>
            <Label basic pointing='left' color={props.isSelected ? 'green' : undefined} >
                {
                    props.isSelected
                        ? <Icon name="check" />
                        : null
                }
                {props.numberOfVotes} votes
            </Label>
        </Button>
    )
}
