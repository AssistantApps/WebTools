import classNames from 'classnames';
import React from 'react';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { NetworkState } from '../../constants/networkState';
import { TranslationKeyViewModel } from '../../contracts/generated/ViewModel/Translation/translationKeyViewModel';
import { ApiService } from '../../services/ApiService';
import Autosuggest, { InputProps } from 'react-autosuggest';

import './translationSearch.scss';
import Swal from 'sweetalert2';

interface IState {
    status: NetworkState;
    apiService: ApiService;
    isOpen: boolean,
    value: string,
    suggestions: Array<TranslationKeyViewModel>;
}

interface IProps {
    currentTranslation: TranslationKeyViewModel;
    translationKeys: Array<TranslationKeyViewModel>;
    setTranslationIndex: (newIndex: number) => void;
}

export class TranslationSearch extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            status: NetworkState.Success,
            apiService: new ApiService(),
            value: '',
            suggestions: [],
            isOpen: false,
        };
    }

    onChange = (event: React.FormEvent<any>, params: Autosuggest.ChangeEvent) => {
        this.setState({
            value: params.newValue
        });
    };

    getSuggestions = (value: string) => {
        const list = this.props.translationKeys.filter(tk => {
            return tk.key.includes(value) || tk.original.includes(value)
        });
        return (list || []).slice(0, 10);
    }

    getSuggestionValue = (value: TranslationKeyViewModel) => {
        return value.key;
    }

    onSuggestionsFetchRequested = ({ value }: any) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsSelected = (event: React.FormEvent<any>, params: Autosuggest.SuggestionSelectedEventData<TranslationKeyViewModel>) => {
        const guidToLookup = params?.suggestion?.guid;
        if (guidToLookup != null) {
            const index = this.props.translationKeys.findIndex(tk => tk.guid === guidToLookup)
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

        const renderSuggestion = (suggestion: TranslationKeyViewModel) => (
            <Popup wide
                content={`The word in bold is the Key of the translation and the text below it is the English translation`}
                trigger={<div className="suggestion-option">
                    <p className="suggestion-heading">{suggestion.key}</p>
                    <p className="suggestion-body text-truncate">{suggestion.original}</p>
                </div>}
            />

        );

        const { value, suggestions } = this.state;

        const inputProps: InputProps<TranslationKeyViewModel> = {
            placeholder: 'Enter the Key or English translation',
            value,
            onChange: this.onChange
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
                        }}><Icon name='search' /></Button>
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