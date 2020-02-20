import { initHistory } from './history';
import { configureStore } from './store';

export const initialHistory = initHistory();
const store = configureStore(initialHistory, {});
export default store;
