import React from 'react';
import { Popup } from 'semantic-ui-react';
import { ScreenshotFrame } from './screenshotFrame';
import { ScreenshotImage } from './screenshotImage';

import './screenshotSlider.scss';

interface IState {
    index: number;
    oldIndex: number;
    screenShots: Array<string>;
    indexIsNew: boolean;
}

interface IProps {
    secondsPerImage?: number
}

export class ScreenshotSlider extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            index: 0,
            oldIndex: 0,
            indexIsNew: false,
            screenShots: [
                'NMS0',
                'NMS1',
                'NMS2',
                'NMS3',
                'SMS0',
                'SMS1',
                'SMS2'
            ]
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.transitionImages();
            const secondsPerImage = this.props.secondsPerImage || 5;
            setInterval(() => this.transitionImages(), secondsPerImage * 1000);
        }, 1000);
    }

    transitionImages() {
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
                    oldIndex: index
                }));
            }, 2500);
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
                basic={true}
                flowing={true}
                // header={<h4>Screenshot from</h4>}
                // position="top center"
                content={<span>
                    <strong>Screenshot from&nbsp;</strong>
                    {this.getAppName(currentImage)}
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