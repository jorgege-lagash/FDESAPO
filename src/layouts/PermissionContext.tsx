import React from 'react';

export const PermissionContext = React.createContext({
  permissions: {},
  setPermissions: (permissions: any) => {
    return;
  },
});
