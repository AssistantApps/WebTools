import React from 'react';
import { Popup } from 'semantic-ui-react';
import { ScreenshotFrame } from './screenshotFrame';
import { ScreenshotImage } from './screenshotImage';

import './screenshotSlider.scss';

interface IState {
    index: number;
    oldIndex: number;
    screenShots: Array<string>;
    appName: string;
    indexIsNew: boolean;
    animationIsPaused: boolean;
}

interface IProps {
    secondsPerImage?: number
}

export class ScreenshotSlider extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const screenShotList = [
            'NMS0',
            'NMS1',
            'NMS2',
            'NMS3',
            'SMS0',
            'SMS1',
            'SMS2'
        ];

        this.state = {
            index: 0,
            oldIndex: 0,
            indexIsNew: false,
            animationIsPaused: false,
            appName: this.getAppName(screenShotList[0]),
            screenShots: screenShotList,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.transitionImages();
            const secondsPerImage = this.props.secondsPerImage || 5;
            setInterval(() => this.transitionImages(), secondsPerImage * 1000);
        }, 2000);
    }

    transitionImages() {
        if (this.state.animationIsPaused) return;
        this.setState(({ index, screenShots }) => {
            return ({
                index: ((index + 1) >= screenShots.length) ? 0 : index + 1,
                indexIsNew: true,
            });
        });
        setTimeout(() => {
            this.setState(() => ({
                indexIsNew: false
            }));
            setTimeout(() => {
                this.setState(({ index }) => ({
                    oldIndex: index,
                    appName: this.getAppName(this.state.screenShots[index]),
                }));
            }, 500);
        }, 1000);
    }

    getAppName(currentImage: string): string {
        if (currentImage.includes('NMS')) {
            return 'Assistant for No Man\'s Sky';
        }
        if (currentImage.includes('SMS')) {
            return 'Assistant for Scrap Mechanic';
        }
        return 'Assistant for No Man\'s Sky';
    }

    render() {
        const currentImage = this.state.screenShots[this.state.index];
        return (
            <Popup
                // basic={true}
                flowing={true}
                // header={<h4>Screenshot from</h4>}
                // position="top center"

                offset="200, 0"
                content={<span>
                    <strong>Screenshot from&nbsp;</strong>
                    {this.state.appName}
                </span>
                }
                trigger={
                    <div className="screenshotSlider">
                        <ScreenshotImage imageName={this.state.screenShots[this.state.oldIndex]} />
                        <ScreenshotImage imageName={currentImage} className={this.state.indexIsNew ? 'transparent' : ''} />
                        <ScreenshotFrame />
                    </div>
                }
            />
        );
    }
};