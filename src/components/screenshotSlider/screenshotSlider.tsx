import React, { useEffect, useState } from 'react';
import { Popup } from 'semantic-ui-react';
import { ScreenshotFrame } from './screenshotFrame';
import { ScreenshotImage } from './screenshotImage';
import { wait } from '../../helper/timeoutHelper';
import { getAppNameFromImage } from '../../helper/nameHelper';

interface IProps {
    secondsPerImage?: number
}

export const ScreenshotSlider: React.FC<IProps> = (props: IProps) => {
    const screenShotList = [
        'NMS0',
        'NMS1',
        'NMS2',
        'NMS3',
        'SMS0',
        'SMS1',
        'SMS2'
    ];



    const [index, setIndex] = useState<number>(0);
    const [oldIndex, setOldIndex] = useState<number>(0);
    const [indexIsNew, setIndexIsNew] = useState<boolean>(false);
    // const [animationIsPaused, setAnimationIsPaused] = useState<boolean>(false);
    const [appName, setAppName] = useState(getAppNameFromImage(screenShotList[0]));

    useEffect(() => {
        let intervalId: any = 0;
        wait(2000).then(() => {
            transitionImages();
            const secondsPerImage = props.secondsPerImage || 5;
            intervalId = setInterval(() => transitionImages(), secondsPerImage * 1000);
        });
        return () => {
            clearInterval(intervalId);
        }
        // eslint-disable-next-line
    }, []);

    const transitionImages = async () => {
        // if (animationIsPaused) return;

        const newIndex = ((index + 1) >= screenShotList.length) ? 0 : index + 1;
        setIndex(newIndex);
        setIndexIsNew(true);

        await wait(1000);
        setIndexIsNew(false);

        await wait(500);
        setOldIndex(index);
        setAppName(getAppNameFromImage(screenShotList[index]));
    }

    const currentImage = screenShotList[index];
    return (
        <Popup
            // basic={true}
            flowing={true}
            // header={<h4>Screenshot from</h4>}
            // position="top center"

            offset="200, 0"
            content={<span>
                <strong>Screenshot from&nbsp;</strong>
                {appName}
            </span>
            }
            trigger={
                <div className="screenshotSlider">
                    <ScreenshotImage imageName={screenShotList[oldIndex]} />
                    <ScreenshotImage imageName={currentImage} className={indexIsNew ? 'transparent' : ''} />
                    <ScreenshotFrame />
                </div>
            }
        />
    );
};