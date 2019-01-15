import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import Actions from '../utils/Actions';
import appReducer from './reducers';
import initialState from './initialState';

const consoleMessages = store => next => (action) => {
  let result;
  if (action.type !== Actions.MOVE_MAP) {
    console.groupCollapsed(`dispatching action ${action.type}`);
    console.log(action);
    result = next(action);
    console.log(store.getState());
    console.groupEnd();
  }
  return result;
};

//const store = createStore(appReducer, initialState);

const store = applyMiddleware(consoleMessages, ReduxThunk)(createStore)(appReducer, initialState);

export default store;
