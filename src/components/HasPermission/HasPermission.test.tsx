import { mount } from 'enzyme';
import React from 'react';
import Exception404 from '../../pages/Exception/404';
import { RootHOC } from '../../Root';
import HasPermission from './HasPermission';

describe('Test HasPermission component', () => {
  const WrappedComponent = RootHOC(
    HasPermission(['mall.create', 'mall.view', 'mall.edit'], Exception404)
  );

  test("don't render component if user lacks permissions", () => {
    const mountedComponent = mount(<WrappedComponent />);
    expect(mountedComponent.find(Exception404)).toBeTruthy();
    expect(mountedComponent.find(Exception404).length).toEqual(0);
  });

  test('render component if user has all of the required permissions', () => {
    const initialPermissionState = {
      entities: {
        permissions: {
          1: {
            name: 'mall.create',
          },
          2: {
            name: 'mall.view',
          },
          3: {
            name: 'mall.edit',
          },
        },
      },
    };
    const mountedComponent = mount(
      <WrappedComponent initialState={initialPermissionState} />
    );
    expect(mountedComponent.find(Exception404)).toBeTruthy();
    expect(mountedComponent.find(Exception404).length).toEqual(1);
  });
});
