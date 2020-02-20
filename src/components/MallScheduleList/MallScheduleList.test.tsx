import { mount } from 'enzyme';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { actions as scheduleActions } from 'src/actions/schedule.action';
import translationMessages from 'src/translations';
import { Schedule } from 'src/types/response/Schedule';
import MallScheduleItem from './MallScheduleItem';
import { MallScheduleList, Props } from './MallScheduleList';

const scheduleList: Schedule[] = [
  new Schedule({
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
  }),
];
const mockActions = {
  fetchScheduleList: scheduleActions.fetchScheduleList,
  updateSchedule: scheduleActions.updateSchedule,
};
const lang = 'es';
const WrappedComponent = ({ actions, mallId, schedules, type }: Props) => {
  return (
    <IntlProvider
      locale={lang}
      defaultLocale={lang}
      messages={translationMessages[lang]}>
      <MallScheduleList
        actions={actions}
        mallId={mallId}
        schedules={schedules}
        type={type}
      />
    </IntlProvider>
  );
};
it('renders without crashing', () => {
  const spy = jest.spyOn(mockActions, 'fetchScheduleList');
  const wrapper = mount(
    <WrappedComponent
      actions={mockActions}
      mallId={1}
      schedules={scheduleList}
      type="default"
    />
  );

  expect(wrapper.find(MallScheduleItem).length).toBe(1);
  expect(spy).toHaveBeenCalledTimes(1);
  wrapper.setProps({ mallId: 2 });
  expect(spy).toHaveBeenCalledTimes(2);
});
