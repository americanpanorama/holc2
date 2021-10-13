import * as L from 'leaflet';
import { parseJsonSourceFileConfigFileContent } from 'typescript';

import Cities from '../../data/Cities.json';
import FormsMetadata from '../../data/formsMetadata.json';
import calculateDimensions from './CalculateDimensions';

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const dimensions = calculateDimensions();
const { windowWidth: mapWidth, dataViewerWidth, mapHeight, media } = dimensions;

let zoom = 5;
let lat = 39.10;
let lng = -94.58;
let selectedCategory = null;
let showHOLCMaps = true;
let showFullHOLCMaps = true;
let showADSelections = true;
let showADScan = false;
let showDataViewerFull = media !== 'phone';
let selectedText = null;
let adScan;
let edition = '';
let points = [];

const { hash } = window.location;
hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key === 'loc') {
        [zoom, lat, lng] = value.split('/').map(str => parseFloat(str));
    }
    if (key === 'adview' && value === 'full') {
        showADSelections = false;
    }
    if (key === 'adviewer' && value === 'sidebar') {
        showDataViewerFull = false;
    }
    if (key === 'maps' && value === '0') {
        showHOLCMaps = false;
    }
    if (key === 'mapview' && value === 'graded') {
        showFullHOLCMaps = false;
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
    if (key === 'edition') {
        edition = value;
    }
    if (key === 'points') {
        points = value.split('|').map(d => d.split('/').map(d => parseFloat(d)));
    }
});

// initialize the position for the adscan if it isn't specified in the url
if (!adScan) {
    const utilityMap = new L.Map(document.createElement('div'), {
        center: [0, 0],
        zoom: 0,
    });

    // defaults for phone
    let adZoom = 2;
    let adCenter = [65.22, -123.57];
    if (media !== 'phone') {
        const bounds = [
            [-10, -180],
            [90, -60]
        ];
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
        adZoom = utilityMap.getBoundsZoom(sheetBounds, false, [-1 * mapWidth, -1 * mapHeight]);
    }

    adScan = {
        zoom: adZoom,
        center: adCenter,
    };
}

const center = [lat, lng];

export default {
    selectedArea: null,
    selectedCategory,
    selectedCity: null,
    selectedGrade: null,
    selectedText,
    showADScan,
    showADSelections,
    showContactUs: false,
    showCityStats: true,
    showFullHOLCMaps,
    showHOLCMaps,
    showNationalLegend: true,
    showDataViewerFull,
    adSelections: [],
    areaDescriptions: null,
    loadingCity: null,
    adScan,
    map: {
        zoom,
        center,
        bounds: [],
        aboveThreshold: false,
        visibleRasters: [],
        visibleRasterPolygons: [],
        selectableRasterBoundaries: [],
        visibleBoundaries: [],
        visiblePolygons: [],
        highlightedPolygons: [],
        loadingPolygonsFor: [],
        userPosition: null,
        geolocating: false,
        sorting: false,
        sortingPossibilities: [],
        sortingLatLng: [],
    },
    searchingADsFor: null,
    adSearchHOLCIds: [],
    cities: Cities,
    formsMetadata: FormsMetadata,
    dimensions,
    initialized: false,
    donutCityMarkers: false,
    edition,
    points,
};