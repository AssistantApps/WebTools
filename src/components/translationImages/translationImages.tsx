import React from 'react';
import Lightbox from 'react-image-lightbox';
import { Segment } from 'semantic-ui-react';
import { NetworkState } from '../../constants/networkState';
import { TranslationImageViewModel } from '../../contracts/generated/ViewModel/Translation/translationImageViewModel';
import { IDependencyInjection, withServices } from '../../integration/dependencyInjection';
import { AssistantAppsApiService } from '../../services/api/AssistantAppsApiService';
import { SmallLoading } from '../common/loading';

interface IWithDepInj {
    assistantAppsApiService: AssistantAppsApiService;
}
interface IWithoutDepInj {
    translationKeyGuid: string;
    userGuid: string;
}

interface IProps extends IWithDepInj, IWithoutDepInj { }

interface IState {
    status: NetworkState;
    images: Array<TranslationImageViewModel>;
    photoIndex: number,
    isOpen: boolean,
}

export class TranslationImagesUnconnected extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            status: NetworkState.Loading,
            images: [],
            photoIndex: 0,
            isOpen: false,
        };
    }

    componentDidMount() {
        this.fetchTranslationKeyImages();
    }

    componentDidUpdate(prevProps: IProps) {
        if (this.props.userGuid !== prevProps.userGuid ||
            this.props.translationKeyGuid !== prevProps.translationKeyGuid) {
            this.fetchTranslationKeyImages();
        }
    }

    fetchTranslationKeyImages = async () => {
        if (this.props.userGuid == null || this.props.userGuid.length < 1) {
            this.setState(() => {
                return {
                    images: [],
                    status: NetworkState.Success
                }
            });
            return;
        }

        var imagesResult = await this.props.assistantAppsApiService.getTranslationImages(this.props.translationKeyGuid);
        if (!imagesResult.isSuccess) {
            this.setState(() => {
                return {
                    status: NetworkState.Error
                }
            });
            return;
        }
        this.setState(() => {
            return {
                images: imagesResult.value,
                status: NetworkState.Success
            }
        });
    }
    render() {
        if (this.state.status === NetworkState.Loading) return <SmallLoading />
        if (this.props.userGuid == null || this.props.userGuid.length < 1) return (
            <Segment placeholder style={{ minHeight: 'unset' }}>
                <p style={{ textAlign: 'center' }}>Please log in to view images</p>
            </Segment>
        );

        const images = this.state.images.map((item: TranslationImageViewModel) => {
            return {
                guid: item.guid,
                imageUrl: `${window.config.assistantAppsTranslationCdnUrl}/${item.imagePath}`,
            }
        });

        if (images == null || images.length < 1) return (
            <Segment placeholder style={{ minHeight: 'unset' }}>
                <p style={{ textAlign: 'center' }}>No images</p>
            </Segment>
        );

        return (
            <div className="row" key={this.props.translationKeyGuid}>
                {
                    images.map((item: any, photoIndex: number) => {
                        return (
                            <div key={item.guid} className="col-4" style={{ textAlign: 'center' }}>
                                <img
                                    src={item.imageUrl}
                                    draggable="false"
                                    alt={item.guid}
                                    className="translation-preview pointer"
                                    onClick={() => {
                                        this.setState(() => {
                                            return {
                                                photoIndex,
                                                isOpen: true,
                                            }
                                        })
                                    }}
                                />
                            </div>
                        );
                    })
                }
                <div className="col-12 ta-center"><i>Click to enlarge <span role="img" aria-label="magnify">🔍</span></i></div>
                {
                    this.state.isOpen &&
                    <Lightbox
                        mainSrc={images[this.state.photoIndex].imageUrl}
                        nextSrc={images[(this.state.photoIndex + 1) % images.length].imageUrl}
                        prevSrc={images[(this.state.photoIndex + images.length - 1) % images.length].imageUrl}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (this.state.photoIndex + images.length - 1) % images.length,
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (this.state.photoIndex + 1) % images.length,
                            })
                        }
                    />
                }
            </div>
        );
    }
};

export const TranslationImages = withServices<IWithoutDepInj, IWithDepInj>(
    TranslationImagesUnconnected,
    (services: IDependencyInjection) => ({
        assistantAppsApiService: services.assistantAppsApiService,
    })
);