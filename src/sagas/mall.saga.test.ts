import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { actions } from '../actions/mall.action';
import * as Api from '../api';
import { fetchMalls } from './mall.saga';

describe('fetchMalls', () => {
  const generator = cloneableGenerator(fetchMalls)(actions.fetchMallList());

  test("call's api.fetchAll", () => {
    expect(generator.next().value).toEqual(call(Api.mall.fetchAll));
  });

  test('put fetchPermissionSuccess with correct payload.', () => {
    const clone = generator.clone();
    const malls = [
      {
        id: 1,
        name: 'Parque Otrauco',
        description: 'This is a mall',
        stringId: 'POC',
        buildingId: 2,
        created: '2018-11-09 11:39:47.888310229-06:00',
        modified: '2018-11-09 11:40:07.444643863-06:00',
      },
      {
        id: 2,
        name: 'Parque Arauco',
        description: 'This is a mall',
        stringId: 'PAC',
        buildingId: 1,
        created: '2018-11-09 11:39:47.888310229-06:00',
        modified: '2018-11-09 11:40:07.444643863-06:00',
      },
    ];
    expect(clone.next(malls).value).toEqual(
      put(
        actions.fetchMallListSuccess([1, 2], {
          malls: {
            1: malls[0],
            2: malls[1],
          },
        })
      )
    );
    expect(clone.next().done).toBe(true);
  });

  test('put fetchPermissionFailure with correct payload.', () => {
    const clone = generator.clone();
    const error = {
      statusCode: 404,
      message: 'ups!',
    };
    if (clone.throw) {
      expect(clone.throw(error).value).toEqual(
        put(actions.fetchMallListFailure(error))
      );
      expect(clone.next().done).toBe(true);
    }
  });
});
