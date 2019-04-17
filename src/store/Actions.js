import * as L from 'leaflet';
import { geoContains } from 'd3';
import TheStore from '.';
import Actions from './ActionTypes';
import calculateDimensions from './CalculateDimensions';
import Rasters from '../../data/Rasters.json';

import { getSelectedCityData } from './selectors';

// UTILITY FUNCTIONS
const getCityFilePath = (adId, cities) => {
  const { name, state, year } = cities.find(c => c.ad_id === adId);
  return `${`${state}${name}${year}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;
};

const getEventId = (eOrId, type = 'string') => {
  let id = eOrId;
  if (typeof eOrId === 'object') {
    const ct = eOrId.currentTarget || eOrId.target;
    id = ct.id || ct.options.id;
  }
  return (type === 'number') ? parseInt(id, 10) : id;
};

// calculates the offset center and zoom offset to account for the data viewer
const calculateCenterAndZoom = (bounds, dimensions) => {
  const { windowWidth: mapWidth, mapHeight, dataViewerWidth, size } = dimensions;
  L.Map.include({
    getSize: () => new L.Point(mapWidth, mapHeight),
  });
  const map = L.map(document.createElement('div'), {
    center: [0, 0],
    zoom: 0,
  });
  const horizontalOffsetRatio = (size !== 'mobile')
    ? ((dataViewerWidth + 40) / mapWidth) / ((mapWidth - (dataViewerWidth + 40)) / mapWidth) :
    0;
  const verticalOffsetRatio = (size !== 'mobile') ? 0  : 2;
  const offsetLng = bounds[0][1] - (bounds[1][1] - bounds[0][1]) * horizontalOffsetRatio;
  const offsetLat = bounds[0][0] - (bounds[1][0] - bounds[0][0]) * verticalOffsetRatio;
  const offsetBounds = new L.FeatureGroup([
    new L.Marker([offsetLat, offsetLng]),
    new L.Marker(bounds[1]),
  ]);

  const polygonBounds = offsetBounds.getBounds();
  const { lat, lng } = polygonBounds.getCenter();
  const zoom = map.getBoundsZoom(polygonBounds);
  return {
    lat,
    lng,
    zoom,
  };
};

// ACTIONS

export const selectCategory = (eOrId) => {
  const id = getEventId(eOrId);
  return {
    type: Actions.SELECT_CATEGORY,
    payload: id,
  };
};

export const unselectCategory = () => ({
  type: Actions.UNSELECT_CATEGORY,
});

export const selectCity = (eOrId, coords) => (dispatch, getState) => {
  const id = getEventId(eOrId, 'number');

  // get data from the city that you need for the path and to set the map zoom and center
  const { cities, dimensions, map, selectedCity, loadingCity } = getState();

  // do nothing if it's alreeady loaded or is being loaded
  if (selectedCity === id || loadingCity === id) {
    return null;
  }

  const { bounds } = cities.find(c => c.ad_id === id);
  const path = getCityFilePath(id, cities);
  const { lat, lng, zoom } = coords || calculateCenterAndZoom(bounds, dimensions);

  dispatch({
    type: Actions.SELECT_CITY_REQUEST,
    payload: id,
  });

  dispatch({
    type: Actions.MOVE_MAP,
    payload: {
      ...map,
      zoom,
      center: [lat, lng],
      aboveThreshold: true,
      movingTo: {
        zoom,
        center: [lat, lng],
      },
    },
  });

  return fetch(`./static/ADs/${path}`)
    .then(() => {
      dispatch({
        type: Actions.SELECT_CITY_SUCCESS,
        payload: id,
      });
    })
    .catch((err) => {
      console.warn('Fetch Error :-S', err);
    });
};


