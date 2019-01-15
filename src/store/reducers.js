import { combineReducers } from 'redux';
import A from '../utils/Actions';

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

const selectedNeighborhood = (state = null, action) => (
  (action.type === A.SELECT_NEIGHBORHOOOD) ? action.payload : state
);

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

const map = (state = { zoom: 5, center: [39.1045, -94.5832] }, action) => (
  (action.type === A.MOVE_MAP) ? action.payload : state
);

const searchingADs = (state = false, action) => (
  (action.type === A.SEARCHING_ADS) ? action.payload : state
);

const showContactUs = (state = false, action) => (
  (action.type === A.TOGGLE_CONTACT_US) ? action.payload : state
);

const showCityStats = (state = true, action) => (
  (action.type === A.TOGGLE_CITY_STATS) ? action.payload : state
);

const showIntroModal = (state = false, action) => (
  (action.type === A.TOGGLE_INTRO_MODAL) ? action.payload : state
);

// immutable--loaded from data that doesn't change
const cities = (state = {}) => state;

const combinedReducer = combineReducers({
  selectedCategory,
  selectedCity,
  selectedGrade,
  selectedNeighborhood,
  selectedRingGrade,
  showCityStats,
  visibleCities,
  map,
  searchingADs,
  showContactUs,
  showIntroModal,
  cities,
});

export default combinedReducer;
