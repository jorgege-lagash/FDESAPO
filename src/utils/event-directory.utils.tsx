import { Tag } from 'antd';
import moment from 'moment';
import React from 'react';

export enum EventDirectoryState {
  scheduled = 'scheduled',
  published = 'published',
  expired = 'expired',
}

export const dateFormat = 'YYYY-MM-DD';
export const dateDisplayFormat = 'DD-MM-YYYY';
export const dateTimeDisplayFormat = 'DD-MM-YYYY HH:mm';

export const stateTags = {
  [EventDirectoryState.scheduled]: <Tag color="blue">Programado</Tag>,
  [EventDirectoryState.published]: <Tag color="green">Publicado</Tag>,
  [EventDirectoryState.expired]: <Tag>Expirado</Tag>,
};

export const checkState = (
  todayFormated: string,
  startDate?: string,
  endDate?: string
) => {
  if (
    moment(todayFormated).isSameOrAfter(startDate, 'day') &&
    moment(todayFormated).isSameOrBefore(endDate, 'day')
  ) {
    return EventDirectoryState.published;
  } else if (moment(todayFormated).isAfter(endDate, 'day')) {
    return EventDirectoryState.expired;
  } else if (moment(todayFormated).isBefore(startDate, 'day')) {
    return EventDirectoryState.scheduled;
  }
  return '';
};
