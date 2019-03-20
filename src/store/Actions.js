import * as L from 'leaflet';
import TheStore from '.';
import Actions from './ActionTypes';
import calculateDimensions from './CalculateDimensions';
import Rasters from '../../data/Rasters.json';
import Cities from '../../data/Cities.json';

export const selectCategory = eOrId => (dispatch, getState) => {
  console.log(eOrId);
  let id = eOrId;
  if (typeof eOrId === 'object' && eOrId.target.id) {
    id = eOrId.target.id;
  }
  if (typeof eOrId === 'object' && eOrId.target.options && eOrId.target.options.id) {
    id = eOrId.target.options.id;
  }

  dispatch({
    type: Actions.SELECT_CATEGORY,
    payload: id,
  });

  // close the ad scan if open
  if (getState().showADScan) {
    dispatch({
      type: Actions.TOGGLE_AD_SCAN,
    });
  }
};

export const unselectCategory = () => ({
  type: Actions.UNSELECT_CATEGORY,
});

export const selectCity = eOrId => (dispatch, getState) => {
  let id = eOrId;
  if (typeof eOrId === 'object' && eOrId.target.id) {
    id = eOrId.target.id;
  }
  if (typeof eOrId === 'object' && eOrId.target.options && eOrId.target.options.id) {
    id = eOrId.target.options.id;
  }
  // get data from the city that you need for the path and to set the map zoom and center
  const { showCityStats, dimensions, cities, selectedCategory } = getState();
  console.log(id);
  const { name, state, year, bounds } = cities.find(c => c.ad_id === parseInt(id));
  const { windowWidth, dataViewerWidth, mapHeight } = dimensions;
  const path = `${`${state}${name}${year}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;
  const mapWidth = windowWidth;

  //calculate the map zoom and center for city
  L.Map.include({
    getSize: () => new L.Point(mapWidth, mapHeight),
  });
  const map = L.map(document.createElement('div'), {
    center: [0, 0],
    zoom: 0,
  });
  const offsetRatio = ((dataViewerWidth + 40) / windowWidth) / ((windowWidth - (dataViewerWidth + 40)) / windowWidth);
  const offsetLng = bounds[0][1] - (bounds[1][1] - bounds[0][1]) * offsetRatio;
  const cityBounds = new L.FeatureGroup([
    new L.Marker([bounds[0][0], offsetLng]),
    new L.Marker(bounds[1]),
  ]);
  const polygonBounds = cityBounds.getBounds();
  const { lat: centerLat, lng: centerLng } = polygonBounds.getCenter();
  // offset the bounds to take account of the dataViewer
  //const centerLng = (!showCityStats) ? centerLngOfBounds
  //  : centerLngOfBounds - (dataViewerWidth / 2 / mapWidth) * (bounds[1][1] - bounds[0][1]);
  const zoom = map.getBoundsZoom(polygonBounds);
  dispatch({
    type: Actions.MOVE_MAP,
    payload: {
      ...getState().map,
      zoom,
      center: [centerLat, centerLng],
      aboveThreshold: true,
      movingTo: {
        zoom,
        center: [centerLat, centerLng],
      },
    },
  });

  dispatch({
    type: Actions.SELECT_CITY_REQUEST,
  });

  dispatch({
    type: Actions.UNSELECT_AREA,
  });

  // if the city is alread loaded just update the selected neighborhood
  // if (selectedCategory) {
  //   dispatch({
  //     type: Actions.UNSELECT_CATEGORY,
  //   });
  // }

  return fetch(`./static/ADs/${path}`)
    .then(response => () => {
      dispatch({
        type: Actions.SELECT_CITY_SUCCESS,
        payload: id,
      });
      dispatch({
        type: Actions.LOAD_ADS,
        payload: JSON.parse(response),
      });
    });
};

export const selectArea = eOrIds => (dispatch, getState) => {
  let ids = eOrIds;
  if (typeof eOrIds === 'object') {
    const ct = eOrIds.currentTarget || eOrIds.target;
    ids = ct.id || ct.options.id;
  }
  const [adId, holcId] = ids.split('-').map((v, i) => {
    return (i === 0) ? parseInt(v, 10) : v;
  });

  // load the city if necessary then the neighborhood
  const { selectedCity, selectedCategory, selectedArea, cities } = getState();

  if (selectedCity !== parseInt(adId, 10)) {
    dispatch({
      type: Actions.SELECT_CITY_REQUEST,
      payload: adId,
    });

    const { name, state, year } = cities[adId];
    const path = `${`${state}${name}${year}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;
    return fetch(`./static/ADs/${path}`)
      .then(response => () => {
        dispatch({
          type: Actions.SELECT_CITY_SUCCESS,
          payload: adId,
        });
        dispatch({
          type: Actions.LOAD_ADS,
          payload: JSON.parse(response),
        });
        // update the selected neighborhood
        dispatch({
          type: Actions.SELECT_AREA,
          payload: holcId,
        });
      });
  }

  // if the city is alread loaded just update the selected neighborhood
  if (selectedArea !== holcId || selectedCategory) {
    dispatch({
      type: Actions.SELECT_AREA,
      payload: holcId,
    });
  } else {
    dispatch({
      type: Actions.UNSELECT_AREA,
    });
  }

  if (selectedCategory) {
    dispatch({
      type: Actions.UNSELECT_CATEGORY,
    });
  }

  return null;
};

