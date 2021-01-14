import React from 'react';
import { getImageUrlFromCountryCode } from '../../../helper/countryCodeHelper';

import './tooltipWithFlag.scss';

interface IProps {
    label: string;
    payload: Array<any>
}

export const TooltipWithFlag = (props: IProps | any) => {
    return (
        // <div className="tooltip">
        <div style={{ backgroundColor: '#E0E0E0', padding: '1em', borderRadius: '5px', textAlign: 'center' }}>
            {
                (props.payload && props.payload.length > 0 && props.payload[0].payload) &&
                <>
                    <p>{props.payload[0].payload.name}</p>
                    <ul>
                        <li>
                            <img src={getImageUrlFromCountryCode(props.payload[0].payload.countryCode)} alt={props.payload[0].payload.countryCode} width="100" />
                        </li>
                        <li className="pt-2">
                            <p><b>Complete:</b>&nbsp;{props.payload[0].payload.percentage} %</p>
                        </li>
                        <li>
                            <p><b>Num. translations:</b>&nbsp;{props.payload[0].payload.numTranslations}</p>
                        </li>
                    </ul>
                </>
            }
        </div>
    );
}