import { Avatar, Dropdown, Icon, Menu, Spin } from 'antd'; // Tooltip
import React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { User } from 'src/types/response/User';
// tslint:disable-next-line: no-commented-code
// import SelectLang from '../SelectLang';
import styles from './index.less';

export interface GlobalHeaderRightProps {
  currentUser: User;
  onMenuClick: any;
  isLoadingSession: boolean;
}
export type GlobalHeaderRightWithInjectedProps = GlobalHeaderRightProps &
  InjectedIntlProps;

class GlobalHeaderRight extends React.Component<
  GlobalHeaderRightWithInjectedProps
> {
  public get menu() {
    const { onMenuClick } = this.props;
    return (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/* <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage
            id="menu.account.center"
            defaultMessage="account center"
          />
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage
            id="menu.account.settings"
            defaultMessage="account settings"
          />
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />
          <FormattedMessage
            id="menu.account.trigger"
            defaultMessage="Trigger Error"
          />
        </Menu.Item> */}
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
  }

  public createUserMenu(isLoadingSession: boolean) {
    const { currentUser } = this.props;
    return (
      <>
        {currentUser && currentUser.username ? (
          <Dropdown overlay={this.menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Spin size="small" spinning={isLoadingSession}>
                <span className={styles.name} style={{ marginRight: '10px' }}>
                  {currentUser.username}
                </span>
              </Spin>
              <Avatar
                size="small"
                className={styles.avatar}
                icon="user"
                alt="avatar"
              />
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </>
    );
  }

  public render() {
    const { isLoadingSession } = this.props;
    const className = styles.right;
    return (
      <div className={className}>
        {/* <Tooltip
          title={
            <FormattedMessage
              id="component.globalHeader.help"
              defaultMessage="Help"
            />
          }>
          <a
            target="_blank"
            href="https://pro.ant.design/docs/getting-started"
            rel="noopener noreferrer"
            className={styles.action}>
            <Icon type="question-circle-o" />
          </a>
        </Tooltip> */}

        {this.createUserMenu(isLoadingSession)}
        {/* <SelectLang className={styles.action} /> */}
      </div>
    );
  }
}

export default injectIntl(GlobalHeaderRight, {
  withRef: true,
});
