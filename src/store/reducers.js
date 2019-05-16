import { combineReducers } from 'redux';
import A from './ActionTypes';
import initialState from './initialState';

const areaDescriptions = (state = initialState.areaDescriptions, action) => (
  (action.type === A.LOAD_ADS) ? action.payload : state
);

const selectedCategory = (state = null, action) => {
  if (action.type === A.SELECT_CATEGORY) {
    return action.payload;
  }
  if (action.type === A.UNSELECT_CATEGORY || action.type === A.SELECT_AREA
    || action.type === A.SELECT_CITY_REQUEST) {
    return null;
  }
  return state;
};

const selectedCity = (state = initialState.selectedCity, action) => {
  if (action.type === A.UNSELECT_CITY) {
    return null;
  }

  if (action.type === A.SELECT_CITY_REQUEST) {
    return null;
  }

  if (action.type === A.MOVE_MAP && action.payload.zoom < 9) {
    return null;
  }

  if (action.type === A.SELECT_CITY_SUCCESS) {
    return action.payload;
  }

  return state;
};

const loadingCity = (state = null, action) => {
  if (action.type === A.SELECT_CITY_REQUEST) {
    return action.payload;
  }

  if (action.type === A.SELECT_CITY_SUCCESS) {
    return null;
  }

  return state;
};

const selectedGrade = (state = null, action) => (
  (action.type === A.SELECT_GRADE) ? action.payload : state
);

const showADScan = (state = initialState.showADScan, action) => {
  if (action.type === A.TOGGLE_AD_SCAN) {
    return !state;
  }
  if (action.type === A.SELECT_CATEGORY) {
    return false;
  }
  return state;
};

const showADSelections = (state = null, action) => (
  (action.type === A.TOGGLE_AD_SELECTION) ? !state : state
);

const selectedArea = (state = null, action) => {
  if (action.type === A.SELECT_AREA) {
    return action.payload;
  }
  if (action.type === A.SELECT_CITY_REQUEST || action.type === A.SELECT_CITY_SUCCESS
    || action.type === A.UNSELECT_AREA || action.type === A.UNSELECT_CITY) {
    return null;
  }

  if (action.type === A.MOVE_MAP && action.payload.zoom < 9) {
    return null;
  }

  return state;
};

const inspectedArea = (state = null, action) => {
  if (action.type === A.INSPECT_AREA) {
    return action.payload;
  }
  if (action.type === A.SELECT_AREA || action.type === A.SELECT_CITY_REQUEST || action.type === A.SELECT_CITY_SUCCESS
    || action.type === A.UNSELECT_AREA || action.type === A.UNSELECT_CITY) {
    return null;
  }

  if (action.type === A.MOVE_MAP && action.payload.zoom < 9) {
    return null;
  }

  return state;
};

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
  if (action.type === A.ZOOM_IN) {
    return {
      ...state,
      aboveThreshold: (state.zoom + 1 >= 9),
      zoom: state.zoom + 1,
    };
  }

  if (action.type === A.ZOOM_OUT) {
    return {
      ...state,
      aboveThreshold: (state.zoom + 1 >= 9),
      zoom: state.zoom - 1,
    };
  }

  if (action.type === A.MOVE_MAP) {
    return {
      ...state,
      ...action.payload,
    };
  }

  if (action.type === A.MOVE_MAP_END) {
    return {
      ...state,
      movingTo: null,
    };
  }

  if (action.type === A.GEOLOCATING) {
    return {
      ...state,
      geolocating: true,
    };
  }

  if (action.type === A.GEOLOCATION_ERROR) {
    return {
      ...state,
      geolocating: false,
    };
  }

  if (action.type === A.LOCATED_USER) {
    return {
      ...state,
      userPosition: action.payload,
      geolocating: false,
    };
  }

  if (action.type === A.SEARCHING_ADS_RESULTS) {
    return {
      ...state,
      highlightedPolygons: action.payload,
    };
  }

  if (action.type === A.HIGHLIGHT_AREAS) {
    return {
      ...state,
      highlightedPolygons: action.payload,
    };
  }

  if (action.type === A.UNHIGHLIGHT_AREA || action.type === A.SELECT_CITY_REQUEST) {
    return {
      ...state,
      highlightedPolygons: [],
    };
  }

  // select city also gets the polygons
  if (action.type === A.SELECT_CITY_REQUEST) {
    return {
      ...state,
      loadingPolygonsFor: [
        ...state.loadingPolygonsFor,
        action.payload,
      ],
    };
  }

  if (action.type === A.LOADING_POLYGONS) {
    return {
      ...state,
      loadingPolygonsFor: [
        ...state.loadingPolygonsFor,
        ...action.payload,
      ],
    };
  }

  if (action.type === A.SELECT_CITY_SUCCESS) {
    return {
      ...state,
      highlightedPolygons: [],
    };
  }

  if (action.type === A.LOADED_POLYGONS) {
    const cityIdsFinished = [...new Set(action.payload.map(p => p.ad_id))];
    const loadingPolygonsFor = state.loadingPolygonsFor.filter(id => !cityIdsFinished.includes(id));
    return {
      ...state,
      visiblePolygons: action.payload,
      loadingPolygonsFor,
    };
  }

  if (action.type === A.BRING_MAP_TO_FRONT) {
    return {
      ...state,
      sorting: false,
      sortingPossibilities: [],
      sortingLatLng: [],
      visibleRasters: [
        ...state.visibleRasters.filter(m => m.id !== action.payload),
        ...state.visibleRasters.filter(m => m.id === action.payload),
      ],
    };
  }

  if (action.type === A.TOGGLE_SORTING_MAPS) {
    return {
      ...state,
      sorting: !state.sorting,
      sortingPossibilities: [],
      sortingLatLng: [],
    };
  }

  if (action.type === A.SORT_MAP_POSSIBILITIES) {
    return {
      ...state,
      sortingPossibilities: action.payload.ids,
      sortingLatLng: action.payload.latLng,
    };
  }

  return state;
};

