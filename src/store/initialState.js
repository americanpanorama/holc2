import * as L from 'leaflet';

import Cities from '../../data/Cities.json';
import FormsMetadata from '../../data/formsMetadata.json';
import calculateDimensions from './CalculateDimensions';
const dimensions = calculateDimensions();

// const basemap = (isRetina)
//   ? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}@2x.png'
//   : 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}.png';

// load varables from the hash

let zoom = 5;
let lat = 39.10;
let lng = -94.58;
let selectedCategory = null;
let showHOLCMaps = true;
let showADSelections = true;
let showADScan = false;
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
});

// initialize the position for the adscan if it isn't specified in the url
if (!adScan) {
  const { windowWidth, dataViewerWidth, mapHeight } = dimensions;
  L.Map.include({
    getSize: () => new L.Point(windowWidth, mapHeight),
  });
  const map = new L.Map(document.createElement('div'), {
    center: [0, 0],
    zoom: 0,
  });
  const bounds = [[-10, -180], [90, -60]];
  const featureGroup = new L.FeatureGroup([
    new L.Marker(bounds[0]),
    new L.Marker(bounds[1]),
  ]);
  const sheetBounds = featureGroup.getBounds();
  const { lat: adY, lng: adXOfBounds } = sheetBounds.getCenter();
  // offset the bounds to take account of the dataViewer
  const adX = adXOfBounds - (dataViewerWidth / 2 / windowWidth) * (bounds[1][1] - bounds[0][1]);
  const adZoom = map.getBoundsZoom(sheetBounds);

  adScan = {
    zoom: adZoom,
    center: [adY, adX],
  };
}

const center = [lat, lng];

const basemap = (zoom < 9)
  ? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png'
  : 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';

export default {
  basemap,
  selectedCity: {
    data: null,
    isFetching: false,
  },
  selectedCategory,
  selectedGrade: null,
  selectedArea: null,
  selectedRingGrade: {
    ringId: null,
    grade: null,
  },
  selectedText: null,
  adScan,
  map: {
    movingTo: null,
    zoom,
    center,
    bounds: [],
    aboveThreshold: false,
    visibleRasters: [],
    visiblePolygons: [],
    loadingPolygonsFor: [],
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
};
