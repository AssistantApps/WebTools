import React from 'react';
import { getImageUrlFromCountryCode } from '../../../helper/countryCodeHelper';

interface IProps {
    label: string;
    payload: Array<any>
}

export const TooltipWithFlag = (props: IProps | any) => {
    return (
        <div style={{ backgroundColor: '#E0E0E0', padding: '1em', borderRadius: '5px', textAlign: 'center' }}>
            {
                (props.payload && props.payload.length > 0 && props.payload[0].payload) &&
                <>
                    <p style={{ marginBottom: '0.5em' }}>{props.payload[0].payload.name}</p>
                    <ul style={{ marginBottom: '0' }}>
                        <li style={{ paddingBottom: '0.5em' }}>
                            <img src={getImageUrlFromCountryCode(props.payload[0].payload.countryCode)} alt={props.payload[0].payload.countryCode} width="100" />
                        </li>
                        {
                            props.payload.map((item: any, index: number) => {
                                return (
                                    <li key={`${index}-${item.value}`}>
                                        <p>{item.name}: {item.value}</p>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </>
            }
        </div>
    );
}