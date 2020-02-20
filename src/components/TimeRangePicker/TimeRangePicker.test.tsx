import * as React from 'react';

import { TimePicker } from 'antd';
import { mount } from 'enzyme';
import moment, { Moment } from 'moment';
import { TimeRangePicker } from './TimeRangePicker';

let wrapped: any;

beforeEach(() => {
  wrapped = mount<TimeRangePicker>(<TimeRangePicker />);
});

afterEach(() => {
  wrapped.unmount();
});

it('renders without crashing', () => {
  expect(wrapped.find(TimeRangePicker).length).toEqual(1);
  expect(wrapped.find(TimePicker).length).toEqual(2);
});

it('renders with correct default values', () => {
  const startTime = '07:25';
  const endtime = '17:24';
  const wrappedComponent = mount<TimeRangePicker>(
    <TimeRangePicker
      defaultStartValue={moment(startTime, 'HH:mm')}
      defaultEndValue={moment(endtime, 'HH:mm')}
    />
  );
  expect(wrappedComponent.find('input').get(0).props.value).toBe(
    `${startTime}:00`
  );
  expect(wrappedComponent.find('input').get(1).props.value).toBe(
    `${endtime}:00`
  );
});

it('updates with correct default values', () => {
  const startTime = '07:25';
  const endtime = '17:24';
  const wrappedComponent = mount<TimeRangePicker>(<TimeRangePicker />);
  wrappedComponent.setProps({
    defaultStartValue: moment(startTime, 'HH:mm'),
    defaultEndValue: moment(endtime, 'HH:mm'),
  });
  const state = wrappedComponent.state();
  expect(state.startValue).toBeTruthy();
  expect((state.startValue as Moment).format('HH:mm')).toEqual(startTime);
  expect(state.endValue).toBeTruthy();
  expect((state.endValue as Moment).format('HH:mm')).toEqual(endtime);
});

it('generates correct values', () => {
  const startTime = '07:25:00';
  const endtime = '17:24:00';
  const wrappedComponent = mount<TimeRangePicker>(<TimeRangePicker />);
  wrappedComponent
    .find('input')
    .at(0)
    .simulate('click');
  wrappedComponent.update();

  wrappedComponent
    .find('input')
    .at(0)
    .simulate('change', { target: { value: startTime } });
  wrappedComponent.update();

  wrappedComponent
    .find('input')
    .at(0)
    .simulate('blur');
  wrappedComponent.update();

  wrappedComponent
    .find('input')
    .at(1)
    .simulate('click');
  wrappedComponent.update();
  wrappedComponent
    .find('input')
    .at(1)
    .simulate('change', { target: { value: endtime } });
  wrappedComponent.update();

  wrappedComponent
    .find('input')
    .at(1)
    .simulate('blur');
  wrappedComponent.update();
  const state = wrappedComponent.state();
  expect(state.startValue).toBeTruthy();
});
