import { mount } from 'enzyme';
import React from 'react';
import Root from 'src/Root';
import { Deal } from 'src/types/response/Deal';
import DealForm from './DealForm';

const defaultData: Deal = {
  id: 24,
  mallId: 1,
  startDate: '2018-05-06T18:18:48.000Z',
  poiId: 408,
  endDate: '2018-05-13T18:18:48.000Z',
  displayStartDate: '2019-05-05',
  displayEndDate: '2019-05-14',
  title: 'Test',
  description: 'Test description',
};

const submit = () => undefined;
test('renders without crashing', () => {
  const mallId = 1;
  const wrapper = mount(
    <Root>
      <DealForm
        defaultData={defaultData}
        onSubmit={submit}
        currentLang={'es'}
        mallId={mallId}
        timezone={'America/Santiago'}
      />
    </Root>
  );
  expect(wrapper.find(DealForm).length).toBe(1);
});
