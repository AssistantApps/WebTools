import { StateCommonReducer } from './StateCommonReducer';
import { StateSettingReducer } from './StateSettingReducer';
import { StateTranslationReducer } from './StateTranslationReducer';

export class State {
    public commonReducer!: StateCommonReducer;
    public settingReducer!: StateSettingReducer;
    public translationReducer!: StateTranslationReducer;
}

export default State;