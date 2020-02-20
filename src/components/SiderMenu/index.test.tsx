import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from '../../Root';
import SiderMenu from './index';
const sidemenuProps = {
  collapsed: false,
  logo: '',
  isMobile: false,
  onCollapse: () => {
    return;
  },
};
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Root>
      <SiderMenu {...sidemenuProps} />
    </Root>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
