import { combineReducers } from 'redux';
import A from './ActionTypes';
import initialState from './initialState';

const selectedCategory = (state = null, action) => (
  (action.type === A.SELECT_CATEGORY) ? action.payload : state
);

const selectedCity = (state = { data: null, isFetching: false }, action) => {
  if (action.type === A.SELECT_CITY_REQUEST) {
    return {
      isFetching: true,
      data: null,
    };
  }

  if (action.type === A.SELECT_CITY_SUCCESS) {
    return {
      isFetching: false,
      data: action.payload,
    };
  }

  return state;
};

const selectedGrade = (state = null, action) => (
  (action.type === A.SELECT_GRADE) ? action.payload : state
);

const showADTranscriptions = (state = null, action) => (
  (action.type === A.TOGGLE_AD_TRANSCRIPTION) ? !state : state
);

const showADSelections = (state = null, action) => (
  (action.type === A.TOGGLE_AD_SELECTION) ? !state : state
);

const selectedArea = (state = null, action) => {
  if (action.type === A.SELECT_AREA) {
    return action.payload;
  }
  if (action.type === A.UNSELECT_AREA) {
    return null;
  }
  return state;
};

const selectedRingGrade = (state = null, action) => (
  (action.type === A.SELECT_RING_GRADE) ? action.payload : state
);

const visibleCities = (state = [], action) => {
  if (action.type === A.SHOW_VISIBLE_CITIES) {
    // get the currently visible ids
    const currentlyVisibleIds = state.map(c => c.id);
    // check to see if there's any change
    if (currentlyVisibleIds.sort() !== action.payload.sort()) {
      // filter out those that are no longer visible
      const newVisibleCities = state.filter(c => action.payload.includes(c.id));
      // add the new ones
      // somehow get them;
      return newVisibleCities;
    }
    return state;
  }
  return state;
};

const map = (state = initialState.map, action) => {
  if (action.type === A.MOVE_MAP) {
    return action.payload;
  }
  if (action.type === A.LOADED_POLYGONS) {
    return {
      ...state,
      visiblePolygons: action.payload,
    };
  }
  return state;
};

const basemap = (state = initialState.basemap, action) => {
  if (false && action.type === A.MOVE_MAP) {
    const isRetina = ((window.matchMedia 
      && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches
      || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches))
      || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
    if (!action.payload.aboveThrehold) {
      return (isRetina)
        ? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}@2x.png'
        : 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}.png';
    }
    return (isRetina)
      ? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2.png'
      : 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
  }
  return state;
};

const searchingADs = (state = false, action) => (
  (action.type === A.SEARCHING_ADS) ? action.payload : state
);

const showContactUs = (state = false, action) => (
  (action.type === A.TOGGLE_CONTACT_US) ? action.payload : state
);

const showCityStats = (state = true, action) => (
  (action.type === A.TOGGLE_CITY_STATS) ? !state : state
);

const showHOLCMaps = (state = true, action) => (
  (action.type === A.TOGGLE_HOLC_MAPS) ? !state : state
);

const showIntroModal = (state = false, action) => (
  (action.type === A.TOGGLE_INTRO_MODAL) ? action.payload : state
);

// immutable--loaded from data that doesn't change
const cities = (state = {}) => state;

const dimensions = (state = {}, action) => (
  (action.type === A.WINDOW_RESIZED) ? action.payload : state
);

const combinedReducer = combineReducers({
  selectedCategory,
  selectedCity,
  selectedGrade,
  selectedArea,
  selectedRingGrade,
  showCityStats,
  visibleCities,
  map,
  basemap,
  searchingADs,
  showADTranscriptions,
  showADSelections,
  showContactUs,
  showHOLCMaps,
  showIntroModal,
  cities,
  dimensions,
});

export default combinedReducer;
