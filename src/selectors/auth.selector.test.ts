import { ApplicationState } from 'src/reducers';
import {
  getApplicationPermissions,
  getPermissionArray,
  hasRequiredPermissions,
} from './auth.selector';

const mockState: Partial<ApplicationState> = {
  entities: {
    malls: {
      '2': {
        deleted: false,
        deletedBy: null,
        deletedUserType: null,
        id: 2,
        name: 'DELETE_ME',
        stringId: 'aCD',
        buildingId: 1,
        created: '2018-11-06T23:13:23.772Z',
        modified: '2018-11-12T21:04:27.000Z',
      },
    },
    permissions: {
      '1': {
        id: 1,
        name: 'customer',
        created: '2018-10-23T23:30:35.237Z',
        modified: '2018-10-23T23:30:35.237Z',
        mall: 2,
      },
      '2': {
        id: 2,
        name: 'everything',
        created: '2018-10-23T23:30:35.343Z',
        modified: '2018-10-23T23:30:35.343Z',
        mall: 2,
      },
      '3': {
        id: 3,
        name: 'user.create',
        // tslint:disable-next-line:no-duplicate-string
        created: '2018-11-06T20:28:38.584Z',
        modified: '2018-11-06T20:28:38.584Z',
        mall: 2,
      },
      '4': {
        id: 4,
        name: 'mall.list',
        created: '2018-11-06T20:28:38.584Z',
        modified: '2018-11-06T20:28:38.584Z',
        mall: 2,
      },
      '5': {
        id: 5,
        name: 'mall.view',
        created: '2018-11-06T20:28:38.584Z',
        modified: '2018-11-06T20:28:38.584Z',
        mall: 2,
      },
      '6': {
        id: 6,
        name: 'mall.create',
        created: '2018-11-06T20:28:38.584Z',
        modified: '2018-11-06T20:28:38.584Z',
        mall: 2,
      },
      '7': {
        id: 7,
        name: 'mall.update',
        created: '2018-11-06T20:28:38.584Z',
        modified: '2018-11-06T20:28:38.584Z',
        mall: 2,
      },
    },
  },
  permissions: {
    saved: false,
    isLoading: false,
    list: [1, 2, 3, 4, 5, 6, 7],
    filtered: [],
    selected: [],
    total: 0,
    page: 0,
    perPage: 0,
    error: null,
    pages: {},
  },
};

test('getPermissionArray', () => {
  const result = getPermissionArray(mockState as ApplicationState);
  expect(result.length).toBe(7);
});

test('getApplicationPermissions', () => {
  const result = getApplicationPermissions(mockState as ApplicationState);
  expect(result.user.create).toBe(true);
  expect(result.mall.update).toBe(true);
  expect(result.everything).toBe(true);
});

test('getApplicationPermissions', () => {
  const result = hasRequiredPermissions(
    ['user.create'],
    getApplicationPermissions(mockState as ApplicationState)
  );
  expect(result).toBe(true);
});
