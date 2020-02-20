import { createBrowserHistory, createMemoryHistory, History } from 'history';

export const initHistory = (): History => {
  let historyObject: History | null = null;
  try {
    historyObject = createBrowserHistory();
  } catch (e) {
    // if there is no DOM use in memory history
    // tslint:disable-next-line:no-console
    console.log('Using Memory history');
    historyObject = createMemoryHistory();
  }
  return historyObject;
};
