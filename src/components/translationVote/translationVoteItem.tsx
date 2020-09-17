import React from 'react'
import { Button, Icon, Label } from 'semantic-ui-react'

interface IProps {
    title: string;
    isSelected: boolean;
    numberOfVotes: number;
}

export const TranslationVoteItem: React.FC<IProps> = (props: IProps) => {
    return (
        <Button as='div' labelPosition='right'>
            <Button icon>{props.title}</Button>
            <Label basic pointing='left' color='green' >
                {
                    props.isSelected
                        ? <Icon name="check" />
                        : null
                }
                {props.numberOfVotes}
            </Label>
        </Button>
    )
}
