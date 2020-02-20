import React from 'react';
import ReactDOM from 'react-dom';

import 'react-image-lightbox/style.css?raw';
import '../node_modules/antd/dist/antd.css?raw';
import '../node_modules/leaflet/dist/leaflet.css?raw';

import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';

import { Provider } from 'react-redux';

import { actions } from './actions/auth.action';
import App from './App';
import './App.css';
import './index.less';
import { unregister } from './registerServiceWorker';
import store, { initialHistory } from './store';

addLocaleData([...en, ...es]);
store.dispatch(actions.autoLogin());

ReactDOM.render(
  <Provider store={store}>
    <App initialHistory={initialHistory} />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
unregister();
