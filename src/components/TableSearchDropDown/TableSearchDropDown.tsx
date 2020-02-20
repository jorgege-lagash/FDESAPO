import React from 'react';

import { Button, Input } from 'antd';
import {
  HandleResetCallback,
  HandleSearchCallback,
} from 'src/utils/table.utils';

interface OwnProps {
  setSelectedKeys: (selected: string[]) => void;
  setInput: (input: Input) => void;
  confirm: () => void;
  clearFilters: () => void;
  selectedKeys: string[];
  handleSearch: HandleSearchCallback;
  handleReset: HandleResetCallback;
}

export class SearchDropDown extends React.PureComponent<OwnProps> {
  public render() {
    const {
      selectedKeys,
      setSelectedKeys,
      handleSearch,
      handleReset,
      clearFilters,
      confirm,
      setInput,
    } = this.props;
    return (
      <div className="custom-filter-dropdown">
        <Input
          ref={(ele) => setInput(ele as Input)}
          placeholder="Search name"
          value={selectedKeys[0]}
          // tslint:disable-next-line:jsx-no-lambda
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={handleSearch(selectedKeys, confirm)}
        />
        <Button type="primary" onClick={handleSearch(selectedKeys, confirm)}>
          Buscar
        </Button>
        <Button onClick={handleReset(clearFilters)}>Reiniciar</Button>
      </div>
    );
  }
}
