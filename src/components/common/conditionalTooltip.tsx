import React from 'react';
import { Popup } from 'semantic-ui-react';

interface IProps {
    message: string;
    showToolTip: boolean;
    children: React.ReactNode
}

export const ConditionalToolTip: React.FC<IProps> = (props: IProps) => {
    if (!props.showToolTip) return <>{props.children}</>;
    return (
        <Popup wide
            content={props.message}
            trigger={props.children}
        />
    );
};
