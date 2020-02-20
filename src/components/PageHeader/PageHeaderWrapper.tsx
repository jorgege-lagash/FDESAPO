import React from 'react';

import MenuContext from 'src/layouts/MenuContext';
import GridContent from './GridContent';
import PageHeader, { OwnProps as PageHeaderProps } from './PageHeader';
import styles from './PageHeaderWrapper.less';

interface Props extends PageHeaderProps {
  top?: React.ReactNode;
  wrapperClassName?: string;
}
const PageHeaderWrapper: React.SFC<Props> = ({
  children,
  wrapperClassName,
  top,
  ...restProps
}) => (
  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    <MenuContext.Consumer>
      {(value: any) => (
        <PageHeader
          wide={false}
          home={'Home'}
          {...value}
          key="pageheader"
          {...restProps}
          // linkElement={Link}
          // itemRender={(item) => {
          //   if (item.locale) {
          //     return (
          //       <FormattedMessage id={item.locale} defaultMessage={item.name} />
          //     );
          //   }
          //   return item.name;
          // }}
        />
      )}
    </MenuContext.Consumer>
    {children ? (
      <div className={styles.content}>
        <GridContent>{children}</GridContent>
      </div>
    ) : null}
  </div>
);

export default PageHeaderWrapper;
