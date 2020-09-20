import React from 'react';
import { Placeholder, Segment } from 'semantic-ui-react';
import { TranslationImages } from '../../components/translationImages';
import { NetworkState } from '../../constants/networkState';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';

export const renderMainTranslationPanel = (translationKeyStatus: NetworkState, currentTranslation: TranslationKeyViewModel) => {
    if (translationKeyStatus === NetworkState.Loading) {
        return (
            <div className="row full">
                <div className="col-12 pb2">
                    <Placeholder style={{ margin: '0 auto' }}>
                        <Placeholder.Line />
                    </Placeholder>
                </div>
                <div className="col-12 col-md-6">
                    <Placeholder>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder>
                </div>
                <div className="col-12 col-md-6">
                    <Placeholder>
                        <Placeholder.Image />
                    </Placeholder>
                </div>
            </div>
        );
    }

    if (currentTranslation == null) {
        return (<div></div>);
    }

    return (
        <div className="row full pt2">
            <div className="col-12" style={{ textAlign: 'center' }}>
                <p className="pb1"><strong>Key: </strong>{currentTranslation.key}</p>
            </div>
            <div className="col-12 col-md-6">
                <Segment placeholder style={{ minHeight: 'unset' }}>
                    <p>{currentTranslation.original}</p>
                </Segment>
                <i style={{ display: 'block' }}>
                    <strong>Description: </strong>{currentTranslation.meta}
                </i>
            </div>
            <div className="col-12 col-md-6">
                <TranslationImages translationKeyGuid={currentTranslation.guid} />
            </div>
        </div>
    );
}

