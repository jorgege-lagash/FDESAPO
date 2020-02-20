import { Mall } from 'src/types/Mall';
import { mall } from './malls.api';

it('create mall', async () => {
  expect.assertions(2);
  const mallData = {
    id: 0,
    name: 'dmall',
    // tslint:disable-next-line:no-duplicate-string
    description: 'This is a mall',
  };
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([JSON.stringify(mallData), { status: 201 }]);

  try {
    const response = await mall.create(1, mallData as Mall);
    expect(response).toBeTruthy();
    expect(response).toEqual(mallData);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});

it('update mall', async () => {
  expect.assertions(2);
  const mallData = {
    id: 1,
    mallId: 1,
    name: 'mall',
    description: 'This is a mall',
  };
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([JSON.stringify(mallData), { status: 200 }]);

  try {
    const response = await mall.update(1, mallData);
    expect(response).toBeTruthy();
    expect(response).toEqual(mallData);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});

it('fetch malls Through User', async () => {
  expect.assertions(2);
  const mallList = [
    {
      id: 1,
      mallId: 1,
      name: 'dmall',
      description: 'This is a mall',
    },
    {
      id: 2,
      mallId: 1,
      name: 'dmall',
      description: 'This is a mall',
    },
  ];
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([JSON.stringify(mallList), { status: 200 }]);

  try {
    const response = await mall.fetchAllThroughUser(1);
    expect(response).toBeTruthy();
    expect(response.length).toBe(2);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});

it('fetch malls ', async () => {
  expect.assertions(2);
  const mallList = [
    {
      id: 1,
      mallId: 1,
      name: 'dmall',
      description: 'This is a mall',
    },
    {
      id: 2,
      mallId: 1,
      name: 'dmall',
      description: 'This is a mall',
    },
  ];
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([JSON.stringify(mallList), { status: 200 }]);

  try {
    const response = await mall.fetchAll();
    expect(response).toBeTruthy();
    expect(response.length).toBe(2);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});
