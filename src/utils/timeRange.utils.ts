import { Moment } from 'moment';

export const getDisabledStartNumbers = (
  maxValueInRange: number,
  currentMinVal: number
) => {
  const disabledNumbers = [];
  for (let n = maxValueInRange; n > currentMinVal; n--) {
    disabledNumbers.push(n);
  }
  return disabledNumbers;
};

export const getDisabledEndNumbers = (currentMaxVal: number) => {
  const disabledNumbers = [];
  for (let n = 0; n < currentMaxVal; n++) {
    disabledNumbers.push(n);
  }
  return disabledNumbers;
};

export const disabledEndNumbersFor = (
  shouldNotEvaluate: boolean,
  currentMaxVal: number
) => {
  if (shouldNotEvaluate) {
    return [];
  }
  return getDisabledEndNumbers(currentMaxVal);
};

export const disabledStartNumbersFor = (
  shouldNotEvaluate: boolean,
  maxValueInRange: number,
  currentMinVal: number
) => {
  if (shouldNotEvaluate) {
    return [];
  }
  return getDisabledStartNumbers(maxValueInRange, currentMinVal);
};

export const disabledStartHours = (endValue?: Moment): number[] => {
  const shouldNotEvaluate = !endValue;
  const maxValue = (endValue && endValue.hour()) || 0;
  return disabledStartNumbersFor(shouldNotEvaluate, 23, maxValue);
};

export const disabledEndHours = (startValue?: Moment): number[] => {
  const shouldNotEvaluate = !startValue;
  const minValue = (startValue && startValue.hour()) || 0;
  return disabledEndNumbersFor(shouldNotEvaluate, minValue);
};

export const disabledStartMinutes = (
  selectedHour: number,
  endValue?: Moment
): number[] => {
  const shouldNotEvaluate = !endValue || selectedHour < endValue.hour();
  const maxValue = (endValue && endValue.minute()) || 0;
  return disabledStartNumbersFor(shouldNotEvaluate, 59, maxValue);
};

export const disabledEndMinutes = (
  selectedHour: number,
  startValue?: Moment
): number[] => {
  const shouldNotEvaluate = !startValue || selectedHour > startValue.hour();
  const minValue = (startValue && startValue.minute()) || 0;
  return disabledEndNumbersFor(shouldNotEvaluate, minValue);
};

export const disabledStartSeconds = (
  selectedHour: number,
  selectedMinute: number,
  endValue?: Moment
): number[] => {
  const shouldNotEvaluate =
    !endValue ||
    selectedHour < endValue.hour() ||
    selectedMinute < endValue.minute();
  const maxValue = (endValue && endValue.second()) || 0;
  return disabledStartNumbersFor(shouldNotEvaluate, 59, maxValue);
};

export const disabledEndSeconds = (
  selectedHour: number,
  selectedMinute: number,
  startValue?: Moment
): number[] => {
  const shouldNotEvaluate =
    !startValue ||
    selectedHour > startValue.hour() ||
    selectedMinute > startValue.minute();
  const minValue = (startValue && startValue.second()) || 0;
  return disabledEndNumbersFor(shouldNotEvaluate, minValue);
};
