import { Icon, Layout, Menu } from 'antd';
import { get } from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators, Dispatch } from 'redux';
import { actions as poiTypeActions } from 'src/actions/poi-type.action';
import { poi } from 'src/constants/permissions';
import { ApplicationState } from 'src/reducers';
import { getPoiTypeList } from 'src/selectors/poi-type.selector';
import { PoiType } from 'src/types/response/PoiType';
import { createMallDependentUrl } from 'src/utils';
import logo from '../../assets/parauco-logo-white.svg';
import {
  getApplicationPermissions,
  hasRequiredPermissions,
} from '../../selectors/auth.selector';
import MallSelector from '../SelectMall/MallSelector';
import * as styles from './index.less';
import { SideMenuItem } from './MenuConfig';

const getIcon = (icon?: string) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

interface OwnProps {
  collapsible?: boolean;
  collapsed?: boolean;
  trigger?: React.ReactNode;
  logo: any;
  isMobile: boolean;
  menuData: SideMenuItem[];
  onCollapse: (collapse: boolean) => void;
}

interface StateProps {
  permissions: any;
  mallId: number;
  poiTypes: PoiType[];
}

interface DispatchProps {
  actions: {
    fetchPoiTypeList: typeof poiTypeActions.fetchEntityList;
  };
}

interface OwnState {
  menuData: SideMenuItem[];
}

type Props = OwnProps & StateProps & DispatchProps;

class SiderMenu extends React.PureComponent<Props, OwnState> {
  constructor(props: Props) {
    super(props);
  }

  public componentDidMount() {
    this.props.actions.fetchPoiTypeList(this.props.mallId);
    this.addPoiTypesToMenu();
  }

  public componentDidUpdate(prevProps: Props) {
    const { mallId, poiTypes, actions } = this.props;
    if (mallId !== prevProps.mallId) {
      actions.fetchPoiTypeList(mallId);
    }

    if (poiTypes !== prevProps.poiTypes) {
      this.addPoiTypesToMenu();
    }
  }

  public addPoiTypesToMenu() {
    const { menuData, poiTypes = [] } = this.props;
    const poiMenu = menuData.find((item) => item.code === 'poi');
    if (!poiMenu) {
      return;
    }
    const poiTypeSubmenu = poiMenu.children!.find(
      (item) => item.code === 'poi.types'
    );
    if (poiTypeSubmenu) {
      const poiTypeElements = poiTypes.map<SideMenuItem>((poitype) => {
        return {
          requiredPermissions: [poi.list],
          label: poitype.name,
          isDependentOnMall: true,
          path: `/pois/list/${poitype.id}`,
        };
      });
      poiTypeSubmenu.children = poiTypeElements;
    }
  }

  public getNavMenuItems = (menuData: SideMenuItem[]) => {
    if (!menuData) {
      return [];
    }
    return menuData
      .filter((item) => item.label && !item.hideInMenu)
      .map((item) => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item, ItemDom);
      })
      .filter((item) => item);
  };
  /**
   * get SubMenu or Item
   */
  public getSubMenuOrItem = (item: SideMenuItem) => {
    // doc: add hideChildrenInMenu
    if (
      item.children &&
      !item.hideInMenu &&
      item.children.some((child) => !!child.label)
    ) {
      const { label } = item;
      return (
        <Menu.SubMenu
          title={
            item.iconType ? (
              <span>
                {getIcon(item.iconType)}
                <span>{label}</span>
              </span>
            ) : (
              label
            )
          }
          key={item.path}>
          {this.getNavMenuItems(item.children)}
        </Menu.SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  public getMenuItemPath = (item: SideMenuItem) => {
    const { mallId } = this.props;
    const { label } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.iconType);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{label}</span>
        </a>
      );
    }
    const {
      //  location,
      isMobile,
      onCollapse,
    } = this.props;
    let url = itemPath;
    if (item.isDependentOnMall) {
      url = createMallDependentUrl(mallId, itemPath);
    }
    return (
      <Link
        to={url}
        target={target}
        // replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }>
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  public conversionPath = (path?: string) => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  // permission to check
  public checkPermissionItem = (item: SideMenuItem, ItemDom?: any) => {
    const { permissions } = this.props;
    if (get(permissions, 'everything', false)) {
      return ItemDom;
    }
    const required = item.requiredPermissions || [];
    const hasPermission = hasRequiredPermissions(required, permissions);
    if (hasPermission) {
      return ItemDom;
    }
    return null;
  };

  public render() {
    const { collapsed, collapsible, trigger, menuData } = this.props;
    const menuItems = this.getNavMenuItems(menuData);
    return (
      <Layout.Sider
        width={256}
        trigger={trigger}
        collapsible={collapsible}
        collapsed={collapsed}>
        <div className={styles.logo} id="logo">
          <img src={logo} alt="logo" />
        </div>
        <MallSelector hide={collapsed} />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['3']}>
          {menuItems}
        </Menu>
        <div className={styles.version}>
          v{process.env.REACT_APP_APP_VERSION}
        </div>
      </Layout.Sider>
    );
  }
}

function mapStateToProps(state: ApplicationState): StateProps {
  return {
    permissions: getApplicationPermissions(state),
    mallId: state.malls.selectedMall || 0,
    poiTypes: getPoiTypeList(state),
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    actions: bindActionCreators(
      {
        fetchPoiTypeList: poiTypeActions.fetchEntityList,
      },
      dispatch
    ),
  };
};

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(SiderMenu);
