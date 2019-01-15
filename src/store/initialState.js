import Cities from '../../data/Cities.json';

export default {
  selectedCity: {
    data: null,
    isFetching: false,
  },
  selectedCategory: null,
  selectedGrade: null,
  selectedNeighborhood: null,
  selectedRingGrade: {
    ringId: null, 
    grade: null
  },
  visibleCities: [],
  map: {
    zoom: 5,
    center: [39.1045, -94.5832]
  },
  showContactUs: false,
  showCityStats: true,
  showIntroModal: true,
  searchingADs: false,
  //searchingADsAreas: [],
  //dimensions: {},
  cities: Cities,
};