export const selectArea = eOrId => (dispatch, getState) => {
  const ids = getEventId(eOrId);
  const [adId, holcId] = ids.split('-').map((v, i) => (
    (i === 0) ? parseInt(v, 10) : v
  ));

  const { selectedCity, selectedCategory, selectedArea, cities, showADScan } = getState();
  const cityData = getSelectedCityData(getState());
  // load the city if necessary then the neighborhood
  if (selectedCity !== adId) {
    dispatch({
      type: Actions.SELECT_CITY_SUCCESS,
      payload: adId,
    });

    return fetch(`./static/ADs/${getCityFilePath(adId, cities)}`)
      .then(response => response.json())
      .then((ads) => {
        dispatch({
          type: Actions.LOAD_ADS,
          payload: ads,
        });
        // update the selected neighborhood
        dispatch({
          type: Actions.SELECT_AREA,
          payload: holcId,
        });

        dispatch({
          type: Actions.HIGHLIGHT_AREAS,
          payload: [{
            adId,
            holcId,
          }],
        });

        // if not yet transcribed, show the ad scan
        if (selectedCity && selectedCity.hasImages && !selectedCity.hasADs && !showADScan) {
          dispatch({
            type: Actions.TOGGLE_AD_SCAN,
          });
        }
      })
      .catch((err) => {
        console.warn('Fetch Error :-S', err);
      });
  }

  // if the city is alread loaded just update the selected neighborhood
  dispatch({
    type: Actions.SELECT_AREA,
    payload: (selectedArea !== holcId || selectedCategory) ? holcId : null,
  });

  dispatch({
    type: Actions.HIGHLIGHT_AREAS,
    payload: (selectedArea !== holcId || selectedCategory) ? [{
      adId,
      holcId,
    }] : [],
  });
  
  // if not yet transcribed, show the ad scan
  if (cityData.hasImages && !cityData.hasADs && !showADScan && (selectedArea !== holcId)) {
    dispatch({
      type: Actions.TOGGLE_AD_SCAN,
    });
  }
  return null;
};

export const highlightArea = (eOrId) => {
  const ids = getEventId(eOrId);
  const [adId, holcId] = ids.split('-').map((v, i) => (
    (i === 0) ? parseInt(v, 10) : v
  ));
  return {
    type: Actions.HIGHLIGHT_AREAS,
    payload: [{
      adId,
      holcId,
    }],
  };
};

export const unhighlightArea = () => (dispatch, getState) => {
  const { adSearchHOLCIds } = getState();
  if (adSearchHOLCIds && adSearchHOLCIds.length > 0) {
    dispatch({
      type: Actions.SEARCHING_ADS_RESULTS,
      payload: adSearchHOLCIds,
    });
  } else {
    dispatch({
      type: Actions.UNHIGHLIGHT_AREA,
    });
  }
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
    const { cities } = getState();
    const latLngBounds = L.latLngBounds([...mapState.bounds]);

    const visibleRasters = Rasters.filter(raster => (
      raster.bounds && raster.bounds[0][0] && latLngBounds.intersects(raster.bounds)
    ));

    const visibleCityIds = cities
      .filter(c => c.bounds && latLngBounds.intersects(c.bounds))
      .map(c => c.ad_id);

    // if there aren't any cities visible, clear the selected city
    if (visibleCityIds.length === 0) {
      dispatch({
        type: Actions.SELECT_CITY_SUCCESS,
        payload: null,
      });
      return null;
    }

    const { map, selectedCity, loadingCity } = getState();
    const { visiblePolygons } = map;

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
    if (visibleCityIds.length === 1 && selectedCity !== visibleCityIds[0]
      && loadingCity !== visibleCityIds[0]) {
      const path = getCityFilePath(visibleCityIds[0], cities);

      // load both the city and the polygons
      dispatch({
        type: Actions.SELECT_CITY_REQUEST,
        payload: visibleCityIds[0],
      });

      dispatch({
        type: Actions.LOADING_POLYGONS,
        payload: [visibleCityIds[0]],
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

          dispatch({
            type: Actions.LOADED_POLYGONS,
            payload: polygons,
          });
        });
    }

    // get the current, old, and new cities id of the polygons
    const cityIdsExtant = [...new Set(visiblePolygons.map(p => p.ad_id))];
    const cityIdsToDrop = cityIdsExtant.filter(id => !visibleCityIds.includes(id));
    const cityIdsToAdd = visibleCityIds.filter(adId => !cityIdsExtant.includes(adId)
      && !map.loadingPolygonsFor.includes(adId));

    // if there's nothing to update, stop
    if (cityIdsToDrop.length === 0 && cityIdsToAdd.length === 0) {
      return null;
    }

    // drop those that aren't visible anymore
    let updatedVisiblePolygons = visiblePolygons;
    if (cityIdsToDrop.length > 0) {
      updatedVisiblePolygons = updatedVisiblePolygons.filter(p => !cityIdsToDrop.includes(p.ad_id));
    }

    // deselect city if it's no longer visible
    if (selectedCity && !updatedVisiblePolygons.includes(selectedCity)) {
      dispatch({
        type: Actions.UNSELECT_CITY,
      });
    }

    // update if there isn't anything to add
    // otherwise, load the polygon files
    if (cityIdsToAdd.length === 0) {
      dispatch({
        type: Actions.LOADED_POLYGONS,
        payload: updatedVisiblePolygons,
      });
    } else {
      const paths = cityIdsToAdd.map(adId => `./static/polygons/${getCityFilePath(adId, cities)}`);

      dispatch({
        type: Actions.LOADING_POLYGONS,
        payload: cityIdsToAdd,
      });

      return Promise.all(paths.map(fp => fetch(fp)))
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then((cityPolygons) => {
          cityPolygons.forEach((polygons) => {
            updatedVisiblePolygons = updatedVisiblePolygons.concat(polygons);
          });

          dispatch({
            type: Actions.LOADED_POLYGONS,
            payload: updatedVisiblePolygons,
          });
        });
    }
  }
  return null;
};

