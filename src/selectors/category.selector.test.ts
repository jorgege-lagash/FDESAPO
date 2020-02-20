import { ApplicationState } from 'src/reducers';
import { intitializeBaseResource } from 'src/utils';
import {
  getCategoriesByMallId,
  getCategoryArray,
  getCategoryById,
  getGlobalCategoryIds,
} from './category.selector';

const mockState: Partial<ApplicationState> = {
  entities: {
    categories: {
      1: {
        mallId: 1,
        poiTypeId: 2,
        name: 'blicker',
      },
      2: {
        mallId: 1,
        poiTypeId: 2,
        name: 'computadoras',
      },
      3: {
        mallId: 1,
        poiTypeId: 2,
        name: 'Creacion',
      },
      4: {
        mallId: 2,
        poiTypeId: 2,
        name: 'deportes',
      },
    },
  },
  categories: {
    ...intitializeBaseResource(),
    list: [1, 2],
    isLoading: false,
  },
};

test('getMallcategoriesArray returns an array of categories', () => {
  const result = getCategoryArray(mockState as ApplicationState);
  expect(result.length).toBe(2);
  expect(result[0]).toEqual(mockState.entities!.categories[1]);
});

test('getGlobalCategoryIds returns an array of ids', () => {
  const result = getGlobalCategoryIds(mockState as ApplicationState);
  expect(result.length).toBe(4);
  expect(result[0]).toBe('1');
});

test('getZonesByMallId', () => {
  let result = getCategoriesByMallId(mockState as ApplicationState, 1);
  expect(result.length).toBe(3);
  result = getCategoriesByMallId(mockState as ApplicationState, 2);
  expect(result.length).toBe(1);
});

test('getCategoryById returns a category object', () => {
  let result = getCategoryById(mockState as ApplicationState, '1');
  expect(result).toEqual({
    mallId: 1,
    poiTypeId: 2,
    name: 'blicker',
  });
  result = getCategoryById(mockState as ApplicationState, '4');
  expect(result).toEqual({
    mallId: 2,
    poiTypeId: 2,
    name: 'deportes',
  });
});
