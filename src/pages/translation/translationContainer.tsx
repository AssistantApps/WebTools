import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { NetworkState } from '../../constants/networkState';
import { AppViewModel } from '../../contracts/generated/ViewModel/appViewModel';
import { LanguageViewModel } from '../../contracts/generated/ViewModel/languageViewModel';
import { TranslationPresenter } from './translationPresenter';

import { mapDispatchToProps, mapStateToProps } from './translation.redux';

import { ApiService } from '../../services/ApiService';

interface IState {
    status: NetworkState;
    appStatus: NetworkState;
    appDetails: Array<AppViewModel>;
    langStatus: NetworkState;
    langDetails: Array<LanguageViewModel>;
    apiService: ApiService;
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
            status: NetworkState.Success,
            appStatus: NetworkState.Loading,
            appDetails: [],
            langStatus: NetworkState.Loading,
            langDetails: [],
            apiService: new ApiService(),
        };
    }

    componentDidMount() {
        this.fetchAppData();
        this.fetchLanguageData();
    }

    fetchAppData = async () => {
        var appsResult = await this.state.apiService.getApps();
        if (!appsResult.isSuccess) {
            this.setState(() => {
                return {
                    appStatus: NetworkState.Error
                }
            });
            return;
        }
        this.setState(() => {
            return {
                appDetails: appsResult.value,
                appStatus: NetworkState.Success
            }
        });
    }

    fetchLanguageData = async () => {
        var langResult = await this.state.apiService.getLanguages();
        if (!langResult.isSuccess) {
            this.setState(() => {
                return {
                    langStatus: NetworkState.Error
                }
            });
            return;
        }
        this.setState(() => {
            return {
                langDetails: langResult.value,
                langStatus: NetworkState.Success
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