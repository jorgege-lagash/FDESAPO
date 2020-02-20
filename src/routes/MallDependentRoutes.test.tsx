import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { RootHOC } from 'src/Root';
import MallDependentRoutes from './MallDependentRoutes';
let wrapped: ShallowWrapper;
const EnhancedComponent = RootHOC(MallDependentRoutes);
beforeEach(() => {
  wrapped = shallow(<EnhancedComponent />);
});

afterEach(() => {
  wrapped.unmount();
});
it('renders without crashing', () => {
  expect(wrapped.find(MallDependentRoutes).length).toEqual(1);
});
