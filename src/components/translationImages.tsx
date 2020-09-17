import React from 'react';

import { NetworkState } from '../constants/networkState';
import { TranslationImageViewModel } from '../contracts/generated/ViewModel/translationImageViewModel';
import { SmallLoading } from './common/loading';

import { ApiService } from '../services/ApiService';

interface IState {
    status: NetworkState;
    apiService: ApiService;
    images: Array<TranslationImageViewModel>;
}

interface IProps {
    translationKeyGuid: string;
}

export class TranslationImages extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            status: NetworkState.Loading,
            apiService: new ApiService(),
            images: [],
        };
    }

    componentDidMount() {
        this.fetchTranslationKeyImages();
    }

    fetchTranslationKeyImages = async () => {
        var imagesResult = await this.state.apiService.getTranslationImages(this.props.translationKeyGuid);
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
        return (
            <div className="row" key={this.props.translationKeyGuid}>
                {
                    this.state.images.map((item: TranslationImageViewModel) => {
                        return (
                            <div key={item.guid} className="col-6" style={{ textAlign: 'center' }}>
                                <img
                                    src={item.imagePath}
                                    draggable="false"
                                    alt={item.guid}
                                    style={{ maxWidth: '100px' }}
                                />
                            </div>
                        );
                    })
                }
            </div>
        );
    }
};