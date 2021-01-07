import React from 'react';
import classNames from 'classnames';
import { Pagination, PaginationProps, Icon } from 'semantic-ui-react';

import { SmallBanner } from '../../components/common/banner/banner';
import { DropDown } from '../../components/common/dropDown/dropDown';
import { Error } from '../../components/common/error';
import { Loading } from '../../components/common/loading';
import { ConditionalToolTip } from '../../components/common/conditionalTooltip';
import { MainTranslationPanel } from './translationComponents';

import { NetworkState } from '../../constants/networkState';

import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationVoteContainer } from '../../components/translationVote/translationVoteContainer';
import { DropDownWithIcon } from '../../contracts/dropdown/dropDownWithIcon';

import { TranslationLogInPresenter } from './translationLogInPresenter';

interface IProps {
    status: NetworkState;
    appStatus: NetworkState;
    appDropDowns: Array<DropDownWithIcon>;
    langStatus: NetworkState;
    langDropDowns: Array<DropDownWithIcon>;

    selectedApps: Array<string>;
    selectedLanguage: string;

    translationKeys: Array<TranslationKeyViewModel>;
    translationKeyIndex: number;
    translationKeyStatus: NetworkState;
    hasLoadedtranslationKeys: boolean;

    userGuid: string;

    setApps: (app: Array<string>) => void;
    setLanguage: (language: string) => void;
    setTranslationIndex: (newIndex: number) => void;
    fetchTranslationKeys: (ignoreLanguage?: boolean) => void;
}

export const TranslationPresenter: React.FC<IProps> = (props: IProps) => {
    if (props.status === NetworkState.Error) return <Error message="Something went wrong" />;
    if (props.status === NetworkState.Loading) return <Loading />;

    var isNotLoggedIn = props.userGuid == null || props.userGuid.length < 1;
    var translationButtonsDisabled = props.selectedApps == null || props.selectedApps.length < 1 ||
        props.selectedLanguage == null || props.selectedLanguage.length < 1 || isNotLoggedIn;
    var showPagination = props.translationKeys != null && props.translationKeys.length > 0
        && props.translationKeyStatus === NetworkState.Success;

    var currentTranslation = props.translationKeys[props.translationKeyIndex];

    var paginationComp = (<div></div>);
    if (showPagination) {
        paginationComp = (
            <div className="container" style={{ textAlign: 'center', overflowX: 'auto' }}>
                <Pagination
                    totalPages={props.translationKeys.length}
                    activePage={props.translationKeyIndex + 1}
                    boundaryRange={1}
                    siblingRange={2}
                    ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
                    firstItem={null}
                    lastItem={null}
                    // firstItem={{ content: <Icon name="angle double left" />, icon: true }}
                    // lastItem={{ content: <Icon name="angle double right" />, icon: true }}
                    prevItem={{ content: <Icon name="angle left" />, icon: true }}
                    nextItem={{ content: <Icon name="angle right" />, icon: true }}
                    onPageChange={(event: any, pageData: PaginationProps) => {
                        var newIndex: any = pageData.activePage;
                        props.setTranslationIndex(newIndex - 1);
                    }}
                />
            </div>
        );
    }

    if (isNotLoggedIn) {
        return (
            <>
                <SmallBanner
                    title="Translation"
                    descrip="Translation tool for the Assistant Apps"
                />

                <div className="container">
                    <div className="row full pt3 pb3">
                        <TranslationLogInPresenter />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <SmallBanner
                title="Translation"
                descrip="Translation tool for the Assistant Apps"
            />

            <div className="container">
                <div className="row full pt3 pb3">
                    <div className="col-12 col-md-6">
                        <label>Please select Apps you would like to translate for</label>
                        {
                            (props.appStatus !== NetworkState.Error)
                                ? <DropDown
                                    placeholder="Select Apps"
                                    options={props.appDropDowns}
                                    multiple={true}
                                    isLoading={props.appStatus === NetworkState.Loading}
                                    onChange={(apps: any) => props.setApps(apps)}
                                />
                                : <p>Error loading apps, please refresh the page or contact us</p>
                        }
                    </div>
                    <div className="col-12 col-md-6 custom-drop-down pt1 pt-md-0">
                        <label>Please select a language</label>
                        {
                            (props.langStatus !== NetworkState.Error)
                                ? <DropDown
                                    placeholder="Select Language"
                                    options={props.langDropDowns}
                                    isLoading={props.langStatus === NetworkState.Loading}
                                    onChange={props.setLanguage}
                                />
                                : <p>Error loading languages, please refresh the page or contact us</p>
                        }
                    </div>
                    <div className="col-12 p1">
                        <ConditionalToolTip
                            message="Must select at least one App and a Language"
                            showToolTip={translationButtonsDisabled}>
                            <button
                                className={classNames("button full", { disabled: translationButtonsDisabled })}
                                onClick={() => !translationButtonsDisabled && props.fetchTranslationKeys()}>
                                <span>Load all items</span>
                            </button>
                        </ConditionalToolTip>
                    </div>
                    <div className="col-12">
                        <ConditionalToolTip
                            message="Must select at least one App and a Language"
                            showToolTip={translationButtonsDisabled}>
                            <button
                                className={classNames("button full", { disabled: translationButtonsDisabled })}
                                onClick={() => !translationButtonsDisabled && props.fetchTranslationKeys(true)}>
                                <span>Load untranslated items</span>
                            </button>
                        </ConditionalToolTip>
                    </div>
                </div>
            </div>

            {paginationComp}

            <div className="container">
                <MainTranslationPanel
                    translationKeyStatus={props.translationKeyStatus}
                    currentTranslation={currentTranslation}
                    userGuid={props.userGuid}
                />
            </div>
            <div className="container pt1">
                {
                    props.translationKeyStatus === NetworkState.Success &&
                    <TranslationVoteContainer
                        languageGuid={props.selectedLanguage}
                        currentTranslation={currentTranslation}
                        userGuid={props.userGuid}
                    />
                }
            </div>
            <div className="container pt1" style={{ textAlign: 'center' }}>
                {
                    props.hasLoadedtranslationKeys && (props.translationKeys.length === 0) &&
                    <h2>No items to display</h2>
                }
            </div>

            <div className="pt3 pb3">
                {paginationComp}
            </div>
        </>
    );
};
