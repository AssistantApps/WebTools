import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { NetworkState } from '../../constants/networkState';
import { AppViewModel } from '../../contracts/generated/ViewModel/appViewModel';
import { LanguageViewModel } from '../../contracts/generated/ViewModel/languageViewModel';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationPresenter } from './translationPresenter';

import { mapDispatchToProps, mapStateToProps } from './translation.redux';

import { ApiService } from '../../services/ApiService';
import { TranslationSearchViewModel } from '../../contracts/generated/ViewModel/Translation/translationSearchViewModel';

interface IState {
    status: NetworkState;
    appStatus: NetworkState;
    appDetails: Array<AppViewModel>;
    langStatus: NetworkState;
    langDetails: Array<LanguageViewModel>;
    submissionStatus: NetworkState;
    apiService: ApiService;

    selectedApps: Array<string>;
    selectedLanguage: string;

    translationKeys: Array<TranslationKeyViewModel>;
    translationKeyIndex: number;
    translationKeyStatus: NetworkState;
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
            submissionStatus: NetworkState.Success,
            apiService: new ApiService(),
            selectedApps: [],
            selectedLanguage: '',
            translationKeys: [],
            translationKeyIndex: 0,
            translationKeyStatus: NetworkState.Success,
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

    fetchTranslationKeys = async (ignoreLanguage: boolean = false) => {
        this.setState(() => {
            return {
                translationKeyStatus: NetworkState.Loading
            }
        });
        var searchObj: TranslationSearchViewModel = {
            appGuidList: this.state.selectedApps,
            languageGuid: ignoreLanguage ? null : this.state.selectedLanguage
        }
        var transKeyResult = await this.state.apiService.getTranslationKeys(searchObj);
        if (!transKeyResult.isSuccess) {
            this.setState(() => {
                return {
                    translationKeyStatus: NetworkState.Error
                }
            });
            return;
        }
        this.setState(() => {
            return {
                translationKeys: transKeyResult.value,
                translationKeyStatus: NetworkState.Success
            }
        });
    }

    setApps = (apps: Array<string>) => this.setState(() => { return { selectedApps: apps } });
    setLanguage = (language: string) => this.setState(() => { return { selectedLanguage: language } });

    render() {
        return (
            <TranslationPresenter {...this.state}
                setApps={this.setApps}
                setLanguage={this.setLanguage}
                fetchTranslationKeys={this.fetchTranslationKeys}
            />
        );
    }
};

export const TranslationContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(TranslationContainerUnconnected));