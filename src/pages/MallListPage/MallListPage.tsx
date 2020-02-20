import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import { actions } from 'src/actions/mall.action';
import { MallList } from 'src/components/MallList/MallList';
import PageHeaderWrapper from 'src/components/PageHeader/PageHeaderWrapper';
import PermissionCheck from 'src/components/PermissionCheck/PermissionCheck';
import * as AppPermissions from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import { getMallArray } from 'src/selectors/mall.selector';
import { Mall } from 'src/types/Mall';

interface MallListPageStateProps {
  malls: Mall[];
  userId: number;
}

interface MallListPageDispatchProps {
  actions: {
    fetchMallList: typeof actions.fetchMallList;
  };
}

type MallListPageWithInjectedProps = MallListPageStateProps &
  MallListPageDispatchProps;

class MallListPage extends React.PureComponent<MallListPageWithInjectedProps> {
  public componentDidMount() {
    const { actions: dispatchActions } = this.props;
    dispatchActions.fetchMallList();
  }
  public render() {
    const data: Mall[] = this.props.malls || [];
    return (
      <PageHeaderWrapper title={'Lista de Malls'}>
        <Card>
          <PermissionCheck permission={[AppPermissions.mall.create]}>
            <div className="table-list-operator-row">
              <Link to="/cms/malls/create">
                <Button type="primary" icon="plus">
                  Nuevo
                </Button>
              </Link>
            </div>
          </PermissionCheck>

          <MallList malls={data} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  const { fetchMallList } = actions;
  return {
    actions: bindActionCreators(
      {
        fetchMallList,
      },
      dispatch
    ),
  };
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    userId: state.session.userData!.userId,
    malls: getMallArray(state),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MallListPage);
