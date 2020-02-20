import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { TermsOfService } from 'src/types/response/TermsOfService';
import { actions } from '../actions/terms-of-service.action';
import * as Api from '../api';
import {
  createMallTermsOfService,
  fetchMallTermsOfServices,
  updateMallTermsOfService,
} from './terms.saga';

describe('fetchMallTermsOfServices', () => {
  const mallId = 1;
  const generator = cloneableGenerator(fetchMallTermsOfServices)(
    actions.fetchTermsOfServiceList(mallId)
  );

  test("call's termsOfService.fetch", () => {
    expect(generator.next().value).toEqual(
      call(Api.termsOfService.fetch, mallId)
    );
  });

  test('put fetchSuccess with correct payload.', () => {
    const clone = generator.clone();
    const termsOfServices: TermsOfService[] = [
      {
        id: 1,
        text: ' terminos 1',
        tag: 'tag',
        active: true,
        mallId: 2,

        created: '2018-11-09 11:39:47.888310229-06:00',
        modified: '2018-11-09 11:40:07.444643863-06:00',
      },
      {
        id: 2,
        text: ' terminos 2',
        tag: 'tag',
        active: true,
        mallId: 2,
        created: '2018-11-09 11:39:47.888310229-06:00',
        modified: '2018-11-09 11:40:07.444643863-06:00',
      },
    ];
    expect(clone.next(termsOfServices).value).toEqual(
      put(
        actions.fetchTermsOfServiceListSuccess([1, 2], {
          termsOfService: {
            1: termsOfServices[0],
            2: termsOfServices[1],
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
        put(actions.fetchTermsOfServiceListFailure(error))
      );
      expect(clone.next().done).toBe(true);
    }
  });
});

describe('createMallTermsOfService', () => {
  const mallId = 1;
  const termsOfService: TermsOfService = {
    id: 0,
    text: 'taste',
    mallId,
    active: true,
    tag: 'tag',
  };
  const generator = cloneableGenerator(createMallTermsOfService)(
    actions.createTermsOfService(mallId, termsOfService)
  );

  test("call's termsOfService.create", () => {
    expect(generator.next().value).toEqual(
      call(Api.termsOfService.create, mallId, termsOfService)
    );
  });

  test('put createSuccess with correct payload.', () => {
    const clone = generator.clone();

    expect(clone.next(termsOfService).value).toEqual(
      put(
        actions.createTermsOfServiceSuccess([0], {
          termsOfService: {
            0: termsOfService,
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
        put(actions.createTermsOfServiceFailure(error))
      );
      expect(clone.next().done).toBe(true);
    }
  });
});

describe('updateMallTermsOfService', () => {
  const mallId = 1;
  const termsOfServiceId = 1;
  const termsOfService: TermsOfService = {
    id: termsOfServiceId,
    text: 'taste',
    mallId,
    active: true,
    tag: 'tag',
  };
  const action = actions.updateTermsOfService(mallId, termsOfService);
  const generator = cloneableGenerator(updateMallTermsOfService)(action);

  test("call's termsOfService.update", () => {
    expect(generator.next().value).toEqual(
      call(Api.termsOfService.update, mallId, termsOfServiceId, termsOfService)
    );
  });

  test('put updateSuccess with correct payload.', () => {
    const clone = generator.clone();

    expect(clone.next(termsOfService).value).toEqual(
      put(
        actions.updateTermsOfServiceSuccess([termsOfServiceId], {
          termsOfService: {
            [termsOfServiceId]: termsOfService,
          },
        })
      )
    );
    expect(clone.next().done).toBe(true);
  });

  test('on update 404 error create termsOfService with correct payload.', () => {
    const clone = generator.clone();
    const error = {
      statusCode: 404,
      message: 'ups!',
    };
    if (clone.throw) {
      expect(clone.throw(error).value).toEqual(
        put(actions.createTermsOfService(mallId, termsOfService))
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
        put(actions.updateTermsOfServiceFailure(error))
      );
    }
  });
});
