import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import { Category } from 'src/types/response/Category';
import { CategoryList } from './CategoryList';

const categories: Category[] = [
  {
    id: 1,
    name: 'Maipu',
    poiTypeId: 1,
    icon: 'test',
    mallId: 1,
    urlLanding: '',
    created: '2018-11-06T23:13:23.772Z',
    modified: '2018-11-12T21:04:27.000Z',
  },
  {
    id: 2,
    name: 'Arauco br',
    icon: 'test',
    poiTypeId: 1,
    mallId: 1,
    urlLanding: '',
    created: '2018-11-06T23:13:23.772Z',
    modified: '2018-11-12T21:04:27.000Z',
  },
];

test('renders without crashing', () => {
  const wrapper = mount(
    <Root>
      <CategoryList categories={categories} />
    </Root>
  );
  const rows = wrapper.find('tbody tr');
  expect(rows.length).toBe(2);
});
