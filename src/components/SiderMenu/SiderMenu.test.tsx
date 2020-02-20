import { mount } from 'enzyme';
import * as React from 'react';
import logo from '../../assets/logo.png';
import Root from '../../Root';
import { menuConfig } from './MenuConfig';
import SiderMenu from './SiderMenu';

const sidemenuProps = {
  collapsed: false,
  logo,
  isMobile: false,
  menuData: menuConfig,
  onCollapse: () => {
    return;
  },
};

it('renders without crashing', () => {
  const wrapped = mount(
    <Root>
      <SiderMenu
        collapsed={false}
        isMobile={false}
        logo={logo}
        menuData={menuConfig}
        onCollapse={sidemenuProps.onCollapse}
      />
    </Root>
  );
  expect(wrapped.find(SiderMenu).length).toEqual(1);
});