export const unselectArea = () => ({
  type: Actions.UNSELECT_AREA,
});

export const mapMoveEnd = () => ({
  type: Actions.MOVE_MAP_END,
});

export const updateMap = mapState => (dispatch, getState) => {
  const aboveThreshold = (mapState.zoom >= 9);

  // This is simple if above threshold for showing maps.
  // Reset the view and remove the visible rasters and map.
  if (!aboveThreshold) {
    dispatch({
      type: Actions.MOVE_MAP,
      payload: {
        ...mapState,
        aboveThreshold,
        visibleRasters: [],
        visiblePolygons: [],
      },
    });
  }

  if (aboveThreshold) {
    const latLngBounds = L.latLngBounds([...mapState.bounds]);

    const visibleRasters = Rasters.filter(raster => (
      raster.bounds && latLngBounds.intersects(raster.bounds)
    ));

    const citiesList = Object.keys(Cities).map(id => Cities[id]);
    const visibleCities = citiesList.filter(c => c.hasPolygons
      && c.bounds && latLngBounds.intersects(c.bounds));
    const visibleCityIds = visibleCities.map(c => c.ad_id);

    // if there aren't any cities visible, clear the selected city
    if (visibleCityIds.length === 0) {
      dispatch({
        type: Actions.SELECT_CITY_SUCCESS,
        payload: null,
      });
      return null;
    }

    const { map, selectedCity } = getState();
    let { visiblePolygons } = map;

    // execute to load rasters before the async task of loading new polygons or city
    dispatch({
      type: Actions.MOVE_MAP,
      payload: {
        ...mapState,
        aboveThreshold,
        visibleRasters,
        visiblePolygons,
      },
    });

    // select the city if there's only one and it's not already selected
    if (visibleCityIds.length === 1 && selectedCity !== visibleCityIds[0]) {
      const { name, state, year } = getState().cities.find(c => c.ad_id === visibleCityIds[0]);
      const path = `${`${state}${name}${year}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;

      // load both the city and the polygons
      dispatch({
        type: Actions.SELECT_CITY_REQUEST,
      });

      dispatch({
        type: Actions.LOADING_POLYGONS,
      });

      return Promise.all([
        fetch(`./static/polygons/${path}`),
        fetch(`./static/ADs/${path}`),
      ])
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then((responsesJSON) => {
          const polygons = responsesJSON[0];
          const ads = responsesJSON[1];

          dispatch({
            type: Actions.SELECT_CITY_SUCCESS,
            payload: visibleCityIds[0],
          });

          dispatch({
            type: Actions.LOAD_ADS,
            payload: ads,
          });

          const cityPolygons = Object.keys(polygons)
            .map(id => polygons[id]);
          dispatch({
            type: Actions.LOADED_POLYGONS,
            payload: cityPolygons,
          });
        });
    }

    // get the current cities id
    const extantCityIds = [...new Set(visiblePolygons.map(p => p.ad_id))];
    const cityIdsToDelete = extantCityIds.filter(id => !visibleCityIds.includes(id));

    // drop those that aren't visible anymore
    visiblePolygons = visiblePolygons.filter(p => visibleCityIds.includes(p.ad_id));

    // add those that haven't been loaded and aren't currently being loaded
    const newCities = visibleCities.filter(c => !extantCityIds.includes(c.ad_id)
      && !map.loadingPolygonsFor.includes(c.ad_id));

    if (newCities.length > 0) {
      const adIds = newCities.map(c => c.ad_id);
      const cityFiles = newCities.map(c => `./static/polygons/${c.state}${c.name.replace(/[^a-zA-Z0-9]/g, '')}${c.year}.json`);

      dispatch({
        type: Actions.LOADING_POLYGONS,
      });

      return Promise.all(cityFiles.map(f => fetch(f)))
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then((responsesJSON) => {
          responsesJSON.forEach((polygons, i) => {
            const cityPolygons = polygons.map(p => ({ ...p, ad_id: adIds[i] }));
            visiblePolygons = visiblePolygons.concat(cityPolygons);
          });

          dispatch({
            type: Actions.LOADED_POLYGONS,
            payload: visiblePolygons,
          });
        });
    }
    // otherwise make a change if there are polygons to remove from state
    else if (cityIdsToDelete.length > 0) {
      dispatch({
        type: Actions.LOADED_POLYGONS,
        payload: visiblePolygons,
      });
    }
  }
  return null;
};

