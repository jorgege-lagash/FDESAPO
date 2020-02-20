import React from 'react';

import { mount } from 'enzyme';
import moment from 'moment';
import Root from 'src/Root';
import { getFormatedEvents } from 'src/selectors/event-directory.selector';
import { FormatedEvent } from 'src/types/response/EventDirectory';
import { EventDirectoryList } from './EventDirectoryList';
const events: FormatedEvent[] = getFormatedEvents(
  [
    {
      id: 1,
      name: 'Maipu',
      mallId: 1,
      startDate: '2018-11-06T23:13:23.772Z',
      endDate: '2018-11-12T21:04:27.000Z',
      description: 'Description',
    },
    {
      id: 2,
      name: 'Arauco br',
      mallId: 1,
      startDate: '2018-11-06T23:13:23.772Z',
      endDate: '2018-11-12T21:04:27.000Z',
      description: 'Description',
    },
  ],
  moment().startOf('day')
);

test('renders without crashing', () => {
  const wrapper = mount(
    <Root>
      <EventDirectoryList events={events} total={events.length} />
    </Root>
  );
  const rows = wrapper.find('tbody tr');
  expect(rows.length).toBe(2);
});
