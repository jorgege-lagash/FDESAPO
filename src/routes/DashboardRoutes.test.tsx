import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { RootHOC } from 'src/Root';
import CMSRoutes from './DashboardRoutes';
let wrapped: ShallowWrapper;
const EnhancedComponent = RootHOC(CMSRoutes);
beforeEach(() => {
  wrapped = shallow(<EnhancedComponent />);
});

afterEach(() => {
  wrapped.unmount();
});
it('renders without crashing', () => {
  expect(wrapped.find(CMSRoutes).length).toEqual(1);
});
