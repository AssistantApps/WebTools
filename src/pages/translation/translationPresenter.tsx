import React from 'react';
import classNames from 'classnames';
import { Pagination, Segment, Placeholder, PaginationProps } from 'semantic-ui-react';

import { SmallBanner } from '../../components/common/banner/banner';
import { DropDown } from '../../components/common/dropDown/dropDown';
import { Error } from '../../components/common/error';
import { Loading } from '../../components/common/loading';
import { TranslationImages } from '../../components/translationImages';
import { ConditionalToolTip } from '../../components/common/conditionalTooltip';

import { NetworkState } from '../../constants/networkState';
import { getImageUrlFromCountryCode } from '../../helper/countryCodeHelper';

import { AppViewModel } from '../../contracts/generated/ViewModel/appViewModel';
import { LanguageViewModel } from '../../contracts/generated/ViewModel/languageViewModel';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';

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


    const langOptions = props.langDetails.map((item: LanguageViewModel) => {
        return {
            key: item.guid,
            text: item.name,
            value: item.guid,
            image: { src: getImageUrlFromCountryCode(item.countryCode) },
        };
    });

    var fullTranslationEnabled = props.selectedApps != null && props.selectedApps.length > 0;
    var untranslationEnabled = props.selectedApps != null && props.selectedApps.length > 0 &&
        props.selectedLanguage != null && props.selectedLanguage.length > 0;
    var showPagination = props.translationKeys != null && props.translationKeys.length > 0
        && props.translationKeyStatus === NetworkState.Success;

    var currentTranslation = props.translationKeys[props.translationKeyIndex];

    var paginationComp = (<div></div>);
    if (showPagination) {
        paginationComp = (
            <div className="container" style={{ textAlign: 'center' }}>
                <Pagination
                    totalPages={props.translationKeys.length}
                    activePage={props.translationKeyIndex + 1}
                    onPageChange={(event: any, pageData: PaginationProps) => {
                        var newIndex: any = pageData.activePage;
                        props.setTranslationIndex(newIndex - 1);
                    }}
                />
            </div>
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
                    <div className="col-6">
                        <label>Please select Apps you would like to translate for</label>
                        {
                            (props.appStatus !== NetworkState.Error)
                                ? <DropDown
                                    placeholder='Select Apps'
                                    options={appOptions}
                                    multiple={true}
                                    isLoading={props.appStatus === NetworkState.Loading}
                                    onChange={(apps: any) => props.setApps(apps)}
                                />
                                : <p>Error loading apps, please refresh the page or contact us</p>
                        }
                    </div>
                    <div className="col-6 custom-drop-down">
                        <label>Please select a language</label>
                        {
                            (props.appStatus !== NetworkState.Error)
                                ? <DropDown
                                    placeholder='Select Language'
                                    options={langOptions}
                                    isLoading={props.langStatus === NetworkState.Loading}
                                    onChange={props.setLanguage}
                                />
                                : <p>Error loading languages, please refresh the page or contact us</p>
                        }
                    </div>
                    <div className="col-12 p1">
                        <ConditionalToolTip message='Must select at least one App' showToolTip={!fullTranslationEnabled}>
                            <button className={classNames("button full", { disabled: !fullTranslationEnabled })}
                                onClick={() => props.fetchTranslationKeys(true)}>Load all items</button>
                        </ConditionalToolTip>
                    </div>
                    <div className="col-12">
                        <ConditionalToolTip message='Must select at least one App and a Language' showToolTip={!fullTranslationEnabled}>
                            <button className={classNames("button full", { disabled: !untranslationEnabled })}
                                onClick={() => props.fetchTranslationKeys()}>Load untranslated items</button>
                        </ConditionalToolTip>
                    </div>
                </div>
            </div>

            {paginationComp}

            {
                props.translationKeyStatus === NetworkState.Loading ?
                    <div className="container">
                        <div className="row full">
                            <div className="col-12 pb2">
                                <Placeholder style={{ margin: '0 auto' }}>
                                    <Placeholder.Line />
                                </Placeholder>
                            </div>
                            <div className="col-6">
                                <Placeholder>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder>
                            </div>
                            <div className="col-6">
                                <Placeholder>
                                    <Placeholder.Image />
                                </Placeholder>
                            </div>
                        </div>
                    </div>
                    : <div className="container">
                        {
                            currentTranslation == null
                                ? <div></div>
                                : <div className="row full pt2">
                                    <div className="col-12" style={{ textAlign: 'center' }}>
                                        <p className="pb1"><strong>Key: </strong>{currentTranslation.key}</p>
                                    </div>
                                    <div className="col-6">
                                        <Segment placeholder style={{ minHeight: 'unset' }}>
                                            <p>{currentTranslation.original}</p>
                                        </Segment>
                                        <i style={{ display: 'block' }}>
                                            <strong>Description: </strong>{currentTranslation.meta}
                                        </i>
                                    </div>
                                    <div className="col-6">
                                        <TranslationImages translationKeyGuid={currentTranslation.guid} />
                                    </div>
                                </div>
                        }
                    </div>
            }

            <div className="pt3 pb3">
                {paginationComp}
            </div>
        </>
    );
};
