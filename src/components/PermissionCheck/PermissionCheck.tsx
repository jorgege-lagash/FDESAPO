import React from 'react';
import { PermissionContext } from 'src/layouts/PermissionContext';
import { hasPermission } from 'src/utils';

interface Props {
  children: any;
  permission: string[];
}

export default function PermissionCheck(props: Props) {
  return (
    <PermissionContext.Consumer>
      {(userPermission) =>
        hasPermission([...props.permission], userPermission.permissions) &&
        props.children
      }
    </PermissionContext.Consumer>
  );
}
