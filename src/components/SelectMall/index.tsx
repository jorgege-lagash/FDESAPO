import * as React from 'react';

import { Select } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { actions } from 'src/actions/mall.action';
import { ApplicationState } from 'src/reducers';
import { getMallArray } from 'src/selectors/mall.selector';
import { Mall } from 'src/types/Mall';

const { Option } = Select;

interface DispatchProps {
  actions: {
    fetchMallList: typeof actions.fetchMallList;
    selectMall: typeof actions.selectMall;
  };
}

interface StateProps {
  malls: Mall[];
  isLoading: boolean;
  selectedMall?: number;
}

type Props = DispatchProps & StateProps;

class SelectMall extends React.PureComponent<Props> {
  public state = {
    searchTerm: '',
  };

  constructor(props: Props) {
    super(props);
    const { malls, selectedMall } = props;
    if (malls.length > 0) {
      this.selectMall(
        !selectedMall || selectedMall === 0 ? malls[0].id : selectedMall
      );
    } else {
      props.actions.fetchMallList();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const { malls, selectedMall } = this.props;
    if (malls.length !== prevProps.malls.length && !selectedMall) {
      if (malls.length > 0) {
        this.selectMall(malls[0].id);
      } else {
        this.selectMall(undefined);
      }
    }
  }

  public selectMall = (mallId: number | undefined) => {
    this.props.actions.selectMall(mallId);
  };

  public handleChange = (value: number) => {
    this.selectMall(value);
  };

  public get filteredMalls() {
    const { malls } = this.props;
    const { searchTerm } = this.state;
    const term = searchTerm.trim().toLowerCase();
    return malls.filter((m) => {
      return m.name.toLowerCase().includes(term);
    });
  }

  public render() {
    return (
      <Select
        defaultActiveFirstOption={true}
        value={this.props.selectedMall}
        style={{ width: 180 }}
        onChange={this.handleChange}>
        {this.filteredMalls.map((m) => (
          <Option key={`${m.id}`} value={m.id}>
            {m.name}
          </Option>
        ))}
      </Select>
    );
  }
}

const mapStateToProps = (state: ApplicationState): StateProps => {
  return {
    selectedMall: state.malls.selectedMall,
    isLoading: state.malls.isLoading,
    malls: getMallArray(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  const { fetchMallList, selectMall } = actions;
  return {
    actions: bindActionCreators(
      {
        fetchMallList,
        selectMall,
      },
      dispatch
    ),
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(SelectMall);
