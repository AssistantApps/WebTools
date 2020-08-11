import React from 'react';

import { TranslationItem } from '../../redux/entities/translation/translationItem';
import { SmallBanner } from '../../components/common/banner/banner';
import { AppDropDown } from '../../components/selectAppDropDown/appDropDown';

interface IProps {
    history: any;
    translationItems: Array<TranslationItem>
}

export const TranslationPresenter: React.FC<IProps> = (props: IProps) => {
    return (
        <>
            <SmallBanner
                title="Translation"
                descrip="Translation tool for the Assistant Apps"
            />
            <div className="container">
                <div className="row full pt3">
                    <div className="col-12">
                        <label>Please Select an App</label>
                        <AppDropDown onChange={(value: string) => {
                            console.warn(value);
                        }} />
                    </div>
                </div>
            </div>
        </>
    );
};
