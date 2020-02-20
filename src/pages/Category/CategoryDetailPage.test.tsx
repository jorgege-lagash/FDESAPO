import React from 'react';

import { mount } from 'enzyme';
import { RootHOC } from 'src/Root';
import { initialHistory } from 'src/store';
import CategoryDetailPage from './CategoryDetailPage';

it('renders without crashing', () => {
  initialHistory.push('/cms/mall/1/catogories/1/detail');
  const EnhancedComponent = RootHOC(CategoryDetailPage);
  const wrappedComponent = mount(<EnhancedComponent />);
  expect(wrappedComponent.find(CategoryDetailPage).length).toBe(1);
});
