import React, { DOMAttributes } from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { App } from './appShell';
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
import 'react-18-image-lightbox/style.css';
import 'semantic-ui-css/semantic.min.css';
import "@pathofdev/react-tag-input/build/index.css";
import 'react-lazy-load-image-component/src/effects/blur.css';

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  interface Window { config: any; registration: any }
  namespace JSX {
    interface IntrinsicElements {
      ['assistant-apps-translation-leaderboard']: CustomElement<any>;
    }
  }
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

  const root = ReactDOM.createRoot(
    document.getElementById(reactAppId) as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <DependencyInjectionProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </DependencyInjectionProvider>
    </React.StrictMode>
  );

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

