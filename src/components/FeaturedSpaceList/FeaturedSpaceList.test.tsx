import React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import { FeaturedSpace } from 'src/types/response/FeaturedSpace';
import { FeaturedSpaceList } from './FeaturedSpaceList';

const data: FeaturedSpace[] = [
  {
    id: 1,
    name: 'Maipu',
    mallId: 1,
    active: true,
    created: '2018-11-06T23:13:23.772Z',
    modified: '2018-11-12T21:04:27.000Z',
  },
  {
    id: 2,
    name: 'Arauco br',
    mallId: 1,
    active: true,
    created: '2018-11-06T23:13:23.772Z',
    modified: '2018-11-12T21:04:27.000Z',
  },
];

test('renders without crashing', () => {
  const wrapper = mount(
    <Root>
      <FeaturedSpaceList data={data} total={data.length} />
    </Root>
  );
  const rows = wrapper.find('tbody tr');
  expect(rows.length).toBe(2);
});
