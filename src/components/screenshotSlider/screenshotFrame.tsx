import React from 'react';

interface IProps {
}

export const ScreenshotFrame = (props: IProps) => {
    return (
        <img
            src="/assets/img/screenshots/phone.png"
            className="screenshotSliderFrame"
            alt="screenshot frame"
        />
    );
};