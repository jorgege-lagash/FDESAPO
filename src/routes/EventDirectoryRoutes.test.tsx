import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { RootHOC } from 'src/Root';
import EventDirectoryRoutes from './EventDirectoryRoutes';
let wrapped: ShallowWrapper;
const EnhancedComponent = RootHOC(EventDirectoryRoutes);
beforeEach(() => {
  wrapped = shallow(<EnhancedComponent />);
});

afterEach(() => {
  wrapped.unmount();
});
it('renders without crashing', () => {
  expect(wrapped.find(EventDirectoryRoutes).length).toEqual(1);
});
