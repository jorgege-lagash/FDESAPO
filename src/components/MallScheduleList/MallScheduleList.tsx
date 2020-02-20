import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { actions as scheduleActions } from 'src/actions/schedule.action';
import { ApplicationState } from 'src/reducers';
import { getMallSchedulesByType } from 'src/selectors/mall.selector';
import { Schedule, ScheduleType } from 'src/types/response/Schedule';
import MallScheduleItem from './MallScheduleItem';

interface OwnProps {
  mallId: number;
  type: ScheduleType;
}

interface StateProps {
  schedules: Schedule[];
}

interface DispatchProps {
  actions: {
    fetchScheduleList: typeof scheduleActions.fetchScheduleList;
    updateSchedule: typeof scheduleActions.updateSchedule;
  };
}

export type Props = OwnProps & StateProps & DispatchProps;

export class MallScheduleList extends React.PureComponent<Props> {
  public componentDidMount() {
    const { actions, mallId, type } = this.props;
    if (mallId) {
      actions.fetchScheduleList(mallId, type);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { actions, mallId, type } = this.props;
    if (mallId && prevProps.mallId !== mallId) {
      actions.fetchScheduleList(mallId, type);
    }
  }

  public handleUpdate = (schedule: Schedule) => {
    this.props.actions.updateSchedule(this.props.mallId, schedule);
  };

  public render() {
    const { schedules } = this.props;
    return (
      <>
        {schedules.map((s) => (
          <MallScheduleItem
            schedule={s}
            key={s.id}
            onUpdate={this.handleUpdate}
          />
        ))}
      </>
    );
  }
}

const mapStateToProps = (state: ApplicationState, props: Props): StateProps => {
  const { mallId, type } = props;
  return {
    schedules: getMallSchedulesByType(state, props, mallId, type),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { fetchScheduleList, updateSchedule } = scheduleActions;
  return {
    actions: bindActionCreators(
      {
        fetchScheduleList,
        updateSchedule,
      },
      dispatch
    ),
  };
};

const connectedComponent = connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(MallScheduleList);

export default connectedComponent;
