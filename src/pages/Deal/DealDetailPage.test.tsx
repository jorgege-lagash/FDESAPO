import React from 'react';

import { mount } from 'enzyme';
import { RootHOC } from 'src/Root';
import { initialHistory } from 'src/store';
import DealDetailPage from './DealDetailPage';

it('renders without crashing', () => {
  initialHistory.push('/cms/mall/1/catogories/1/detail');
  const EnhancedComponent = RootHOC(DealDetailPage);
  const wrappedComponent = mount(<EnhancedComponent />);
  expect(wrappedComponent.find(DealDetailPage).length).toBe(1);
});
