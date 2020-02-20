import { mount, shallow } from 'enzyme';
import * as React from 'react';
import App from 'src/App';
import Exception404 from 'src/pages/Exception/404';
import Root from 'src/Root';
import { initHistory } from 'src/store/history';
import PrivateRoute from './PrivateRoute';

const initialState = {
  session: {
    isAuthenticated: true,
  },
  locale: {
    lang: 'es',
  },
};

let wrapped: any;

beforeEach(() => {
  wrapped = shallow(
    <Root initialState={initialState}>
      <PrivateRoute
        path="/cms"
        component={App}
        isAuthenticated={initialState.session.isAuthenticated}
        lang={initialState.locale.lang}
      />
    </Root>
  );
});

afterEach(() => {
  wrapped.unmount();
});

describe('The PrivateRoute Component', () => {
  it('should receive the correct props', () => {
    expect(wrapped.find(PrivateRoute).props().path).toBe('/cms');
    expect(wrapped.find(PrivateRoute).props().component).toBe(App);
    expect(wrapped.find(PrivateRoute).props().isAuthenticated).toBeTruthy();
    expect(wrapped.find(PrivateRoute).props().lang).toBe('es');
  });

  it('renders the component if the user is authenticated', () => {
    const history = initHistory();
    history.push('/test');
    const wrapper = mount(
      <Root initialState={initialState} defaultHistory={history}>
        <PrivateRoute
          path="/test"
          component={Exception404}
          isAuthenticated={true}
          lang={initialState.locale.lang}
        />
      </Root>
    );
    expect(wrapper.find(Exception404).length).toBe(1);
  });

  it('doesnt render the component if the user is no authenticated', () => {
    const history = initHistory();
    history.push('/test');
    const wrapper = mount(
      <Root
        initialState={{ ...initialState, session: { isAuthenticated: false } }}
        defaultHistory={history}>
        <PrivateRoute
          path="/test"
          component={Exception404}
          isAuthenticated={true}
          lang={initialState.locale.lang}
        />
      </Root>
    );
    expect(wrapper.find(Exception404).length).toBe(0);
  });
});
