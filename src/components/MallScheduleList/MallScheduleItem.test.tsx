import { mount } from 'enzyme';
import React from 'react';
import Root from 'src/Root';
import { Schedule } from 'src/types/response/Schedule';
import MallScheduleItem from './MallScheduleItem';

const schedule: Schedule = new Schedule({
  id: 1,
  title: 'schedule',
  description: 'schedule',
  startDate: '2018-11-12 14:32:08',
  endDate: '2019-11-12 14:32:17',
  startTime: '9:00',
  endTime: '20:00',
  isRecurring: true,
  recurringType: 'weekly',
  dayOfWeek: 1,
  scheduleType: 'default',
  mallId: 1,
});
test('renders without crashing', () => {
  const handleUpdate = () => null;
  const wrapper = mount(
    <Root>
      <MallScheduleItem schedule={schedule} onUpdate={handleUpdate} />
    </Root>
  );

  expect(wrapper.find(MallScheduleItem).length).toBe(1);
});
