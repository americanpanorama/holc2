import { combineReducers } from 'redux';
import A from './ActionTypes';
import initialState from './initialState';

const initialized = (state = false, action) => (
    (action.type === A.INITIALIZED) ? true : state
);

const areaDescriptions = (state = initialState.areaDescriptions, action) => (
    (action.type === A.LOAD_ADS) ? action.payload.ads : state
);

const adSelections = (state = initialState.adSelections, action) => (
    (action.type === A.LOAD_ADS) ? action.payload.selections : state
);

const selectedCategory = (state = null, action) => {
    if (action.type === A.SELECT_CATEGORY) {
        return action.payload;
    }
    if (action.type === A.UNSELECT_CATEGORY || action.type === A.SELECT_AREA ||
        action.type === A.SELECT_CITY_REQUEST) {
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
    if (action.type === A.SELECT_CITY_REQUEST || action.type === A.SELECT_CITY_SUCCESS ||
        action.type === A.UNSELECT_AREA || action.type === A.UNSELECT_CITY ||
        action.type === A.SELECT_CATEGORY) {
        return null;
    }

    if (action.type === A.MOVE_MAP && action.payload.zoom < 9) {
        return null;
    }

    return state;
};

const visibleCities = (state = [], action) => (
    (action.type === A.UPDATE_VISIBLE_CITIES) ? action.payload : state
);

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
            aboveThreshold: (state.zoom - 1 >= 9),
            zoom: state.zoom - 1,
        };
    }

    if (action.type === A.MOVE_MAP) {
        return {
            ...state,
            ...action.payload,
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

    if (action.type === A.UNHIGHLIGHT_AREA || action.type === A.UNSELECT_AREA ||
        action.type === A.SELECT_CITY_REQUEST) {
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

    if (action.type === A.SELECT_CITY_SUCCESS || action.type === A.UNSELECT_CITY) {
        return {
            ...state,
            highlightedPolygons: [],
        };
    }

    if (action.type === A.LOADED_POLYGONS) {
        const cityIdsFinished = [...new Set(action.payload.polygons.map(p => p.ad_id))];
        const loadingPolygonsFor = state.loadingPolygonsFor.filter(id => !cityIdsFinished.includes(id));
        return {
            ...state,
            visiblePolygons: action.payload.polygons,
            visibleRasterPolygons: action.payload.rasterBoundaries,
            visibleBoundaries: (action.payload.boundaries) ? action.payload.boundaries.filter(b => !!b) : [],
            loadingPolygonsFor,
        };
    }

    if (action.type === A.BRING_MAP_TO_FRONT) {
        return {
            ...state,
            sorting: false,
            sortingPossibilities: [],
            sortingLatLng: [],
            visibleRasterPolygons: [
                ...state.visibleRasterPolygons.filter(m => m.map_id !== action.payload),
                ...state.visibleRasterPolygons.filter(m => m.map_id === action.payload),
            ],
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

    if (action.type === A.SELECT_CATEGORY) {
        return {
            ...state,
            highlightedPolygons: [],
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

const showHOLCMaps = (state = true, action) => {
    if (action.type === A.TOGGLE_HOLC_MAPS) {
        return !state;
    }

    if (action.type === A.SHOW_ONLY_POLYGONS) {
        return false;
    }

    if (action.type === A.SHOW_MOSAIC_MAPS || action.type === A.SHOW_FULL_MAPS) {
        return true;
    }

    return state;
};

const showFullHOLCMaps = (state = true, action) => {
    if (action.type === A.TOGGLE_HOLC_MAPS) {
        return !state;
    }

    if (action.type === A.SHOW_MOSAIC_MAPS) {
        return false;
    }

    if (action.type === A.SHOW_FULL_MAPS) {
        return true;
    }

    return state;
};

const showNationalLegend = (state = true, action) => (
    (action.type === A.TOGGLE_NATIONAL_LEGEND) ? !state : state
);

const selectedText = (state = false, action) => {
    if (action.type === A.SELECT_TEXT) {
        return action.payload;
    }
    if (action.type === A.SELECT_CITY_REQUEST || action.type === A.SELECT_AREA) {
        return null;
    }
    return state;
};

const adSearchHOLCIds = (state = initialState.adSearchHOLCIds, action) => {
    if (action.type === A.SELECT_AREA) {
        return [];
    }
    if (action.type === A.SEARCHING_ADS_RESULTS) {
        return action.payload;
    }
    return state;
};

const donutCityMarkers = (state = false, action) => (
    (action.type === A.TOGGLE_CITY_MARKER_STYLE) ? !state : state
);

// immutable--loaded from data that doesn't change
const cities = (state = {}) => state;
const formsMetadata = (state = initialState.formsMetadata) => state;
const edition = (state = {}) => state;

const dimensions = (state = {}, action) => (
    (action.type === A.WINDOW_RESIZED) ? action.payload : state
);

// points are only set in the url, not by the app 
const points = (state = {}, action) => state;


const combinedReducer = combineReducers({
    initialized,
    areaDescriptions,
    adSelections,
    selectedCategory,
    selectedCity,
    loadingCity,
    selectedGrade,
    selectedArea,
    showCityStats,
    visibleCities,
    map,
    adScan,
    searchingADsFor,
    showADScan,
    showADSelections,
    showContactUs,
    showDataViewerFull,
    showHOLCMaps,
    showFullHOLCMaps,
    showNationalLegend,
    selectedText,
    adSearchHOLCIds,
    cities,
    formsMetadata,
    dimensions,
    donutCityMarkers,
    edition,
    points,
});

export default combinedReducer;