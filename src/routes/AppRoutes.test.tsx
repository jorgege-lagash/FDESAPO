import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { RootHOC } from 'src/Root';
import AppRoutes from './AppRoutes';
let wrapped: ShallowWrapper;
const EnhancedComponent = RootHOC(AppRoutes);
beforeEach(() => {
  wrapped = shallow(<EnhancedComponent />);
});

afterEach(() => {
  wrapped.unmount();
});
it('renders without crashing', () => {
  expect(wrapped.find(AppRoutes).length).toEqual(1);
});
