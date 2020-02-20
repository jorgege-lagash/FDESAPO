import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { RootHOC } from 'src/Root';
import CategoryRoutes from './CategoryRoutes';
let wrapped: ShallowWrapper;
const EnhancedComponent = RootHOC(CategoryRoutes);
beforeEach(() => {
  wrapped = shallow(<EnhancedComponent />);
});

afterEach(() => {
  wrapped.unmount();
});
it('renders without crashing', () => {
  expect(wrapped.find(CategoryRoutes).length).toEqual(1);
});
