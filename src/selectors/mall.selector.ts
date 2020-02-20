import { get } from 'lodash';
import { createSelector } from 'reselect';
import { TypedLooseObject } from 'src/types/LooseObject';
import { Schedule, ScheduleType } from 'src/types/response/Schedule';
import { getTranslatedEntityById } from 'src/utils/selector.utils';
import { ApplicationState } from '../reducers';
import { Mall } from '../types/Mall';

const entityName = 'malls';

export const getMallArray = (state: ApplicationState) => {
  const mallMap: { [id: string]: Mall } = state.entities.malls;
  const mallIds: number[] = state.malls.list || [];
  return mallIds.map((id) => mallMap[id]).filter((mall) => mall);
};

export const getMallById = (
  state: ApplicationState,
  mallId: number | string
): Mall => {
  const mallMap = get(state, 'entities.malls', undefined);
  if (mallMap) {
    return mallMap[mallId] as Mall;
  }
  return mallMap;
};
export const getSchedules = (state: ApplicationState) => {
  const scheduleMap = get(state, 'entities.schedules', {}) as TypedLooseObject<
    Schedule
  >;
  return Object.keys(scheduleMap)
    .reduce(
      (acc, scheduleId) => {
        const schedule = scheduleMap[scheduleId];
        acc.push(schedule);
        return acc;
      },
      [] as Schedule[]
    )
    .filter((s) => s);
};
export const getMallSchedules = createSelector(
  [getSchedules, (state: any, props: any, mallId: number) => mallId],
  (schedules: Schedule[], mallId: number) => {
    return schedules.filter(
      (schedule) => Number(schedule.mallId) === Number(mallId)
    );
  }
) as (state: ApplicationState, props: any, mallId: number) => Schedule[];

export const getMallSchedulesByType = createSelector(
  [
    getMallSchedules,
    (state: any, props: any, mallId: number, type: ScheduleType) => type,
  ],
  (schedules: Schedule[], type: ScheduleType) =>
    schedules.filter((schedule) => schedule.scheduleType === type)
) as (
  state: ApplicationState,
  props: any,
  mallId: number,
  type: ScheduleType
) => Schedule[];

export const getTranslatedMallById = getTranslatedEntityById<Mall>(entityName);
