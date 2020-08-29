import React from 'react';

import { SmallBanner } from '../../components/common/banner/banner';
import { DropDown } from '../../components/common/dropDown/dropDown';
import { Error } from '../../components/common/error';
import { Loading } from '../../components/common/loading';

import { NetworkState } from '../../constants/networkState';

import { AppViewModel } from '../../contracts/generated/ViewModel/appViewModel';

interface IProps {
    status: NetworkState;
    appDetails: Array<AppViewModel>;
}

export const TranslationPresenter: React.FC<IProps> = (props: IProps) => {
    if (props.status === NetworkState.Error) return <Error message="Something went wrong" />;
    if (props.status === NetworkState.Loading) return <Loading />;

    const appOptions = props.appDetails.map((item: AppViewModel) => {
        return {
            key: item.appType,
            text: item.gameName,
            value: item.appType,
            image: { src: item.iconUrl },
        };
    })

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
                        <DropDown
                            placeholder='Select Apps'
                            options={appOptions}
                            multiple={true}
                            onChange={(value: string) => {
                                console.warn(value);
                            }}
                        />
                    </div>
                    <div className="col-6">
                        <label>Please select a language</label>
                        <DropDown
                            placeholder='Select Language'
                            options={[]}
                            multiple={true}
                            onChange={(value: string) => {
                                console.warn(value);
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
