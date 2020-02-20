import { Icon, Input } from 'antd';
import React from 'react';
import { SearchDropDown } from 'src/components/TableSearchDropDown/TableSearchDropDown';

export type HandleSearchCallback = (
  selectedKeys: string[],
  confirm: () => void
) => () => void;

export type HandleResetCallback = (clearFilters: () => void) => () => void;

export const createColumnSearchFilter = (
  handleSearch: HandleSearchCallback,
  handleReset: HandleResetCallback,
  setInput: (input: Input) => void
) => ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
  <SearchDropDown
    setInput={setInput}
    confirm={confirm}
    selectedKeys={selectedKeys}
    setSelectedKeys={setSelectedKeys}
    handleSearch={handleSearch}
    handleReset={handleReset}
    clearFilters={clearFilters}
  />
);

export const renderSearchText = (getSearchText: () => string) => (
  text: string = ''
) => {
  const searchText = getSearchText();
  return searchText ? (
    <span>
      {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map(
        (fragment: string, i: any) =>
          fragment.toLowerCase() === searchText.toLowerCase() ? (
            <span key={i} className="highlight">
              {fragment}
            </span>
          ) : (
            fragment
          )
      )}
    </span>
  ) : (
    text
  );
};
export const createFilter = () => {
  let searchInput: Input;
  let searchText = '';
  const setInput = (input: Input) => {
    searchInput = input;
  };
  const handleSearch = (selectedKeys: string[], confirm: () => void) => () => {
    confirm();
    searchText = selectedKeys[0];
  };

  const handleReset = (clearFilters: () => void) => () => {
    clearFilters();
    searchText = '';
  };
  return {
    filterDropdown: createColumnSearchFilter(
      handleSearch,
      handleReset,
      setInput
    ),
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => {
          searchInput.focus();
        });
      }
    },
    render: renderSearchText(() => searchText),
    filterIcon: (filtered: boolean) => (
      <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />
    ),
  };
};

export const compareSortStrings = (
  filterValue: string = '',
  recordValue: string = ''
) => recordValue.toLowerCase().localeCompare(filterValue.toLowerCase());

export const compareFilterStrings = (
  filterValue: string = '',
  recordValue: string = ''
) => recordValue.toLowerCase().includes(filterValue.toLowerCase());
