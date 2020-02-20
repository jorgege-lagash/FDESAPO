import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { RootHOC } from 'src/Root';
import FeaturedSpaceRoutes from './FeaturedSpaceRoutes';
let wrapped: ShallowWrapper;
const EnhancedComponent = RootHOC(FeaturedSpaceRoutes);
beforeEach(() => {
  wrapped = shallow(<EnhancedComponent />);
});

afterEach(() => {
  wrapped.unmount();
});
it('renders without crashing', () => {
  expect(wrapped.find(FeaturedSpaceRoutes).length).toEqual(1);
});
