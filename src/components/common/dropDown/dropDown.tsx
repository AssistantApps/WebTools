import React from 'react';
import { Dropdown } from 'semantic-ui-react'

interface IProps {
    placeholder: string;
    options: Array<any>;
    onChange: (key: string) => void
}

export const DropDown: React.FC<IProps> = (props: IProps) => {

    const handleChange = (e: any, data: any) => {
        const value: string = data.value;
        if (props.onChange != null) {
            props.onChange(value);
        }
    };

    return (
        <Dropdown
            placeholder={props.placeholder || 'Please Select'}
            fluid
            selection
            options={props.options}
            onChange={handleChange}
        />
    );
}