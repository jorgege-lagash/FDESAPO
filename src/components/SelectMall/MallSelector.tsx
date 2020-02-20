import React from 'react';
import SelectMall from './index';

interface Props {
  hide?: boolean;
}
const MallSelector: React.SFC<Props> = ({ hide }) => {
  return (
    <div
      style={{
        color: 'rgba(255, 255, 255, 0.65)',
        paddingBottom: hide ? 0 : '16px',
        paddingTop: hide ? 0 : '16px',
        paddingLeft: hide ? 0 : '16px',
        opacity: hide ? 0 : 1,
        transition: 'opacity 0.2s ease-in-out',
      }}>
      {!hide && (
        <>
          Mall Actual:
          <br />
          <SelectMall />
        </>
      )}
    </div>
  );
};
export default MallSelector;
