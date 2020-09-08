import React from 'react';

import { SmallBanner } from '../../components/common/banner/banner';
import { DropDown } from '../../components/common/dropDown/dropDown';
import { Error } from '../../components/common/error';
import { Loading } from '../../components/common/loading';

import { NetworkState } from '../../constants/networkState';
import { getImageUrlFromCountryCode } from '../../helper/countryCodeHelper';

import { AppViewModel } from '../../contracts/generated/ViewModel/appViewModel';
import { LanguageViewModel } from '../../contracts/generated/ViewModel/languageViewModel';
import { Pagination } from 'semantic-ui-react';

interface IProps {
    status: NetworkState;
    appStatus: NetworkState;
    appDetails: Array<AppViewModel>;
    langStatus: NetworkState;
    langDetails: Array<LanguageViewModel>;
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
            value: item.languageCode,
            image: { src: getImageUrlFromCountryCode(item.countryCode) },
        };
    });

    return (
        <>
            <SmallBanner
                title="Translation"
                descrip="Translation tool for the Assistant Apps"
            />
            <div className="container">
                <div className="row full pt3">
                    <div className="col-6">
                        <label>Please select Apps you would like to translate for</label>
                        {
                            (props.appStatus !== NetworkState.Error)
                                ? <DropDown
                                    placeholder='Select Apps'
                                    options={appOptions}
                                    multiple={true}
                                    isLoading={props.appStatus === NetworkState.Loading}
                                    onChange={(value: string) => {
                                        console.warn(value);
                                    }}
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
                                    onChange={(value: string) => {
                                        console.warn(value);
                                    }}
                                />
                                : <p>Error loading languages, please refresh the page or contact us</p>
                        }
                    </div>
                </div>
            </div>

            <div className="container" style={{ textAlign: 'center', marginBottom: '2em' }}>
                <Pagination defaultActivePage={5} totalPages={10} activePage={1} />
            </div>
        </>
    );
};
