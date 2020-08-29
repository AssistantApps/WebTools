import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { NetworkState } from '../../constants/networkState';
import { AppViewModel } from '../../contracts/generated/ViewModel/appViewModel';
import { TranslationPresenter } from './translationPresenter';

import { mapDispatchToProps, mapStateToProps } from './translation.redux';

import { ApiService } from '../../services/ApiService';

interface IState {
    status: NetworkState;
    appDetails: Array<AppViewModel>;
}

interface IProps {
    location: any;
    match: any;
    history: any;
}

export class TranslationContainerUnconnected extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            status: NetworkState.Loading,
            appDetails: []
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        var appsResult = await (new ApiService()).getApps();
        if (!appsResult.isSuccess) {
            this.setState(() => {
                return {
                    status: NetworkState.Error
                }
            });
            return;
        }
        this.setState(() => {
            return {
                appDetails: appsResult.value,
                status: NetworkState.Success
            }
        });
    }

    render() {
        return (
            <TranslationPresenter {...this.state} />
        );
    }
};

export const TranslationContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(TranslationContainerUnconnected));