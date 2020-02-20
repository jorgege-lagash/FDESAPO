import React from 'react';

import { mount } from 'enzyme';
import { RootHOC } from 'src/Root';
import CreatePoiPage from './CreatePoiPage';

it('renders without crashing', () => {
  const EnhancedComponent = RootHOC(CreatePoiPage);
  const wrappedComponent = mount(<EnhancedComponent />);
  expect(wrappedComponent.find(CreatePoiPage).length).toBe(1);
});
