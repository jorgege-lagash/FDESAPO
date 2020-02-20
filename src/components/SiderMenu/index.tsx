import { Drawer } from 'antd';
import * as React from 'react';
import { menuConfig } from './MenuConfig';
import SiderMenu from './SiderMenu';

interface SFCSiderMenuWrapperProps {
  isMobile: boolean;
  collapsed: boolean;
  logo: any;
  onCollapse: (collapsed: boolean) => void;
}
const SiderMenuWrapper: React.SFC<SFCSiderMenuWrapperProps> = (props) => {
  const menuData = menuConfig;
  const { isMobile, collapsed, onCollapse, logo } = props;
  return isMobile ? (
    <Drawer
      visible={!collapsed}
      placement="left"
      // tslint:disable-next-line:jsx-no-lambda
      onClose={() => onCollapse(true)}
      style={{
        padding: 0,
        height: '100vh',
      }}>
      <SiderMenu
        isMobile={isMobile}
        logo={logo}
        collapsed={collapsed}
        menuData={menuData}
        onCollapse={onCollapse}
      />
    </Drawer>
  ) : (
    <SiderMenu {...props} isMobile={isMobile} logo={logo} menuData={menuData} />
  );
};

export default SiderMenuWrapper;
