import React from 'react';

import { Button, Col, Row } from 'antd';
import { Moment } from 'moment';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import messages from 'src/translations/default/messages';
import { Schedule } from 'src/types/response/Schedule';
import { weekday } from 'src/utils';
import { TimeRangePicker } from '../TimeRangePicker/TimeRangePicker';

const ScheduleDetail: React.SFC<{ schedule: Schedule }> = ({ schedule }) => {
  return (
    <>
      {schedule.startTime.format('HH:mm')} - {schedule.endTime.format('HH:mm')}
    </>
  );
};

interface OwnProps {
  schedule: Schedule;
  allowEdit?: boolean;
  onUpdate: (schedule: Schedule) => void;
}

interface State {
  mode: 'edit' | 'display';
  editedSchedule: Schedule | null;
}
const defaultProps = {
  onUpdate: () => undefined,
};

type Props = InjectedIntlProps & OwnProps;

class MallScheduleItem extends React.PureComponent<Props, State> {
  public static defaultProps = defaultProps;
  public state: State = {
    mode: 'display',
    editedSchedule: null,
  };

  public handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { schedule } = this.props;
    this.setState({
      mode: 'edit',
      editedSchedule: new Schedule(schedule.toDTO()),
    });
  };

  public handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.props.onUpdate(this.state.editedSchedule!);
    if (this.state.mode === 'edit') {
      this.setState({
        mode: 'display',
      });
    }
  };

  public get displayActionButton() {
    const { mode, editedSchedule } = this.state;
    const { allowEdit = true } = this.props;

    if (mode === 'display' && allowEdit) {
      return <Button size="small" icon="edit" onClick={this.handleEditClick} />;
    } else {
      return (
        <Button
          size="small"
          disabled={!(editedSchedule!.startTime && editedSchedule!.endTime)}
          icon="check"
          onClick={this.handleSaveClick}
        />
      );
    }
    return null;
  }

  public handleValueChange = (
    dates: [Moment | undefined, Moment | undefined]
  ) => {
    const [startTime, endTime] = dates;
    const { editedSchedule } = this.state;
    editedSchedule!.startTime = startTime as Moment;
    editedSchedule!.endTime = endTime as Moment;
    return;
  };

  public get displayScheduleInfo() {
    const { mode } = this.state;

    const { schedule } = this.props;

    if (mode === 'display') {
      return <ScheduleDetail schedule={schedule} />;
    } else if (mode === 'edit') {
      return (
        <TimeRangePicker
          defaultStartValue={schedule.startTime}
          defaultEndValue={schedule.endTime}
          onChange={this.handleValueChange}
        />
      );
    }
    return null;
  }

  public render() {
    const { schedule, intl } = this.props;
    return (
      <Row key={schedule.id} style={{ marginBottom: '16px' }}>
        <Col
          xs={{ offset: 0, span: 4 }}
          md={{ offset: 0, span: 3 }}
          style={{
            fontWeight: 'bold',
            textAlign: 'end',
            marginRight: '16px',
          }}>
          {intl.formatMessage(messages.day[weekday[schedule.dayOfWeek - 1]])}:
        </Col>{' '}
        <Col span={4} xs={{ span: 19 }}>
          {this.displayScheduleInfo}
          {'  '}
          {this.displayActionButton}
        </Col>
      </Row>
    );
  }
}

export default injectIntl(MallScheduleItem, {
  withRef: true,
});
