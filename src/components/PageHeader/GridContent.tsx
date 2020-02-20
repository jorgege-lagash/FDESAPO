import React, { PureComponent } from 'react';
import styles from './GridContent.less';

export default class GridContent extends PureComponent {
  public render() {
    const { children } = this.props;
    const className = `${styles.main}`;
    return <div className={className}>{children}</div>;
  }
}
