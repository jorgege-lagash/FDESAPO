import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { actions } from '../actions/permission.action';
import * as Api from '../api';
import { fetchMallPermissions } from './permission.saga';

describe('login saga flow', () => {
  const userId = 1;
  const mallId = 2;
  const generator = cloneableGenerator(fetchMallPermissions)(
    actions.fetchMallPermissions(userId, mallId)
  );

  test("call's api.getUserPermissionsInMall", () => {
    expect(generator.next().value).toEqual(
      call(Api.getUserPermissionsInMall, userId, mallId)
    );
  });

  test('put fetchPermissionSuccess with correct payload.', () => {
    const testDate = '2018-10-23T23:30:35.343Z';
    const testMall = {
      id: 1,
      name: 'Parque Arauco',
      description: null,
      identificator: 'PAC',
      created: testDate,
      modified: testDate,
    };
    const basePermission = {
      id: 2,
      name: 'mall.create',
      created: testDate,
      modified: testDate,
      mall: testMall,
    };

    const mockapiResponse = [
      {
        ...basePermission,
        id: 1,
        name: 'mall.edit',
      },
      basePermission,
    ];

    const expectedEntities = {
      malls: {
        1: testMall,
      },
      permissions: {
        1: {
          ...basePermission,
          id: 1,
          name: 'mall.edit',
          mall: 1,
        },
        2: {
          ...basePermission,
          mall: 1,
        },
      },
    };
    expect(generator.next(mockapiResponse).value).toEqual(
      put(actions.fetchMallPermissionsSuccess(mallId, [1, 2], expectedEntities))
    );
  });
});
