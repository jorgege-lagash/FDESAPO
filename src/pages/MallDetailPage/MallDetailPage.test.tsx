import React from 'react';

import { mount } from 'enzyme';
import { RootHOC } from 'src/Root';
import { initialHistory } from 'src/store';
import MallDetailPag from './MallDetailPage';

it('renders without crashing', () => {
  initialHistory.push('/cms/mall/1/catogories/1/detail');
  const EnhancedComponent = RootHOC(MallDetailPag);
  const wrappedComponent = mount(<EnhancedComponent />);
  expect(wrappedComponent.find(MallDetailPag).length).toBe(1);
});
