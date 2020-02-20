import * as React from 'react';

import { mount } from 'enzyme';
import Root from 'src/Root';
import UpdateMallForm from './UpdateMallForm';

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
      <UpdateMallForm
        currentLang="es"
        defaultData={{
          id: 1,
          name: 'Parque Otrauco',
          description: 'This is a mall',
          stringId: 'POC',
          buildingId: 2,
          created: '2018-11-09 11:39:47.888310229-06:00',
          modified: '2018-11-09 11:40:07.444643863-06:00',
          timezone: 'America/Santiago',
        }}
        timeZones={timeZones}
        onSubmit={submit}
      />
    </Root>
  );

  expect(wrapper.find(UpdateMallForm).length).toEqual(1);
});
