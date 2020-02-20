import { getUserPermissionsInMall } from './permissions';

test('getUserPermissionsInMall returns an array', async () => {
  expect.assertions(2);
  const permissionList = [
    {
      id: 1,
      name: 'user.id',
    },
    {
      id: 2,
      name: 'user.description',
    },
  ];
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([
    JSON.stringify(permissionList),
    { status: 201 },
  ]);

  try {
    const response = await getUserPermissionsInMall(1, 1);
    expect(response).toBeTruthy();
    expect(response.length).toBe(2);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});
