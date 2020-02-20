import { Moment } from 'moment';
import { ScheduleDTO, ScheduleType } from 'src/types/response/Schedule';
import {
  addMallHeader,
  CustomRequestOptions,
  HttpService,
} from '../utils/request';

const getMallSchedules = (
  mallId: number,
  startDate: Moment | undefined,
  endDate: Moment | undefined,
  type: ScheduleType
): Promise<ScheduleDTO[]> => {
  const options: CustomRequestOptions = {
    query: {
      type,
      startDate: startDate && startDate.toISOString(),
      endDate: endDate && endDate.toISOString(),
    },
  };
  const mallHeader = addMallHeader(mallId, { origin: '*' });
  return HttpService.get<ScheduleDTO[]>('schedules', options, mallHeader);
};

const createMallSchedules = (
  mallId: number,
  schedules: ScheduleDTO[]
): Promise<ScheduleDTO[]> => {
  const mallHeader = addMallHeader(mallId, { origin: '*' });
  return HttpService.post<ScheduleDTO[]>(
    'schedules',
    { schedules },
    {},
    mallHeader
  );
};

const updateMallSchedule = (
  mallId: number,
  scheduleId: number,
  data: ScheduleDTO
): Promise<ScheduleDTO> => {
  const mallHeader = addMallHeader(mallId, { origin: '*' });
  return HttpService.patch<ScheduleDTO>(
    `schedules/${scheduleId}`,
    data,
    {},
    mallHeader
  );
};

export const schedule = {
  fetch: getMallSchedules,
  create: createMallSchedules,
  update: updateMallSchedule,
};
