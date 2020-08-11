import React from 'react';

import { TranslationItem } from '../../redux/entities/translation/translationItem';
import { AppDropDown } from '../../components/selectAppDropDown/appDropDown';

interface IProps {
    // Container Props
    history: any;
    translationItems: Array<TranslationItem>
    // editItemInCart?: (cartItemIndex: number, cartItem: CartItem) => void;
    // removeItemFromCart: (cartItemId: string) => void;
}

export const TranslationPresenter: React.FC<IProps> = (props: IProps) => {
    return (
        <div className="content">
            <div className="row full pt1">
                <AppDropDown onChange={(value: string) => {
                    console.warn(value);
                }} />
            </div>
        </div>
    );
};
