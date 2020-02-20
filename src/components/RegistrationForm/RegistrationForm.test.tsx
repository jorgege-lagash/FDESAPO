import * as React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import RegistrationForm from './RegistrationForm';

let wrapped: any;

beforeEach(() => {
  wrapped = mount(
    <Root>
      <RegistrationForm />
    </Root>
  );
});

afterEach(() => {
  wrapped.unmount();
});

it('renders without crashing', () => {
  expect(wrapped.find(RegistrationForm).length).toEqual(1);
});
