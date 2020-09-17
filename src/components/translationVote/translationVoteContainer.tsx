import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { NetworkState } from '../../constants/networkState';
import { AppViewModel } from '../../contracts/generated/ViewModel/appViewModel';
import { LanguageViewModel } from '../../contracts/generated/ViewModel/languageViewModel';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';

import { ApiService } from '../../services/ApiService';
import { TranslationSearchViewModel } from '../../contracts/generated/ViewModel/Translation/translationSearchViewModel';

interface IState {
    status: NetworkState;
    apiService: ApiService;
}

interface IProps {
    location: any;
    match: any;
    history: any;
}

export class TranslationVoteContainer extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            status: NetworkState.Success,
            apiService: new ApiService(),
        };
    }

    componentDidMount() {
        this.fetchAppData();
    }

    fetchAppData = async () => {
        var appsResult = await this.state.apiService.getApps();
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
            }
        });
    }

    render() {
        return (
            <h1>test</h1>
        );
    }
};
