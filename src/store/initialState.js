import Cities from '../../data/Cities.json';
import calculateDimensions from './CalculateDimensions';

const isRetina = ((window.matchMedia 
  && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches
  || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches))
  || (window.devicePixelRatio && window.devicePixelRatio > 1.3));

// const basemap = (isRetina)
//   ? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}@2x.png'
//   : 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}.png';

const basemap = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';

// load varables from the hash

let zoom = 5;
let lat = 39.10;
let lng = -94.58;

const { hash } = window.location;
hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
  const [key, value] = pair.split('=');
  if (key === 'loc') {
    [zoom, lat, lng] = value.split('/').map(str => parseFloat(str));
  }
});

const center = [lat, lng];

export default {
  basemap,
  selectedCity: {
    data: null,
    isFetching: false,
  },
  selectedCategory: null,
  selectedGrade: null,
  selectedArea: null,
  selectedRingGrade: {
    ringId: null,
    grade: null,
  },
  map: {
    zoom,
    center,
    bounds: [],
    aboveThreshold: false,
    visibleRasters: [],
    visiblePolygons: [],
  },
  showContactUs: false,
  showCityStats: true,
  showHOLCMaps: true,
  showIntroModal: true,
  searchingADs: false,
  //searchingADsAreas: [],
  //dimensions: {},
  cities: Cities,
  dimensions: calculateDimensions(),
};
