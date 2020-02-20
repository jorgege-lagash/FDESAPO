import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { Category } from 'src/types/response/Category';
import { actions } from '../actions/category.action';
import * as Api from '../api';
import { fetchMallCategories } from './category.saga';

const categoryBase: Category = {
  id: 1,
  mallId: 1,
  urlLanding: '',
  icon: 'test',
  poiTypeId: 2,
  name: 'computadoras',
};

const categoriesBase: Category[] = [
  categoryBase,
  {
    ...categoryBase,
    id: 2,
  },
];

describe('fetchMallCategories', () => {
  const mallId = 1;
  const generator = cloneableGenerator(fetchMallCategories)(
    actions.fetchCategoryList(mallId)
  );

  test("call's category.fetch", () => {
    expect(generator.next().value).toEqual(call(Api.category.fetchAll, mallId));
  });

  test('put fetchSuccess category.', () => {
    const clone = generator.clone();
    expect(clone.next(categoriesBase).value).toEqual(
      put(
        actions.fetchCategoryListSuccess([1, 2], {
          categories: {
            1: categoriesBase[0],
            2: categoriesBase[1],
          },
        })
      )
    );
    expect(clone.next().done).toBe(true);
  });

  test('put fetch Failure.', () => {
    const clone = generator.clone();
    const error = {
      statusCode: 404,
      message: 'ups!',
    };
    if (clone.throw) {
      expect(clone.throw(error).value).toEqual(
        put(actions.fetchCategoryListFailure(error))
      );
      expect(clone.next().done).toBe(true);
    }
  });
});
