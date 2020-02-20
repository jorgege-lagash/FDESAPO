import { TermsOfService } from 'src/types/response/TermsOfService';
import { termsOfService } from './terms-of-service';

it('create termsOfService', async () => {
  expect.assertions(2);
  const termsOfServiceData = {
    id: 0,
    text: 'Sports',
    mallId: 1,
    tag: '1',
    active: true,
    // tslint:disable-next-line:no-duplicate-string
    description: 'This is a sports section',
  };
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([
    JSON.stringify(termsOfServiceData),
    { status: 201 },
  ]);

  try {
    const response = await termsOfService.create(
      1,
      termsOfServiceData as TermsOfService
    );
    expect(response).toBeTruthy();
    expect(response).toEqual(termsOfServiceData);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});

it('update termsOfService', async () => {
  expect.assertions(2);
  const termsOfServiceData = {
    id: 1,
    text: 'Sports',
    mallId: 1,
    tag: '1',
    active: true,
  };
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([
    JSON.stringify(termsOfServiceData),
    { status: 201 },
  ]);

  try {
    const response = await termsOfService.update(1, 1, termsOfServiceData);
    expect(response).toBeTruthy();
    expect(response).toEqual(termsOfServiceData);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});

it('get termsOfService list', async () => {
  expect.assertions(2);
  const termsOfServiceList = [
    {
      id: 1,
      text: 'Sports',
      mallId: 1,
      tag: '1',
      active: true,
    },
    {
      id: 2,
      text: 'Sports',
      mallId: 1,
      tag: '1',
      active: true,
    },
  ];
  (fetch as any).resetMocks();
  (fetch as any).mockResponses([
    JSON.stringify(termsOfServiceList),
    { status: 201 },
  ]);

  try {
    const response = await termsOfService.fetch(1);
    expect(response).toBeTruthy();
    expect(response.length).toBe(2);
  } catch (error) {
    expect(error).toBeFalsy();
  }
});
