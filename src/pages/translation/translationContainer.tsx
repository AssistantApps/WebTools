import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { NetworkState } from '../../constants/networkState';
import { AppViewModel } from '../../contracts/generated/ViewModel/appViewModel';
import { LanguageViewModel } from '../../contracts/generated/ViewModel/languageViewModel';
import { TranslationKeySearchDropdownViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeySearchDropdownViewModel';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationSearchViewModel } from '../../contracts/generated/ViewModel/Translation/translationSearchViewModel';
import { IDependencyInjection, withServices } from '../../integration/dependencyInjection';
import { appDetailsToAppDropDownMapper } from '../../mapper/appDetailsMapper';
import { languageDetailsToLanguageDropDownMapper } from '../../mapper/languageDetailsMapper';
import { AssistantAppsApiService } from '../../services/api/AssistantAppsApiService';
import { mapDispatchToProps, mapStateToProps } from './translation.redux';
import { TranslationPresenter } from './translationPresenter';

interface IWithDepInj {
    assistantAppsApiService: AssistantAppsApiService;
}
interface IWithoutDepInj {
    location: any;
    match: any;
    history: any;
    userGuid: string;
}

interface IProps extends IWithDepInj, IWithoutDepInj { }

interface IState {
    status: NetworkState;
    appStatus: NetworkState;
    appDetails: Array<AppViewModel>;
    langStatus: NetworkState;
    langDetails: Array<LanguageViewModel>;
    submissionStatus: NetworkState;

    selectedApps: Array<string>;
    selectedLanguage: string;

    translationKeys: Array<TranslationKeyViewModel>;
    translationKeyIndex: number;
    translationKeyStatus: NetworkState;
    translationKeyDropdown: Array<TranslationKeySearchDropdownViewModel>;
    translationKeyDropdownStatus: NetworkState;
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
            selectedApps: [],
            selectedLanguage: '',
            translationKeys: [],
            translationKeyIndex: 0,
            translationKeyStatus: NetworkState.Pending,
            translationKeyDropdown: [],
            translationKeyDropdownStatus: NetworkState.Success,
        };
    }

    componentDidMount() {
        this.fetchAppData();
        this.fetchLanguageData();
    }

    fetchAppData = async () => {
        var appsResult = await this.props.assistantAppsApiService.getApps();
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
        var langResult = await this.props.assistantAppsApiService.getLanguages();
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

    fetchTranslationKeys = async (onlyUntranslated: boolean = false) => {
        this.setState(() => {
            return {
                translationKeyStatus: NetworkState.Loading
            }
        });
        var searchObj: TranslationSearchViewModel = {
            appGuidList: this.state.selectedApps,
            languageGuid: this.state.selectedLanguage,
            showOnlyUntranslated: onlyUntranslated,
        }
        var transKeyResult = await this.props.assistantAppsApiService.getTranslationKeys(searchObj);
        if (!transKeyResult.isSuccess) {
            this.setState(() => {
                return {
                    translationKeyStatus: NetworkState.Error,
                }
            });
            return;
        }
        this.setState(() => {
            return {
                translationKeys: transKeyResult.value,
                translationKeyStatus: NetworkState.Success,
                translationKeyIndex: 0,
            }
        });
    }

    fetchTranslationKeySearchDropdowns = async (onlyUntranslated: boolean = false) => {
        this.setState(() => {
            return {
                translationKeyDropdownStatus: NetworkState.Loading
            }
        });
        var searchObj: TranslationSearchViewModel = {
            appGuidList: this.state.selectedApps,
            languageGuid: this.state.selectedLanguage,
            showOnlyUntranslated: onlyUntranslated,
        }
        var transKeySearchDropDownResult = await this.props.assistantAppsApiService.getTranslationKeysSearchDropdown(searchObj);
        if (!transKeySearchDropDownResult.isSuccess) {
            this.setState(() => {
                return {
                    translationKeyDropdownStatus: NetworkState.Error,
                }
            });
            return;
        }
        this.setState(() => {
            return {
                translationKeyDropdown: transKeySearchDropDownResult.value,
                translationKeyDropdownStatus: NetworkState.Success,
            }
        });
    }

    setApps = (apps: Array<string>) => this.setState(() => { return { selectedApps: apps } });
    setLanguage = (language: string) => this.setState(() => { return { selectedLanguage: language } });
    setTranslationIndex = (newIndex: number) => this.setState(() => {
        let actualPageNum: number = newIndex;
        if (newIndex < 0) actualPageNum = 0;
        if (newIndex > this.state.translationKeys.length) actualPageNum = (this.state.translationKeys.length - 1);
        return { translationKeyIndex: +actualPageNum }
    });

    render() {
        return (
            <TranslationPresenter {...this.state}
                appDropDowns={appDetailsToAppDropDownMapper(this.state.appDetails)}
                langDropDowns={languageDetailsToLanguageDropDownMapper(this.state.langDetails)}
                setApps={this.setApps}
                setLanguage={this.setLanguage}
                setTranslationIndex={this.setTranslationIndex}
                fetchTranslationKeys={(ignoreLanguage?: boolean) => {
                    this.fetchTranslationKeys(ignoreLanguage);
                    this.fetchTranslationKeySearchDropdowns();
                }}
                userGuid={this.props.userGuid}
            />
        );
    }
};

export const TranslationContainer = withServices<IWithoutDepInj, IWithDepInj>(
    connect(mapStateToProps, mapDispatchToProps)(withRouter(TranslationContainerUnconnected)),
    (services: IDependencyInjection) => ({
        assistantAppsApiService: services.assistantAppsApiService,
    })
);
