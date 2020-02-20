import * as React from 'react';
import * as styles from './CenteredContentLayout.less';

const CenteredContentLayout = ({ children }: { children?: any }) => {
  return <div className={styles.centeredContent}>{children}</div>;
};
export default CenteredContentLayout;
