import { mount } from 'enzyme';
import * as React from 'react';
import CenteredContentLayout from './CenteredContentLayout';

let wrapped: any;

beforeEach(() => {
  wrapped = mount(<CenteredContentLayout />);
});

afterEach(() => {
  wrapped.unmount();
});

it('renders the Basic Layout without crashing', () => {
  expect(wrapped.find(CenteredContentLayout).length).toEqual(1);
});
