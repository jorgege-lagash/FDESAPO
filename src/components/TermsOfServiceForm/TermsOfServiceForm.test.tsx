import { mount } from 'enzyme';
import React from 'react';
import Root from 'src/Root';
import { prepareToTestQuill } from 'src/utils/test.utils';
import { TermsOfServiceForm } from './TermsOfServiceForm';

beforeAll(() => {
  prepareToTestQuill();
});
test('renders without crashing', () => {
  const submit = () => undefined;
  const wrapper = mount(
    <Root>
      <TermsOfServiceForm onSave={submit} terms="" />
    </Root>
  );
  expect(wrapper.find(TermsOfServiceForm).length).toBe(1);
});
