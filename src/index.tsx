import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
// import { UpdateButton } from './components/updateButton';
// import { initLocalization } from './integration/i18n';
// import { initAnalytics } from './integration/analytics';
// import { updateServiceWorker } from './integration/serviceWorker';
import { DependencyInjectionProvider } from './integration/dependencyInjection';
import { getJSON, defaultConfig } from './utils';
import { applyIsDarkToBody } from './helper/bodyHelper';
import { modalSetup } from './components/common/modal/baseDialog';

import { loadStateFromLocalStorage, saveStateToLocalStorage } from './redux/stateFromLocalStorage';
import { reducer } from './redux';

import * as serviceWorker from './serviceWorker';

import './index.scss';
import 'react-image-lightbox/style.css';
import 'semantic-ui-css/semantic.min.css';
import "@pathofdev/react-tag-input/build/index.css";
import 'react-lazy-load-image-component/src/effects/blur.css';

declare global {
  interface Window { config: any; registration: any }
}

const reactAppId = 'assistantApp';

let persistedState: any = loadStateFromLocalStorage();
persistedState.settingReducer.menuIsVisible = false;
applyIsDarkToBody(persistedState.settingReducer.isDark);

const store = createStore(
  reducer,
  persistedState,
);

store.subscribe(() => saveStateToLocalStorage(store));

window.config = window.config || {};
getJSON('/assets/config.json', (status: boolean, response: string) => {
  window.config = (status === true)
    ? response || {}
    : defaultConfig;

  if (window.config.consoleLogDebug) console.log('Config', window.config);

  // initAnalytics();
  // initLocalization(store.getState()?.settingReducer?.selectedLanguage ?? 'en');
  modalSetup(reactAppId)

  ReactDOM.render(
    <React.StrictMode>
      <DependencyInjectionProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </DependencyInjectionProvider>
    </React.StrictMode>
    , document.getElementById(reactAppId));

  if (window.config.useServiceWorker) {
    serviceWorker.register({
      onUpdate: registration => {
        console.log('ServiceWorker Update')
        // toast.info(<UpdateButton onClick={() => updateServiceWorker(registration)} />, {
        //   autoClose: false,
        //   hideProgressBar: true,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        // });
      }
    });
  }
  else {
    serviceWorker.unregister();
  }
})

