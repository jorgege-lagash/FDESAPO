import React from 'react';

import { TimePicker } from 'antd';
import { Moment } from 'moment';
import {
  disabledEndHours,
  disabledEndMinutes,
  disabledEndSeconds,
  disabledStartHours,
  disabledStartMinutes,
  disabledStartSeconds,
} from 'src/utils/timeRange.utils';
import { LooseObject } from '../../types/LooseObject';

interface TimeRangePickerState extends LooseObject {
  startValue?: Moment;
  endValue?: Moment;
  endOpen: boolean;
}

interface Props {
  size?: 'default' | 'small' | 'large';
  defaultStartValue?: Moment;
  defaultEndValue?: Moment;
  onChange: (dates: [Moment | undefined, Moment | undefined]) => void;
}

const defaultProps = {
  size: 'default',
  onChange: () => undefined,
};
export class TimeRangePicker extends React.Component<
  Props,
  TimeRangePickerState
> {
  public static defaultProps = defaultProps;
  public state: TimeRangePickerState = {
    startValue: undefined,
    endValue: undefined,
    endOpen: false,
  };

  public componentDidMount() {
    const { defaultStartValue, defaultEndValue } = this.props;
    const initialState: LooseObject = {
      startValue: undefined,
      endValue: undefined,
    };
    if (defaultStartValue) {
      initialState.startValue = defaultStartValue;
    }
    if (defaultEndValue) {
      initialState.endValue = defaultEndValue;
    }
    this.setState(initialState, () => {
      this.props.onChange([defaultStartValue, defaultEndValue]);
    });
  }

  public componentDidUpdate(prevProps: Props) {
    const { defaultStartValue, defaultEndValue } = this.props;
    const { startValue, endValue } = this.state;

    if (!startValue && !prevProps.defaultStartValue && defaultStartValue) {
      this.setState({ startValue: defaultStartValue });
    }
    if (!endValue && !prevProps.defaultEndValue && defaultEndValue) {
      this.setState({ endValue: defaultEndValue });
    }
  }

  public disabledStartHours = (): number[] => {
    const { endValue } = this.state;
    return disabledStartHours(endValue);
  };

  public disabledEndHours = (): number[] => {
    const { startValue } = this.state;
    return disabledEndHours(startValue);
  };

  public disabledStartMinutes = (selectedHour: number): number[] => {
    const { endValue } = this.state;
    return disabledStartMinutes(selectedHour, endValue);
  };

  public disabledEndMinutes = (selectedHour: number): number[] => {
    const { startValue } = this.state;
    return disabledEndMinutes(selectedHour, startValue);
  };

  public disabledStartSeconds = (
    selectedHour: number,
    selectedMinute: number
  ): number[] => {
    const { endValue } = this.state;
    return disabledStartSeconds(selectedHour, selectedMinute, endValue);
  };

  public disabledEndSeconds = (
    selectedHour: number,
    selectedMinute: number
  ): number[] => {
    const { startValue } = this.state;
    return disabledEndSeconds(selectedHour, selectedMinute, startValue);
  };

  public onChange = (field: string, value: Moment) => {
    this.setState(
      {
        [field]: value,
      },
      () => {
        this.props.onChange([this.state.startValue, this.state.endValue]);
      }
    );
  };

  public onStartChange = (value: Moment) => {
    const { endValue } = this.state;
    if (endValue && endValue.isBefore(value)) {
      return this.onChange('startValue', endValue.clone());
    }
    this.onChange('startValue', value);
  };

  public onEndChange = (value: Moment) => {
    const { startValue } = this.state;
    if (startValue && startValue.isAfter(value)) {
      return this.onChange('endValue', startValue.clone());
    }
    this.onChange('endValue', value);
  };

  public handleStartOpenChange = (open: boolean) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  public handleEndOpenChange = (open: boolean) => {
    this.setState({ endOpen: open });
  };

  public render() {
    const { defaultStartValue, defaultEndValue } = this.props;
    const { startValue, endValue, endOpen } = this.state;
    return (
      <>
        <TimePicker
          disabledHours={this.disabledStartHours}
          disabledMinutes={this.disabledStartMinutes}
          disabledSeconds={this.disabledStartSeconds}
          format="HH:mm:ss"
          size={this.props.size || 'default'}
          defaultValue={defaultStartValue}
          value={startValue}
          placeholder="Start Time"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <span> ~ </span>
        <TimePicker
          disabledHours={this.disabledEndHours}
          disabledMinutes={this.disabledEndMinutes}
          disabledSeconds={this.disabledEndSeconds}
          format="HH:mm:ss"
          size={this.props.size || 'default'}
          defaultValue={defaultEndValue}
          value={endValue}
          placeholder="End Time"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </>
    );
  }
}
