import { mount } from 'enzyme';
import * as React from 'react';
import Exception403 from './403';

let wrapped: any;

beforeEach(() => {
  wrapped = mount(<Exception403 />);
});

afterEach(() => {
  wrapped.unmount();
});

it('renders the Exception403 Component without crashing', () => {
  expect(wrapped.find(Exception403).length).toEqual(1);
});
