import { ApplicationState } from 'src/reducers';
import { getTermByMallId } from './terms.selector';

const mockState: Partial<ApplicationState> = {
  entities: {
    termsOfService: {
      1: {
        text: 'string',
        id: 1,
        mallId: 2,
        tag: 'tag',
        active: true,
      },
      2: {
        text: 'string',
        id: 2,
        mallId: 1,
        tag: 'tag',
        active: true,
      },
      3: {
        text: 'string',
        id: 3,
        mallId: 3,
        tag: 'tag',
        active: true,
      },
      4: {
        text: 'string',
        id: 4,
        mallId: 3,
        tag: 'tag',
        active: true,
      },
    },
  },
};

test('Filter terms by mallId', () => {
  let result = getTermByMallId(mockState as ApplicationState, '2');
  expect(result.length).toBe(1);
  result = getTermByMallId(mockState as ApplicationState, '3');
  expect(result.length).toBe(2);
});