export const updateADScan = adScanState => ({
  type: Actions.MOVE_ADSCAN,
  payload: adScanState,
});

const selectGrade = grade => ({
  type: Actions.SELECT_GRADE,
  payload: grade,
});

const selectRingArea = (ring, grade) => {
  return {
    type: Actions.SELECT_RING_GRADE,
    payload: (ring && grade) ? { ring, grade } : null,
  };
};

const recalculateDimensions = () => ({
  type: Actions.WINDOW_RESIZED,
  payload: calculateDimensions(),
});

export const toggleMapsOnOff = () => ({
  type: Actions.TOGGLE_HOLC_MAPS,
});

export const toggleCityStatsOnOff = () => ({
  type: Actions.TOGGLE_CITY_STATS,
});

export const toggleADSelections = () => ({
  type: Actions.TOGGLE_AD_SELECTION,
});

export const toggleADScan = () => ({
  type: Actions.TOGGLE_AD_SCAN,
});

export const toggleADTranscription = () => ({
  type: Actions.TOGGLE_AD_TRANSCRIPTION,
});

export const toggleDataViewerFull = () => ({
  type: Actions.TOGGLE_DATA_VIEWER_FULL,
});

export const resetMapView = () => (dispatch, getState) => {
  // remove the selected city from the store
  dispatch({
    type: Actions.UNSELECT_CITY,
  });

  const { windowWidth: mapWidth, mapHeight } = getState().dimensions;

  // calculate the map zoom and center
  L.Map.include({
    getSize: () => new L.Point(mapWidth, mapHeight),
  });
  const map = new L.Map(document.createElement('div'), {
    center: [0, 0],
    zoom: 0,
  });
  const bounds = [[49.2, -124.9], [24.3, -67.3]];
  const featureGroup = new L.FeatureGroup([
    new L.Marker(bounds[0]),
    new L.Marker(bounds[1]),
  ]);
  const zoom = map.getBoundsZoom(featureGroup.getBounds());
  dispatch({
    type: Actions.MOVE_MAP,
    payload: {
      ...getState().map,
      movingTo: {
        zoom,
        center: [37.8, -97.9],
      },
      zoom,
      center: [37.8, -97.9],
      bounds,
      aboveThreshold: false,
      visibleRasters: [],
      visiblePolygons: [],
    },
  });
};

export const zoomIn = () => ({
  type: Actions.ZOOM_IN,
});

export const zoomOut = () => ({
  type: Actions.ZOOM_OUT,
});

export const zoomInADScan = () => ({
  type: Actions.ZOOM_IN_ADSCAN,
});

export const zoomOutADScan = () => ({
  type: Actions.ZOOM_OUT_ADSCAN,
});

export const adSearchingHOLCIds = ids => ({
  type: Actions.SEARCHING_ADS_RESULTS,
  payload: ids,
});

export const searchingADsFor = str => ({
  type: Actions.SEARCHING_ADS,
  payload: str,
});

export const selectText = e => (dispatch, getState) => {
  let selected = e;
  if (typeof e === 'object' && e.target.id) {
    selected = e.target.id;
  }
  if (typeof e === 'object' && e.target.options && e.target.options.id) {
    selected = e.target.options.id;
  }

  if (selected === getState().selectedText) {
    selected = null;
  }

  dispatch({
    type: Actions.SELECT_TEXT,
    payload: selected,
  });
};

//export const updateMap = zoomAndCenter => TheStore.dispatch(mapAction(zoomAndCenter));
export const citySelected = (eOrId) => {
  let id = eOrId;
  if (typeof eOrId === 'object' && eOrId.target.id) {
    id = eOrId.target.id;
  }
  return TheStore.dispatch(selectCity(id));
};
export const gradeSelected = e => TheStore.dispatch(selectGrade(e.target.id));
export const gradeUnselected = () => TheStore.dispatch(selectGrade(null));
export const ringAreaSelected = (e) => {
  const [ring, grade] = e.target.id.split('-');
  return TheStore.dispatch(selectRingArea(parseInt(ring, 10), grade));
};
export const ringAreaUnselected = () => TheStore.dispatch(selectRingArea(null, null));
export const toggleMaps = () => TheStore.dispatch(toggleMapsOnOff());
export const toggleCityStats = () => TheStore.dispatch(toggleCityStatsOnOff());
export const windowResized = () => TheStore.dispatch(recalculateDimensions());