const adScan = (state = initialState.adScan, action) => {
  if (action.type === A.ZOOM_IN_ADSCAN) {
    return {
      ...state,
      zoom: state.zoom + 1,
    };
  }

  if (action.type === A.ZOOM_OUT_ADSCAN) {
    return {
      ...state,
      zoom: state.zoom - 1,
    };
  }

  if (action.type === A.MOVE_ADSCAN) {
    return action.payload;
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

const searchingADsFor = (state = false, action) => {
  if (action.type === A.SEARCHING_ADS) {
    return action.payload;
  }
  if (action.type === A.SELECT_AREA) {
    return null;
  }
  return state;
};

const showContactUs = (state = false, action) => (
  (action.type === A.TOGGLE_CONTACT_US) ? action.payload : state
);

const showCityStats = (state = true, action) => (
  (action.type === A.TOGGLE_CITY_STATS) ? !state : state
);

const showDataViewerFull = (state = initialState.showDataViewerFull, action) => (
  (action.type === A.TOGGLE_DATA_VIEWER_FULL) ? !state : state
);

const showHOLCMaps = (state = true, action) => (
  (action.type === A.TOGGLE_HOLC_MAPS) ? !state : state
);

const selectedText = (state = false, action) => (
  (action.type === A.SELECT_TEXT) ? action.payload : state
);

const landingPage = (state = true, action) => (
  (action.type === A.TOGGLE_LANDING_PAGE) ? !state : state
);

const adSearchHOLCIds = (state = initialState.adSearchHOLCIds, action) => {
  if (action.type === A.SELECT_AREA) {
    return [];
  }
  if (action.type === A.SEARCHING_ADS_RESULTS) {
    return action.payload;
  }
  return state;
};

// immutable--loaded from data that doesn't change
const cities = (state = {}) => state;
const formsMetadata = (state = initialState.formsMetadata) => state;

const dimensions = (state = {}, action) => (
  (action.type === A.WINDOW_RESIZED) ? action.payload : state
);

const combinedReducer = combineReducers({
  areaDescriptions,
  selectedCategory,
  selectedCity,
  loadingCity,
  selectedGrade,
  selectedArea,
  inspectedArea,
  showCityStats,
  visibleCities,
  map,
  adScan,
  basemap,
  searchingADsFor,
  showADScan,
  showADSelections,
  showContactUs,
  showDataViewerFull,
  showHOLCMaps,
  selectedText,
  adSearchHOLCIds,
  cities,
  formsMetadata,
  dimensions,
  landingPage,
});

export default combinedReducer;
