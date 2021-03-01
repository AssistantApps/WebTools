import classNames from 'classnames';
import React from 'react';
import Swal from 'sweetalert2';
import { Button, Icon, Popup } from 'semantic-ui-react';
import Autosuggest, { InputProps } from 'react-autosuggest';

import { Error } from '../../components/common/error';
import { NetworkState } from '../../constants/networkState';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { TranslationKeySearchDropdownViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeySearchDropdownViewModel';

import './translationSearch.scss';

interface IProps {
    currentTranslation: TranslationKeyViewModel;
    translationKeys: Array<TranslationKeyViewModel>;
    translationKeyDropdown: Array<TranslationKeySearchDropdownViewModel>;
    translationKeyDropdownStatus: NetworkState;
    setTranslationIndex: (newIndex: number) => void;
}

interface IState {
    isOpen: boolean,
    value: string,
    suggestions: Array<TranslationKeySearchDropdownViewModel>;
    filteredDropdownList: Array<TranslationKeySearchDropdownViewModel>;
}

export class TranslationSearch extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const filtered = this.getFilteredDropdownList(props.translationKeys, props.translationKeyDropdown);
        this.state = {
            value: '',
            suggestions: [],
            filteredDropdownList: filtered,
            isOpen: false,
        };
    }

    getFilteredDropdownList = (translationKeys: Array<TranslationKeyViewModel>, translationKeyDropdown: Array<TranslationKeySearchDropdownViewModel>) => {
        const filtered = translationKeyDropdown
            .filter(tkd => translationKeys.findIndex(tk => tk.guid === tkd.guid) >= 0);
        return filtered;
    };

    componentDidUpdate(prevProps: IProps, prevState: IState) {
        const { translationKeys, translationKeyDropdown } = this.props;
        if (translationKeys.length !== prevProps.translationKeys.length ||
            translationKeyDropdown.length !== prevProps.translationKeyDropdown.length
        ) {
            const filtered = this.getFilteredDropdownList(translationKeys, translationKeyDropdown);
            if (filtered.length !== prevState.filteredDropdownList.length) {
                this.setState(() => {
                    return {
                        filteredDropdownList: filtered,
                    }
                })
            }
        }
    }

    onChange = (event: React.FormEvent<any>, params: Autosuggest.ChangeEvent) => {
        this.setState({
            value: params.newValue
        });
    };

    getSuggestions = (value: string) => {
        const lowerValue = value.toLowerCase();
        const list = this.state.filteredDropdownList.filter(tkd => {
            return tkd.key.toLowerCase().includes(lowerValue)
                || tkd.value.toLowerCase().includes(lowerValue)
                || tkd.translation?.toLowerCase().includes(lowerValue)
        });
        return (list || []).slice(0, 10);
    }

    getSuggestionValue = (value: TranslationKeySearchDropdownViewModel) => {
        return value.key;
    }

    onSuggestionsFetchRequested = ({ value }: any) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsSelected = (event: React.FormEvent<any>, params: Autosuggest.SuggestionSelectedEventData<TranslationKeySearchDropdownViewModel>) => {
        const guidToLookup = params?.suggestion?.guid;
        if (guidToLookup != null) {
            const index = this.props.translationKeys.findIndex(tkd => tkd.guid === guidToLookup)
            if (index >= 0) {
                this.props.setTranslationIndex(index);
            }
        }
        this.setState({
            value: ''
        });
        this.onSuggestionsClearRequested();
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {

        if (this.props.currentTranslation == null) {
            return (<div></div>);
        }

        if (this.props.translationKeyDropdownStatus === NetworkState.Error) {
            return (<Error message="Something went wrong" />);
        }

        const renderSuggestion = (suggestion: TranslationKeySearchDropdownViewModel) => (
            <div className="suggestion-option">
                <p className="suggestion-heading text-truncate">{suggestion.value}</p>
                {
                    suggestion.translation != null &&
                    <p className="suggestion-body text-truncate">
                        <i>
                            {suggestion.translation}<br />
                        </i>
                    </p>
                }
            </div>

        );

        const { value, suggestions } = this.state;

        const inputProps: InputProps<TranslationKeySearchDropdownViewModel> = {
            placeholder: 'Enter the Key or English translation',
            value,
            onChange: this.onChange,
        };

        return (
            <div className={classNames('container pb1 ta-center', { 'hide-search': !this.state.isOpen })}>
                <Autosuggest
                    id="search-list"
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    onSuggestionSelected={this.onSuggestionsSelected}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
                <Popup
                    content="Search for a specific translation"
                    trigger={(
                        <Button icon onClick={() => {
                            this.setState((prevState: IState) => {
                                return {
                                    isOpen: !prevState.isOpen
                                }
                            })
                        }}>
                            {
                                this.props.translationKeyDropdownStatus === NetworkState.Loading
                                    ? <Icon name='spinner' />
                                    : <Icon name='search' />
                            }
                        </Button>
                    )}
                />
                <Popup
                    content="Navigate to a specified page"
                    trigger={(
                        <Button icon onClick={() => {
                            Swal.fire({
                                title: 'Please enter the page number you wish to navigate to',
                                input: 'number',
                                inputAttributes: {
                                    autocapitalize: 'off'
                                },
                                showCancelButton: true,
                                confirmButtonText: 'Navigate',
                            }).then((result) => {
                                if (result.isConfirmed && !isNaN(result.value as number)) {
                                    console.log(result.value as number);
                                    this.props.setTranslationIndex((result.value as number) - 1);
                                }
                            });
                        }}><Icon name='fast forward' /></Button>
                    )}
                />
            </div>
        );
    }
};