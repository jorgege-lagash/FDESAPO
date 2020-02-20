import { Skeleton, Tabs } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { TabItem } from 'src/types/TabItem';
import * as styles from './PageHeader.less';

export interface OwnProps {
  title?: string;
  logo?: string;
  action?: string;
  content?: React.ReactNode;
  extraContent?: string;
  tabList?: TabItem[];
  className?: string;
  tabActiveKey?: string;
  tabDefaultActiveKey?: string;
  tabBarExtraContent?: string;
  loading?: boolean;
  wide?: boolean;
  hiddenBreadcrumb?: boolean;
  onTabChange?: (key: string) => void;
}

export default class PageHeader extends React.PureComponent<OwnProps> {
  public onChange = (key: string) => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(key);
    }
  };
  public render() {
    const {
      title,
      logo,
      action,
      content,
      extraContent,
      tabList,
      className,
      tabActiveKey,
      tabDefaultActiveKey,
      tabBarExtraContent,
      loading = false,
      wide = false,
    } = this.props;

    const clsString = classNames(styles.pageHeader, className);

    const activeKeyProps: any = {};
    if (tabDefaultActiveKey !== undefined) {
      activeKeyProps.defaultActiveKey = tabDefaultActiveKey;
    }
    if (tabActiveKey !== undefined) {
      activeKeyProps.activeKey = tabActiveKey;
    }
    return (
      <div className={clsString}>
        <div className={wide ? styles.wide : ''}>
          <Skeleton
            loading={loading}
            title={false}
            active={true}
            paragraph={{ rows: 3 }}
            avatar={{ size: 'large', shape: 'circle' }}>
            {/* {hiddenBreadcrumb ? null : <BreadcrumbView {...this.props} />} */}
            <div className={styles.detail}>
              {logo && <div className={styles.logo}>{logo}</div>}
              <div className={styles.main}>
                <div className={styles.row}>
                  {title && <h1 className={styles.title}>{title}</h1>}
                  {action && <div className={styles.action}>{action}</div>}
                </div>
                <div className={styles.row}>
                  {content && <div className={styles.content}>{content}</div>}
                  {extraContent && (
                    <div className={styles.extraContent}>{extraContent}</div>
                  )}
                </div>
              </div>
            </div>
            {tabList && tabList.length ? (
              <Tabs
                className={styles.tabs}
                {...activeKeyProps}
                onChange={this.onChange}
                tabBarExtraContent={tabBarExtraContent}>
                {tabList.map((item) => (
                  <Tabs.TabPane tab={item.tab} key={item.key} />
                ))}
              </Tabs>
            ) : null}
          </Skeleton>
        </div>
      </div>
    );
  }
}
