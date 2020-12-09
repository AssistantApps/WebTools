import React from 'react';
import classNames from 'classnames';
import { Pagination, PaginationProps, Icon, Input, Segment, Button, Popup } from 'semantic-ui-react';

import { SmallBanner } from '../../components/common/banner/banner';
import { DropDown } from '../../components/common/dropDown/dropDown';
import { Error } from '../../components/common/error';
import { Loading } from '../../components/common/loading';
import { ConditionalToolTip } from '../../components/common/conditionalTooltip';
import { MainTranslationPanel } from './translationComponents';

import { NetworkState } from '../../constants/networkState';
import { getImageUrlFromCountryCode } from '../../helper/countryCodeHelper';

import { AppViewModel } from '../../contracts/generated/ViewModel/appViewModel';
import { LanguageViewModel } from '../../contracts/generated/ViewModel/languageViewModel';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationVoteContainer } from '../../components/translationVote/translationVoteContainer';
import { LoginDialog } from '../../components/dialog/loginDialog';

interface IProps {
    status: NetworkState;
    appStatus: NetworkState;
    appDetails: Array<AppViewModel>;
    langStatus: NetworkState;
    langDetails: Array<LanguageViewModel>;

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

    const appOptions = props.appDetails.map((item: AppViewModel) => {
        return {
            key: item.guid,
            text: item.gameName,
            value: item.guid,
            image: { src: item.iconUrl },
        };
    });


    const langOptions = props.langDetails
        .filter((item: LanguageViewModel) => item.languageCode !== 'en')
        .map((item: LanguageViewModel) => {
            return {
                key: item.guid,
                text: item.name,
                value: item.guid,
                image: { src: getImageUrlFromCountryCode(item.countryCode) },
            };
        });

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

    const showGetTranslationButtons = () => {
        if (isNotLoggedIn) {
            return (
                <div className="col-12 pt1">
                    <Segment placeholder style={{ minHeight: 'unset' }}>
                        <h2 style={{ textAlign: 'center', padding: '.25em' }}>
                            <span>Please log in</span>
                            <LoginDialog colour="black">
                                <Button style={{ marginTop: '.5em' }}>Click here to login</Button>
                            </LoginDialog>
                        </h2>
                        <p>
                            <h3 className="m0"><b>Why do I need to be logged in?</b></h3>
                            This is one step to prevent DoS (Denial of Service) attacks. The translations shown here are the work of amazing individuals who have put a lot of effort into these translations. It would not be fair for people to take that work without their permission. By requiring a login in order to view the translations, we can track and block accounts that are trying to get all of these translations.
                        </p>
                        <p>
                            <h3 className="m0"><b>What do you store from my Google login?</b></h3>
                            Your Email Address and Profile Image Url. We do not store Passwords, your Password is safe with Google we do not even interact with your Password. Google does an extremely good job of keeping that secret. This data is used to link translations to your AssistantApps account, so that giving credit for submitting translations as well as voting on existing translations can be automated. Please feel free contact me at <a href="mailto:support@assistantapps.com">support@assistantapps.com</a>&nbsp;if you have any concerns of how this data is stored.
                        </p>
                        <p>
                            <h3 className="m0"><b>How long do you store my data?</b></h3>
                            There is a process that runs every 24 hours that looks for and replaces the data of accounts that have not been logged into for over 36 months. This process replaces your email address with the AssistantApps support email and replaces your Profile Image Url with a default user image. This is done to preserve the links to other data in the database while removing your data from being visible and/or extracted if there is a data leak.
                        </p>
                    </Segment>
                </div>
            );
        }
        return (
            <>
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
                                    options={appOptions}
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
                                    options={langOptions}
                                    isLoading={props.langStatus === NetworkState.Loading}
                                    onChange={props.setLanguage}
                                />
                                : <p>Error loading languages, please refresh the page or contact us</p>
                        }
                    </div>
                    {showGetTranslationButtons()}
                </div>
            </div>


            {/* {
                showPagination &&
                <div className="container" style={{ textAlign: 'center', paddingBottom: '2em' }}>
                    <Input
                        type="number"
                        labelPosition="right"
                        value={props.translationKeyIndex + 1}
                        label={` of ${props.translationKeys.length} items`}
                        size="small"
                        onChange={(_, data) => {
                            const parsed = parseInt(data.value);
                            if (!isNaN(parsed)) {
                                props.setTranslationIndex(parsed - 1);
                            }
                        }}
                    />
                </div>
            } */}
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
