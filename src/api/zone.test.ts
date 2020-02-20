import { Zone } from 'src/types/response/Zone';
import { zone } from './zone';

it('create zone', async () => {
  expect.assertions(2);
  const zoneData = {
    id: 0,
    name: 'Sports',
    // tslint:disable-next-line:no-duplicate-string
    description: 'This is a sports section',
  };
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([JSON.stringify(zoneData), { status: 201 }]);

  try {
    const response = await zone.create(1, zoneData as Zone);
    expect(response).toBeTruthy();
    expect(response).toEqual(zoneData);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});

it('update zone', async () => {
  expect.assertions(2);
  const zoneData = {
    id: 1,
    mallId: 1,
    name: 'Sports',
    description: 'This is a sports section',
  };
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([JSON.stringify(zoneData), { status: 201 }]);

  try {
    const response = await zone.update(1, 1, zoneData);
    expect(response).toBeTruthy();
    expect(response).toEqual(zoneData);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});

it('get zone by id', async () => {
  expect.assertions(2);
  const zoneData = {
    id: 1,
    mallId: 1,
    name: 'Sports',
    description: 'This is a sports section',
  };
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([JSON.stringify(zoneData), { status: 201 }]);

  try {
    const response = await zone.fetchById(1, 1);
    expect(response).toBeTruthy();
    expect(response).toEqual(zoneData);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});

it('get zone list', async () => {
  expect.assertions(2);
  const zoneList = [
    {
      id: 1,
      mallId: 1,
      name: 'Sports',
      description: 'This is a sports section',
    },
    {
      id: 2,
      mallId: 1,
      name: 'Sports',
      description: 'This is a sports section',
    },
  ];
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([JSON.stringify(zoneList), { status: 201 }]);

  try {
    const response = await zone.fetch(1);
    expect(response).toBeTruthy();
    expect(response.length).toBe(2);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});
