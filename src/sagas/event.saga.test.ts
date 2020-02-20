import { call, put } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { EventDirectory } from 'src/types/response/EventDirectory';
import { actions } from '../actions/event-directory.action';
import * as Api from '../api';
import { fetchMallEvents } from './event.saga';

const eventBase: EventDirectory = {
  id: 1,
  mallId: 1,
  startDate: '2019-05-16T13:02:00.000Z',
  endDate: '2019-05-26T01:21:00.000Z',
  displayEndDate: '2019-06-09',
  displayStartDate: '2019-05-06',
  name: 'Evento musical de jazz 2',
  description: 'Descripción de evento',
};

const eventsBase: EventDirectory[] = [
  eventBase,
  {
    ...eventBase,
    id: 2,
  },
];

describe('fetchMallCategories', () => {
  const mallId = 1;
  const generator = cloneableGenerator(fetchMallEvents)(
    actions.fetchEventDirectoryList(mallId)
  );

  test("call's .fetch", () => {
    expect(generator.next().value).toEqual(
      call(Api.eventDirectory.fetchAll, mallId)
    );
  });

  test('put fetchSuccess category.', () => {
    const clone = generator.clone();
    expect(clone.next(eventsBase).value).toEqual(
      put(
        actions.fetchEventDirectoryListSuccess([1, 2], {
          events: {
            1: eventsBase[0],
            2: eventsBase[1],
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
        put(actions.fetchEventDirectoryListFailure(error))
      );
      expect(clone.next().done).toBe(true);
    }
  });
});
