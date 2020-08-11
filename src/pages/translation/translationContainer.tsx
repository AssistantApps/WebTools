import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapDispatchToProps, mapStateToProps } from './translation.redux';
import { TranslationItem } from '../../redux/entities/translation/translationItem';
import { TranslationPresenter } from './translationPresenter';

interface IProps {
    location: any;
    match: any;
    history: any;
    translationItems: Array<TranslationItem>
    // editItemInCart?: (cartItemIndex: number, cartItem: CartItem) => void;
    // removeItemFromCart: (cartItemId: string) => void;
}

export class CartContainerUnconnected extends React.Component<IProps, any> {
    render() {
        return (
            <TranslationPresenter {...this.props} />
        );
    }
};

export const CartContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(CartContainerUnconnected));