import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { Zone } from 'src/types/response/Zone';
import { actions } from '../actions/zone.action';
import * as Api from '../api';
import {
  createMallZone,
  fetchMallZones,
  fetchZone,
  updateMallZone,
} from './zone.saga';

describe('fetchMallZones', () => {
  const mallId = 1;
  const generator = cloneableGenerator(fetchMallZones)(
    actions.fetchZoneList(mallId)
  );

  test("call's zone.fetch", () => {
    expect(generator.next().value).toEqual(call(Api.zone.fetch, mallId));
  });

  test('put fetchSuccess with correct payload.', () => {
    const clone = generator.clone();
    const zones = [
      {
        id: 1,
        name: 'Parque Otrauco',
        // tslint:disable-next-line:no-duplicate-string
        description: 'This is a zone',

        // tslint:disable-next-line:no-duplicate-string
        created: '2018-11-09 11:39:47.888310229-06:00',
        // tslint:disable-next-line:no-duplicate-string
        modified: '2018-11-09 11:40:07.444643863-06:00',
      },
      {
        id: 2,
        name: 'Parque Arauco',
        description: 'This is a zone',
        created: '2018-11-09 11:39:47.888310229-06:00',
        modified: '2018-11-09 11:40:07.444643863-06:00',
      },
    ];
    expect(clone.next(zones).value).toEqual(
      put(
        actions.fetchZoneListSuccess([1, 2], {
          zones: {
            1: zones[0],
            2: zones[1],
          },
        })
      )
    );
    expect(clone.next().done).toBe(true);
  });

  test('put fetchFailure with correct payload.', () => {
    const clone = generator.clone();
    const error = {
      statusCode: 404,
      message: 'ups!',
    };
    if (clone.throw) {
      expect(clone.throw(error).value).toEqual(
        put(actions.fetchZoneListFailure(error))
      );
      expect(clone.next().done).toBe(true);
    }
  });
});

describe('fetchMallZone by id', () => {
  const mallId = 1;
  const zoneId = 2;
  const generator = cloneableGenerator(fetchZone)(
    actions.fetchZone(mallId, zoneId)
  );

  test("call's zone.fetchById", () => {
    expect(generator.next().value).toEqual(
      call(Api.zone.fetchById, mallId, zoneId)
    );
  });

  test('put fetchSuccess with correct payload.', () => {
    const clone = generator.clone();
    const zones = {
      id: 1,
      name: 'Parque Otrauco',
      // tslint:disable-next-line:no-duplicate-string
      description: 'This is a zone',

      // tslint:disable-next-line:no-duplicate-string
      created: '2018-11-09 11:39:47.888310229-06:00',
      modified: '2018-11-09 11:40:07.444643863-06:00',
    };
    expect(clone.next(zones).value).toEqual(
      put(
        actions.fetchZoneSuccess([1], {
          zones: {
            1: zones,
          },
        })
      )
    );
    expect(clone.next().done).toBe(true);
  });

  test('put fetchFailure with correct payload.', () => {
    const clone = generator.clone();
    const error = {
      statusCode: 404,
      message: 'ups!',
    };
    if (clone.throw) {
      expect(clone.throw(error).value).toEqual(
        put(actions.fetchZoneFailure(error))
      );
      expect(clone.next().done).toBe(true);
    }
  });
});

describe('createMallZone', () => {
  const mallId = 1;
  const zone: Zone = {
    id: 0,
    name: 'taste',
    description: 'wow',
    mallId,
  };
  const generator = cloneableGenerator(createMallZone)(
    actions.createZone(mallId, zone)
  );

  test("call's zone.create", () => {
    expect(generator.next().value).toEqual(call(Api.zone.create, mallId, zone));
  });

  test('put createSuccess with correct payload.', () => {
    const clone = generator.clone();

    expect(clone.next(zone).value).toEqual(
      put(
        actions.createZoneSuccess([0], {
          zones: {
            0: zone,
          },
        })
      )
    );
    expect(clone.next().done).toBe(true);
  });

  test('put createFailure with correct payload.', () => {
    const clone = generator.clone();
    const error = {
      statusCode: 404,
      message: 'ups!',
    };
    if (clone.throw) {
      expect(clone.throw(error).value).toEqual(
        put(actions.createZoneFailure(error))
      );
      expect(clone.next().done).toBe(true);
    }
  });
});

describe('updateMallZone', () => {
  const mallId = 1;
  const zoneId = 1;
  const zone: Zone = {
    id: zoneId,
    name: 'taste',
    description: 'wow',
    mallId,
  };
  const action = actions.updateZone(mallId, zoneId, zone);
  const generator = cloneableGenerator(updateMallZone)(action);

  test("call's zone.update", () => {
    expect(generator.next().value).toEqual(
      call(Api.zone.update, mallId, zoneId, zone)
    );
  });

  test('put updateSuccess with correct payload.', () => {
    const clone = generator.clone();

    expect(clone.next(zone).value).toEqual(
      put(
        actions.updateZoneSuccess([zoneId], {
          zones: {
            [zoneId]: zone,
          },
        })
      )
    );
    expect(clone.next().done).toBe(true);
  });

  test('on update 404 error create zone with correct payload.', () => {
    const clone = generator.clone();
    const error = {
      statusCode: 404,
      message: 'ups!',
    };
    if (clone.throw) {
      expect(clone.throw(error).value).toEqual(
        put(actions.createZone(mallId, zone))
      );
      expect(clone.next().done).toBe(true);
    }
  });
  test('put updateFailure with correct payload.', () => {
    const clone = generator.clone();
    const error = {
      statusCode: 400,
      message: 'ups!',
    };
    if (clone.throw) {
      expect(clone.throw(error).value).toEqual(
        put(actions.updateZoneFailure(error))
      );
    }
  });
});