export const updateADScan = adScanState => ({
  type: Actions.MOVE_ADSCAN,
  payload: adScanState,
});

export const selectGrade = e => (dispatch, getState) => {
  const grade = e.target.id;
  dispatch({
    type: Actions.SELECT_GRADE,
    payload: grade,
  });

  const { selectedCity, map } = getState();
  const { visiblePolygons } = map;
  if (visiblePolygons.length > 0) {
    const highlightedPolygons = visiblePolygons
      .filter(p => p.ad_id === selectedCity && p.grade === grade)
      .map(p => ({
        adId: p.ad_id,
        holcId: p.id,
      }));
    dispatch({
      type: Actions.HIGHLIGHT_AREAS,
      payload: highlightedPolygons,
    });
  }
};

export const unselectGrade = () => (dispatch, getState) => {
  dispatch({
    type: Actions.SELECT_GRADE,
    payload: null,
  });

  const { adSearchHOLCIds } = getState();
  if (adSearchHOLCIds && adSearchHOLCIds.length > 0) {
    dispatch({
      type: Actions.SEARCHING_ADS_RESULTS,
      payload: adSearchHOLCIds,
    });
  } else {
    dispatch({
      type: Actions.UNHIGHLIGHT_AREA,
    });
  }
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
  const center = [37.8, -97.9];
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
        center,
      },
      zoom,
      center,
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

export const userLocated = (position, selectFromPosition, moveMap) => (dispatch, getState) => {
  dispatch({
    type: Actions.LOCATED_USER,
    payload: position,
  });

  const PythagorasEquirectangular = (lat1, lon1, lat2, lon2) => {
    const Deg2Rad = deg => deg * Math.PI / 180;
    const lat1R = Deg2Rad(lat1);
    const lat2R = Deg2Rad(lat2);
    const lon1R = Deg2Rad(lon1);
    const lon2R = Deg2Rad(lon2);
    const R = 6371; // km
    const x = (lon2R - lon1R) * Math.cos((lat1R + lat2R) / 2);
    const y = (lat2R - lat1R);
    const d = Math.sqrt(x * x + y * y) * R;
    return d;
  };

  // locate the closest city
  if (selectFromPosition) {
    const cityDists = getState().cities
      .filter(c => c.centerLat && c.centerLng)
      .map(c => ({
        ad_id: c.ad_id,
        dist: PythagorasEquirectangular(c.centerLat, c.centerLng, position[0], position[1]),
      }))
      .sort((a, b) => a.dist - b.dist);
    if (cityDists[0].dist <= 20) {
      const id = cityDists[0].ad_id;
      // get data from the city that you need for the path and to set the map zoom and center
      const { cities, dimensions, map } = getState();
      const { bounds } = cities.find(c => c.ad_id === id);
      const path = getCityFilePath(id, cities);
      const { lat, lng, zoom } = calculateCenterAndZoom(bounds, dimensions);

      dispatch({
        type: Actions.SELECT_CITY_REQUEST,
        payload: id,
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
            payload: id,
          });

          if (moveMap) {
            dispatch({
              type: Actions.MOVE_MAP,
              payload: {
                ...map,
                zoom,
                center: [lat, lng],
                aboveThreshold: true,
                visiblePolygons: polygons,
                movingTo: {
                  zoom,
                  center: [lat, lng],
                },
              },
            });
          }

          dispatch({
            type: Actions.LOAD_ADS,
            payload: ads,
          });

          // test to see if you can select the polygon
          polygons.every((p) => {
            if (geoContains(p.area_geojson, [position[1], position[0]])) {
              dispatch({
                type: Actions.SELECT_AREA,
                payload: p.id,
              });
              return false;
            }
            return true;
          });
        });
    }
  }

  return null;
};

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

export const gradeUnselected = () => TheStore.dispatch(selectGrade(null));
export const toggleMaps = () => TheStore.dispatch(toggleMapsOnOff());
export const toggleCityStats = () => TheStore.dispatch(toggleCityStatsOnOff());
export const windowResized = () => TheStore.dispatch(recalculateDimensions());
