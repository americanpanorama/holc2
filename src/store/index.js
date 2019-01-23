import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import appReducer from './reducers';
import initialState from './initialState';

const logger = createLogger({
  collapsed: true,
  duration: true,
});

const hashManager = store => next => (action) => {
  const theNext = next(action);
  const nextState = store.getState();
  const { zoom, center } = nextState.map;
  const { data: selectedCityData } = nextState.selectedCity;
  const lat = Math.round(center[0] * 100) / 100;
  const lng = Math.round(center[1] * 100) / 100;
  const newHash = {
    loc: `${zoom}/${lat}/${lng}`,
    city: (selectedCityData) ? selectedCityData.slug : null,
  };
  const hash = `#${Object.keys(newHash)
    .filter(k => newHash[k])
    .map(k => `${k}=${newHash[k]}`).join('&')}`;
  if (document.location.hash !== hash) {
    document.location.replace(hash);
  }
  return theNext;
};

const store = applyMiddleware(hashManager, ReduxThunk, logger)(createStore)(appReducer, initialState);

export default store;
