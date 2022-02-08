import React from 'react';
import ReactTagInput from '@pathofdev/react-tag-input';

interface ITagsFormInputProps {
    existingTags: Array<string>;
    setTags: (newTags: Array<string>) => void;
}

export const TagsFormInput: React.FC<ITagsFormInputProps> = (props: ITagsFormInputProps) => {
    return (
        <ReactTagInput
            tags={props.existingTags}
            onChange={props.setTags}
        />
    );
}