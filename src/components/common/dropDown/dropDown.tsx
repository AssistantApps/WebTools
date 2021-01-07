import React from 'react';
import { Dropdown } from 'semantic-ui-react'

import './dropDown.scss';

interface IProps {
    placeholder: string;
    multiple?: boolean;
    isLoading?: boolean;
    value?: Array<string>;
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
            value={props.value || ((props.multiple || false) ? [] : undefined)}
            multiple={props.multiple || false}
            loading={props.isLoading || false}
            options={props.options}
            onChange={handleChange}
        />
    );
}