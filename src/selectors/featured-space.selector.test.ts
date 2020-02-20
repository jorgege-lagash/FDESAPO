import { ApplicationState } from 'src/reducers';
import { intitializeBaseResource } from 'src/utils';
import {
  getFeaturedSpaceArray,
  getFeaturedSpaceById,
  getFeaturedSpacesByMallId,
  getGlobalFeaturedSpaceIds,
} from './featured-space.selector';

const mockState: Partial<ApplicationState> = {
  entities: {
    featuredSpaces: {
      1: {
        mallId: 1,
        name: 'Space 1',
        active: true,
        created: '01-01-2019',
        modified: '02-01-2019',
      },
      2: {
        mallId: 2,
        name: 'Space 2',
        active: true,
        created: '03-01-2019',
        modified: '04-01-2019',
      },
    },
  },
  featuredSpaces: {
    ...intitializeBaseResource(),
    list: [1, 2],
    isLoading: false,
  },
};

test('getTagArray returns an array of categories', () => {
  const result = getFeaturedSpaceArray(mockState as ApplicationState);
  expect(result.length).toBe(2);
  expect(result[0]).toEqual(mockState.entities!.featuredSpaces[1]);
});

test('getGlobalCategoryIds returns an array of ids', () => {
  const result = getGlobalFeaturedSpaceIds(mockState as ApplicationState);
  expect(result.length).toBe(2);
  expect(result[0]).toBe('1');
});

test('getZonesByMallId', () => {
  let result = getFeaturedSpacesByMallId(mockState as ApplicationState, 1);
  expect(result.length).toBe(1);
  result = getFeaturedSpacesByMallId(mockState as ApplicationState, 2);
  expect(result.length).toBe(1);
});

test('getCategoryById returns a category object', () => {
  const result = getFeaturedSpaceById(mockState as ApplicationState, '1');
  expect(result).toEqual({
    mallId: 1,
    name: 'Space 1',
    active: true,
    created: '01-01-2019',
    modified: '02-01-2019',
  });
});
