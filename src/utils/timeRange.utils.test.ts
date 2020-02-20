import moment from 'moment';
import {
  disabledEndHours,
  disabledEndMinutes,
  disabledEndNumbersFor,
  disabledEndSeconds,
  disabledStartHours,
  disabledStartMinutes,
  disabledStartNumbersFor,
  disabledStartSeconds,
  getDisabledEndNumbers,
  getDisabledStartNumbers,
} from './timeRange.utils';

const maxHour = 23;
const maxMinute = 59;
const maxSecond = 59;

describe('getDisabledStartNumbers', () => {
  const maxValueInRange = 80;
  const currentMinValue = 64;
  const result = getDisabledStartNumbers(maxValueInRange, currentMinValue);
  it('generates the correct amount of values', () => {
    expect(result.length).toBe(maxValueInRange - currentMinValue);
  });
  it('it doesnt contain minValue', () => {
    expect(result[result.length - 1]).toBe(currentMinValue + 1);
  });
});

describe('getDisabledEndNumbers', () => {
  const currentMaxValue = 64;
  const result = getDisabledEndNumbers(currentMaxValue);
  it('generates the correct amount of values', () => {
    expect(result.length).toBe(currentMaxValue);

    expect(result[0]).toBe(0);
  });
  it('it doesnt contain minValue', () => {
    expect(result[result.length - 1]).toBe(currentMaxValue - 1);
  });
});

describe('disabledEndNumbersFor', () => {
  const currentMaxValue = 64;
  it('has length 0 when true is passed as first parameter', () => {
    const result = disabledEndNumbersFor(true, currentMaxValue);

    expect(result.length).toBe(0);
  });
  it('length equals to currentMaxValue', () => {
    const result = disabledEndNumbersFor(false, currentMaxValue);

    expect(result.length).toBe(currentMaxValue);
  });
});

describe('disabledStartNumbersFor', () => {
  const maxValueInRange = 30;
  const currentMaxValue = 12;
  it('has length 0 when true is passed as first parameter', () => {
    const result = disabledStartNumbersFor(
      true,
      maxValueInRange,
      currentMaxValue
    );

    expect(result.length).toBe(0);
  });
  it('has length equal to maxValueInRange - currentMaxValue', () => {
    const result = disabledStartNumbersFor(
      false,
      maxValueInRange,
      currentMaxValue
    );

    expect(result.length).toBe(maxValueInRange - currentMaxValue);
  });
});

describe('disabledStartHours', () => {
  test('it generates correct array based on a end date', () => {
    const currentHour = 14;
    const end = moment(`${currentHour}:30`, 'HH:mm');
    const result = disabledStartHours(end);
    expect(result.length).toBe(maxHour - currentHour);
  });
  test('it returns empty array if end hour parameter is not provided or undefined', () => {
    const result = disabledStartHours();
    expect(result.length).toBe(0);
  });
});

describe('disabledEndHours', () => {
  test('it generates correct array based on start time', () => {
    const currentHour = 14;
    const start = moment(`${currentHour}:30`, 'HH:mm');
    const result = disabledEndHours(start);
    expect(result.length).toBe(currentHour);
  });
  test('it returns empty array if hour parameter is  undefined', () => {
    const result = disabledEndHours();
    expect(result.length).toBe(0);
  });
});

describe('disabledStartMinutes', () => {
  test('it generates correct array based on a moment date', () => {
    const currentHour = 14;
    const currentMinute = 12;
    const end = moment(`${currentHour}:${currentMinute}`, 'HH:mm');
    const result = disabledStartMinutes(currentHour, end);
    expect(result.length).toBe(maxMinute - currentMinute);
  });
  test('it returns empty array if end minute parameter is not provided or undefined', () => {
    const currentHour = 14;
    const result = disabledStartMinutes(currentHour);
    expect(result.length).toBe(0);
  });
});

describe('disabledEndMinutes', () => {
  test('it generates correct array based on start date', () => {
    const currentHour = 14;
    const currentMinute = 12;
    const end = moment(`${currentHour}:${currentMinute}`, 'HH:mm');
    const result = disabledEndMinutes(currentHour, end);
    expect(result.length).toBe(currentMinute);
  });
  test('it returns empty array if minute parameter is  undefined', () => {
    const result = disabledEndMinutes(12);
    expect(result.length).toBe(0);
  });
});

describe('disabledStartSeconds', () => {
  test('it generates correct array based on a moment date', () => {
    const currentHour = 14;
    const currentMinute = 12;
    const currentSecond = 12;
    const end = moment(
      `${currentHour}:${currentMinute}:${currentSecond}`,
      'HH:mm:ss'
    );
    const result = disabledStartSeconds(currentHour, currentMinute, end);
    expect(result.length).toBe(maxSecond - currentSecond);
  });
  test('it returns empty array if endValue parameter is not provided or undefined', () => {
    const result = disabledStartSeconds(14, 14);
    expect(result.length).toBe(0);
  });
});

describe('disabledEndSeconds', () => {
  test('it generates correct array based on start date', () => {
    const currentHour = 14;
    const currentMinute = 12;
    const currentSecond = 12;
    const end = moment(
      `${currentHour}:${currentMinute}:${currentSecond}`,
      'HH:mm:ss'
    );
    const result = disabledEndSeconds(currentHour, currentMinute, end);
    expect(result.length).toBe(currentMinute);
  });
  test('it returns empty array if minute parameter is  undefined', () => {
    const result = disabledEndSeconds(12, 12);
    expect(result.length).toBe(0);
  });
});
