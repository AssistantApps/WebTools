import React from 'react';
import { getImageUrlFromCountryCode } from '../../../helper/countryCodeHelper';

export class FlagAxisTick extends React.PureComponent<any> {
    render() {
        const {
            x, y, payload,
        } = this.props;

        return (
            <image x={x - 25} y={y - 3} href={getImageUrlFromCountryCode(payload.value)} width="50" style={{ outline: '1px solid black' }} />
        );
    }
}

export class SteppedAxisTick extends React.PureComponent<any> {
    render() {
        const {
            x, y, payload,
        } = this.props;

        return (
            <text x={x} y={y + ((payload.index % 2) ? 30 : 15)} textAnchor="middle" fill="#666">{payload.value}</text>
        );
    }
}