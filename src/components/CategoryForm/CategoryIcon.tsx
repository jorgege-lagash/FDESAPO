import React from 'react';

import style from './Category.less';

interface Props {
  iconName: string;
}

class CategoryIcon extends React.PureComponent<Props> {
  public render() {
    return (
      <div
        className={style.demoIcon}
        style={{ marginLeft: 10, marginRight: 10, fontSize: 24 }}>
        <i className={style[this.props.iconName]} />
      </div>
    );
  }
}

export default CategoryIcon;
