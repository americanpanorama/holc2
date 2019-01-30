import * as L from 'leaflet';
import TheStore from '.';
import Actions from './ActionTypes';
import calculateDimensions from './CalculateDimensions';
import Rasters from '../../data/Rasters.json';
import Cities from '../../data/Cities.json';

export const selectCity = eOrId => (dispatch, getState) => {
  let id = eOrId;
  if (typeof eOrId === 'object' && eOrId.target.id) {
    id = eOrId.target.id;
  }
  if (typeof eOrId === 'object' && eOrId.target.options && eOrId.target.options.id) {
    id = eOrId.target.options.id;
  }
  // get data from the city that you need for the path and to set the map zoom and center
  const { name, state, year, bounds, centerLat, centerLng } = getState().cities[id];
  const { windowWidth, sidebarWidth, mapHeight } = getState().dimensions;
  const path = `${`${state}-${name}-${year}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;
  const mapWidth = windowWidth - sidebarWidth;

  // calculate the map zoom and center for city
  L.Map.include({
    getSize: () => new L.Point(mapWidth, mapHeight),
  });
  const map = new L.Map(document.createElement('div'), {
    center: [0, 0],
    zoom: 0,
  });
  const featureGroup = new L.FeatureGroup([
    new L.Marker(bounds[0]),
    new L.Marker(bounds[1]),
  ]);
  const zoom = map.getBoundsZoom(featureGroup.getBounds());
  dispatch({
    type: Actions.MOVE_MAP,
    payload: {
      ...getState().map,
      zoom,
      center: [centerLat, centerLng],
      aboveThreshold: true,
    },
  });

  dispatch({
    type: Actions.SELECT_CITY_REQUEST,
  });

  dispatch({
    type: Actions.UNSELECT_AREA,
  });

  return Promise.all([
    fetch(`./static/cities/${path}`),
    fetch(`./static/citiesSelected/${path}`),
  ])
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(responsesJSON => dispatch({
      type: Actions.SELECT_CITY_SUCCESS,
      payload: Object.assign(responsesJSON[0], responsesJSON[1]),
    }));
};

export const selectArea = eOrIds => (dispatch, getState) => {
  let ids = eOrIds;
  if (typeof eOrIds === 'object') {
    const ct = eOrIds.currentTarget || eOrIds.target;
    ids = ct.id || ct.options.id;
  }
  const [adId, holcId] = ids.split('-');

  // load the city if necessary then the neighborhood
  const selectedCity = getState().selectedCity.data;

  if (!selectedCity || selectedCity.id !== parseInt(adId, 10)) {
    const { name, state, year } = getState().cities[adId];
    const path = `${`${state}-${name}-${year}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;
    dispatch({
      type: Actions.SELECT_CITY_REQUEST,
    });

    return Promise.all([
      fetch(`./static/cities/${path}`),
      fetch(`./static/citiesSelected/${path}`),
    ])
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then((responsesJSON) => {
        // update the selected city
        dispatch({
          type: Actions.SELECT_CITY_SUCCESS,
          payload: Object.assign(responsesJSON[0], responsesJSON[1]),
        });
        // update the selected neighborhood
        dispatch({
          type: Actions.SELECT_AREA,
          payload: holcId,
        });
      });
  }

  // if the city is alread loaded just update the selected neighborhood
  if (getState().selectedArea !== holcId) {
    dispatch({
      type: Actions.SELECT_AREA,
      payload: holcId,
    });
  } else {
    dispatch({
      type: Actions.UNSELECT_AREA,
    });
  }

  return null;
};


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

  // 
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

    let { visiblePolygons } = getState().map;

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
    const { selectedCity } = getState();
    if (visibleCityIds.length === 1 &&
      (!selectedCity.data || selectedCity.data.id !== visibleCityIds[0])) {
      const { name, state, year } = getState().cities[visibleCityIds[0]];
      const path = `${`${state}-${name}-${year}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;

      // load both the city and the polygons
      dispatch({
        type: Actions.SELECT_CITY_REQUEST,
      });

      dispatch({
        type: Actions.LOADING_POLYGONS,
      });

      return Promise.all([
        fetch(`./static/cities/${path}`),
        fetch(`./static/citiesSelected/${path}`),
      ])
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then((responsesJSON) => {
          const cityData = responsesJSON[0];
          const citySelectedData = responsesJSON[1];
          dispatch({
            type: Actions.SELECT_CITY_SUCCESS,
            payload: Object.assign(cityData, citySelectedData),
          });

          const cityPolygons = Object.keys(cityData.polygons)
            .map(id => cityData.polygons[id])
            .map(p => ({ ...p, ad_id: cityData.id }));
          dispatch({
            type: Actions.LOADED_POLYGONS,
            payload: cityPolygons,
          });
        });
    }

    // get the current cities id
    const extantCityIds = [...new Set(visiblePolygons.map(p => p.ad_id))];

    // drop those that aren't visible anymore
    visiblePolygons = visiblePolygons.filter(p => visibleCityIds.includes(p.ad_id));

    // add those that haven't been loaded
    const newCities = visibleCities.filter(c => !extantCityIds.includes(c.ad_id));

    if (newCities.length > 0) {
      const cityFiles = newCities.map(c => `./static/cities/${c.state}-${c.name}-${c.year}.json`);

      dispatch({
        type: Actions.LOADING_POLYGONS,
      });

      return Promise.all(cityFiles.map(f => fetch(f)))
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then((responsesJSON) => {
          responsesJSON.forEach((c) => {
            const cityPolygons = Object.keys(c.polygons)
              .map(id => c.polygons[id])
              .map(p => ({ ...p, ad_id: c.id }));
            visiblePolygons = visiblePolygons.concat(cityPolygons);
          });

          dispatch({
            type: Actions.LOADED_POLYGONS,
            payload: visiblePolygons,
          });
        });
    } else {
      dispatch({
        type: Actions.LOADED_POLYGONS,
        payload: visiblePolygons,
      });
    }
  }
};


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

export const toggleADTranscription = () => ({
  type: Actions.TOGGLE_AD_TRANSCRIPTION,
});

export const resetMapView = () => (dispatch, getState) => {
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
  const featureGroup = new L.FeatureGroup([
    new L.Marker([49.2, -124.9]),
    new L.Marker([24.3, -67.3]),
  ]);
  const zoom = map.getBoundsZoom(featureGroup.getBounds());
  dispatch({
    type: Actions.MOVE_MAP,
    payload: {
      ...getState().map,
      zoom,
      center: [37.8, -97.9],
      aboveThreshold: false,
    },
  });
};

export const zoomIn = () => ({
  type: Actions.ZOOM_IN,
});

export const zoomOut = () => ({
  type: Actions.ZOOM_OUT,
});

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
