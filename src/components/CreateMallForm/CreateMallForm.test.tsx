import { mount } from 'enzyme';
import React from 'react';
import Root from 'src/Root';
import CreateMallForm from './CreateMallForm';

const timeZones = [
  'America/Santa_Isabel',
  'America/Santarem',
  'America/Santiago',
  'America/Santo_Domingo',
];

test('renders without crashing', () => {
  const submit = () => undefined;
  const wrapper = mount(
    <Root>
      <CreateMallForm
        currentLang="es"
        onSubmit={submit}
        timeZones={timeZones}
      />
    </Root>
  );

  expect(wrapper.find(CreateMallForm).length).toBe(1);
});
