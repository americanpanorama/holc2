import * as L from 'leaflet';

import Cities from '../../data/Cities.json';
import areaDescSelections from '../../data/areaDescSelections.json';
import FormsMetadata from '../../data/formsMetadata.json';
import calculateDimensions from './CalculateDimensions';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

Object.keys(Cities).forEach((id) => {
  const { slug } = Cities[id];
  Cities[id].areaDescSelections = (areaDescSelections[slug])
    ? shuffleArray(areaDescSelections[slug]) : null;
});


const dimensions = calculateDimensions();

let zoom = 5;
let lat = 39.10;
let lng = -94.58;
let selectedCategory = null;
let showHOLCMaps = true;
let showADSelections = true;
let showADScan = false;
let selectedText = null;
let adScan;

const { hash } = window.location;
hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
  const [key, value] = pair.split('=');
  if (key === 'loc') {
    [zoom, lat, lng] = value.split('/').map(str => parseFloat(str));
  }
  if (key === 'adview' && value === 'full') {
    showADSelections = false;
  }
  if (key === 'maps' && value === '0') {
    showHOLCMaps = false;
  }
  if (key === 'adimage') {
    showADScan = true;
    const [adZoom, adY, adX] = value.split('/').map(str => parseFloat(str));
    adScan = {
      zoom: adZoom,
      center: [adY, adX],
    };
  }
  if (key === 'category') {
    selectedCategory = value;
  }
  if (key === 'text') {
    selectedText = value;
  }
});

// initialize the position for the adscan if it isn't specified in the url
if (!adScan) {
  const { windowWidth: mapWidth, dataViewerWidth, mapHeight, size } = dimensions;
  L.Map.include({
    getSize: () => new L.Point(mapWidth, mapHeight),
  });
  const map = new L.Map(document.createElement('div'), {
    center: [0, 0],
    zoom: 0,
  });

  // defaults for mobile
  let adZoom = 2;
  let adCenter = [65.22, -123.57];
  if (size !== 'mobile') {
    const bounds = [[-10, -180], [90, -60]];
    const horizontalOffsetRatio = ((dataViewerWidth + 40) / mapWidth) / ((mapWidth - (dataViewerWidth + 40)) / mapWidth);
    const verticalOffsetRatio = 0;
    const offsetLng = bounds[0][1] - (bounds[1][1] - bounds[0][1]) * horizontalOffsetRatio;
    const offsetLat = bounds[0][0] - (bounds[1][0] - bounds[0][0]) * verticalOffsetRatio;

    // [[-90, -180], [90, 37]]
    const featureGroup = new L.FeatureGroup([
      new L.Marker([offsetLat, offsetLng]),
      new L.Marker(bounds[1]),
    ]);
    const sheetBounds = featureGroup.getBounds();
    const { lat: adY, lng: adX } = sheetBounds.getCenter();
    adCenter = [adY, adX];

    // offset the bounds to take account of the dataViewer
    adZoom = map.getBoundsZoom(sheetBounds);
  }

  adScan = {
    zoom: adZoom,
    center: adCenter,
  };
}

const center = [lat, lng];

console.log(dimensions.media);

// const basemap = (zoom < 9)
//   ? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png'
//   //: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png';
//   : 'https://api.mapbox.com/styles/v1/nayers/cjjkbhzhcebop2rlq5hv0vghf/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmF5ZXJzIiwiYSI6ImNqMXM1ZDFidDAwYjUzM212eHEyNzYyd2oifQ.I_na3uloyQM89sp3pnzcnQ';

const basemap = 'https://api.mapbox.com/styles/v1/ur-dsl/cjtyox5ms3ycd1flvhg7kihdi/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXItZHNsIiwiYSI6ImNqdGs3MHhxdDAwd2E0NHA2bmxoZjM1Y2IifQ.y1wfhup4U2U8KvHuOpFCng';

export default {
  areaDescriptions: null,
  basemap,
  selectedCity: null,
  loadingCity: null,
  selectedCategory,
  selectedGrade: null,
  selectedArea: null,
  inspectedArea: null,
  selectedText,
  adScan,
  map: {
    movingTo: null,
    zoom,
    center,
    bounds: [],
    aboveThreshold: false,
    visibleRasters: [],
    visiblePolygons: [],
    highlightedPolygons: [],
    loadingPolygonsFor: [],
    userPosition: null,
    geolocating: false,
    sorting: false,
    sortingPossibilities: [],
    sortingLatLng: [],
  },
  showADScan,
  showADSelections,
  showContactUs: false,
  showCityStats: true,
  showHOLCMaps,
  showDataViewerFull: false,
  searchingADsFor: null,
  adSearchHOLCIds: [],
  //searchingADsAreas: [],
  //dimensions: {},
  cities: Cities,
  formsMetadata: FormsMetadata,
  dimensions,
  landingPage: false && dimensions.media !== 'phone' && dimensions.media !== 'tablet-portrait',
};
