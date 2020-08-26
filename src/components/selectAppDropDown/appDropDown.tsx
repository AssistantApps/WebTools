import React from 'react';
import { DropDown } from '../common/dropDown/dropDown'
import { publishedAppsDetails } from '../../constants/appDetails';
import { appDetailsConstantToDropDownMapper } from '../../mapper/appDetailsConstantToDropDownMapper';

interface IProps {
    onChange: (key: string) => void
}

export const AppDropDown: React.FC<IProps> = (props: IProps) => {
    var options = publishedAppsDetails.map(appDetailsConstantToDropDownMapper).filter(opt => opt);
    return (
        <DropDown
            placeholder='Select App'
            options={options}
            multiple={true}
            onChange={props.onChange}
        />
    );
}