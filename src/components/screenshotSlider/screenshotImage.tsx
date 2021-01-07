import React from 'react';
import classNames from 'classnames';

interface IProps {
    imageName: string;
    className?: string;
}

export const ScreenshotImage = (props: IProps) => {
    const imageBaseUrl = "/assets/img/screenshots/{0}.png";
    const imageUrl = imageBaseUrl.replace('{0}', props.imageName);
    const imageAlt = 'Screenshot' + props.imageName;
    return (
        <img
            src={imageUrl}
            className={classNames('screenshotSliderFrame', props.className || '')}
            alt={imageAlt}
        />
    );
};