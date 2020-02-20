import { ConnectedRouter } from 'connected-react-router';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import { initialHistory } from './store';
import translationMessages from './translations';

const defaultState = {
  malls: {
    selectedMall: 1,
  },
  session: {
    isAuthenticated: false,
  },
  locale: {
    lang: 'es',
  },
  entities: {
    malls: {
      1: {
        name: 'Mall prueba 1',
        stringId: 'AB7',
        buildingId: 123,
        timezone: 'America/New_York',
        description: 'des',
        information: 'Des',
      },
    },
  },
};

// For testing purposes: Every instance of this Root Component creates a Provider tag and a Redux Store.
const Root = ({
  children,
  initialState = defaultState,
  defaultHistory = initialHistory,
}: any) => {
  return (
    // We pass in the reducers and an initialState
    <Provider store={createStore(reducers(defaultHistory), initialState)}>
      <IntlProvider
        locale={defaultState.locale.lang}
        defaultLocale={defaultState.locale.lang}
        messages={translationMessages[defaultState.locale.lang]}>
        <ConnectedRouter history={defaultHistory}>{children}</ConnectedRouter>
      </IntlProvider>
    </Provider>
  );
};

export const RootHOC = (
  Component: React.ComponentType,
  componentProps: any = {}
) => (props: any) => (
  <Root {...props}>
    <Component {...componentProps} />
  </Root>
);

export default Root;
