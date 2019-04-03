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
  const { map, selectedCity, showHOLCMaps, showADSelections, showADScan, adScan, selectedCategory, cities } = store.getState();
  const { zoom, center } = map;
  const selectedCityData = (selectedCity) ? cities.find(c => c.ad_id === selectedCity) : null;
  const lat = Math.round(center[0] * 1000) / 1000;
  const lng = Math.round(center[1] * 1000) / 1000;
  const newHash = {
    loc: `${zoom}/${lat}/${lng}`,
    maps: (!showHOLCMaps) ? '0' : null,
    city: (selectedCityData) ? selectedCityData.slug : null,
    area: (!selectedCategory) ? nextState.selectedArea : null,
    category: selectedCategory,
    adview: (!showADSelections) ? 'full' : null,
  };
  if (showADScan) {
    const { zoom: adZoom, center: adCenter } = adScan;
    const adX = Math.round(adCenter[1] * 1000) / 1000;
    const adY = Math.round(adCenter[0] * 1000) / 1000;
    newHash.adimage = `${adZoom}/${adY}/${adX}`;
  }
  const hash = `#${Object.keys(newHash)
    .filter(k => newHash[k])
    .map(k => `${k}=${newHash[k]}`).join('&')}`;
  if (document.location.hash !== hash) {
    document.location.replace(hash);
  }
  return theNext;
};

const store = applyMiddleware(ReduxThunk, logger, hashManager)(createStore)(appReducer, initialState);

export default store;
