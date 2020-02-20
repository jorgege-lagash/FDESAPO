import { Moment } from 'moment';
import { eventDirectoryListSchema } from 'src/schemas/event-directory.schema';
import {
  EventDirectory,
  FormatedEvent,
} from 'src/types/response/EventDirectory';
import { checkState } from 'src/utils/event-directory.utils';
import {
  getDenormalizedEntities,
  getEntitiesByMallId,
  getEntityArray,
  getEntityById,
  getEntityIdsByMallId,
  getGlobalEntityIds,
  getTranslatedEntityById,
} from 'src/utils/selector.utils';

const dateFormat = 'YYYY-MM-DD';

export const entityName = 'events';

export const getEventDirectoryArray = getEntityArray<EventDirectory>(
  entityName
);

export const getGlobalEventDirectoryIds = getGlobalEntityIds(entityName);

export const getEventsByMallId = getEntitiesByMallId<EventDirectory>(
  entityName
);

export const getEventDirectoryIdsByMallId = getEntityIdsByMallId<
  EventDirectory
>(entityName);

export const getEventDirectoryById = getEntityById<EventDirectory>(entityName);

export const getDenormalizedEventDirectories = getDenormalizedEntities<
  EventDirectory
>(entityName, eventDirectoryListSchema);

export const getTranslatedEventDirectoryById = getTranslatedEntityById<
  EventDirectory
>(entityName);

export const getFormatedEvents = (
  events: EventDirectory[],
  today: Moment
): FormatedEvent[] => {
  const todayFormated = today.format(dateFormat);
  return events
    .filter((event) => event && event.id)
    .map((event) => {
      const formated = {} as FormatedEvent;
      formated.name = event.name;
      formated.description = event.description;
      formated.id = event.id;
      formated.displayStartDate = event.displayStartDate;
      formated.displayEndDate = event.displayEndDate;
      formated.state = checkState(
        todayFormated,
        event.displayStartDate,
        event.displayEndDate
      );
      return formated;
    });
};
