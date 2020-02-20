import { Moment } from 'moment';
import moment from 'moment-timezone';
import { AuditAttributes } from '../AuditAttributes';

export type ScheduleType = 'default' | 'exception' | 'range';
export interface ScheduleTypeDTO extends AuditAttributes {
  name: ScheduleType;
}

export type ScheduleRecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';
export interface ScheduleRecurrenceTypeDTO extends AuditAttributes {
  name: ScheduleRecurrenceType;
}
export interface ScheduleDTO {
  id: number;
  mallId: number;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  // 'hh:mm'
  startTime: string;
  // 'hh:mm'
  endTime: string;
  isRecurring?: boolean;
  recurringType?: ScheduleRecurrenceType | ScheduleRecurrenceTypeDTO;
  dayOfWeek?: number;
  scheduleType?: ScheduleType | ScheduleTypeDTO;
}
const timeFormat = 'HH:mm';
export class Schedule {
  public id: number;
  public mallId: number;
  public title: string;
  public description: string;
  public isRecurring: boolean;
  public recurringType: ScheduleRecurrenceType;
  public dayOfWeek: number;
  public scheduleType: ScheduleType;
  public startDate: Moment;
  public endDate?: Moment;
  public startTime: Moment;
  public endTime: Moment;

  constructor(data: ScheduleDTO) {
    Object.assign(this, data);
    this.startDate = moment.tz(data.startDate, 'UTC');
    this.endDate = data.endDate ? moment.tz(data.endDate, 'UTC') : undefined;
    this.startTime = moment(data.startTime, timeFormat);
    this.endTime = moment(data.endTime, timeFormat);
    if (typeof data.scheduleType === 'object') {
      this.scheduleType = data.scheduleType.name;
    }
    if (typeof data.recurringType === 'object') {
      this.recurringType = data.recurringType.name;
    }
  }

  public toDTO = (): ScheduleDTO => {
    const {
      startDate,
      startTime,
      endDate,
      endTime,
      id,
      mallId,
      title,
      description,
      dayOfWeek,
      isRecurring,
      recurringType,
      scheduleType,
    } = this;
    return {
      id,
      mallId,
      title,
      description,
      dayOfWeek,
      isRecurring,
      recurringType,
      scheduleType,
      startDate: startDate.toISOString(),
      endDate: endDate ? endDate.toISOString() : endDate,
      startTime: startTime.format(timeFormat),
      endTime: endTime.format(timeFormat),
    };
  };
}
