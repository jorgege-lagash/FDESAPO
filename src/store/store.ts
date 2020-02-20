import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import reducers, { ApplicationState } from '../reducers';
import rootSaga from '../sagas';
export function configureStore(
  history: History,
  initialState: Partial<ApplicationState>
): Store<ApplicationState> {
  const middleware = routerMiddleware(history);
  const sagasMiddleware = createSagaMiddleware();
  const store = createStore(
    reducers(history),
    initialState,
    composeWithDevTools(applyMiddleware(middleware, sagasMiddleware))
  );
  sagasMiddleware.run(rootSaga);
  return store;
}
