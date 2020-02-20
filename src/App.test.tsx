import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import App from './App';
import { RootHOC } from './Root';
let wrapped: ShallowWrapper;
const EnhancedComponent = RootHOC(App);
beforeEach(() => {
  wrapped = shallow(<EnhancedComponent />);
});

afterEach(() => {
  wrapped.unmount();
});
it('renders without crashing', () => {
  expect(wrapped.find(App).length).toEqual(1);
});
