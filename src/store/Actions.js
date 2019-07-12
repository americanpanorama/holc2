import { batchActions } from 'redux-batched-actions';
import * as L from 'leaflet';
import leafletPip from '@mapbox/leaflet-pip';
import { pointInPolygon } from 'geojson-utils';
import TheStore from '.';
import Actions from './ActionTypes';
import calculateDimensions from './CalculateDimensions';
import Rasters from '../../data/Rasters.json';
import { BUCKET_URL } from '../../data/constants';

import { getSelectedCityData } from './selectors';

// UTILITY FUNCTIONS
const getCityFilePath = (adId, cities) => {
  const { name, state, year } = cities.find(c => c.ad_id === adId);
  return `${`${state}${name}${year}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;
};

const getEventId = (eOrId, type = 'string') => {
  let id = eOrId.id || eOrId;
  if (!eOrId.id && typeof eOrId === 'object') {
    const ct = eOrId.currentTarget || eOrId.target;
    id = ct.id || ct.options.id;
  }
  return (type === 'number') ? parseInt(id, 10) : id;
};

const getNSWE = bounds => ({
  n: Math.max(bounds[0][0], bounds[1][0]),
  s: Math.min(bounds[0][0], bounds[1][0]),
  e: Math.max(bounds[0][1], bounds[1][1]),
  w: Math.min(bounds[0][1], bounds[1][1]),
});

// calculates the expanded bounds to offset the map to account for the data viewer
const calculateOffsetBounds = (bounds, dimensions) => {
  const { windowWidth: mapWidth, dataViewerWidth, media } = dimensions;
  let { n, s, e, w } = getNSWE(bounds);
  if (media !== 'phone' && media !== 'tablet-portrait') {
    const horizontalOffsetRatio = (dataViewerWidth + 40) / mapWidth;
    w -= (e - w) * horizontalOffsetRatio;
  } else {
    // this bit of extra offset creates some paddinb between the bounds and the data viewer
    s -= (n - s) * 1.15;
  }
  return [[n, w], [s, e]];
};

// calculates the reduced bounds of the functionally viewable map accounting for the data viewer
const calculateInsetBounds = (bounds, dimensions) => {
  const { windowWidth: mapWidth, dataViewerWidth, media } = dimensions;
  let { n, s, e, w } = getNSWE(bounds);
  if (media !== 'phone' && media !== 'tablet-portrait') {
    const horizontalOffsetRatio = (dataViewerWidth + 40) / mapWidth;
    w += (e - w) * horizontalOffsetRatio;
  } else {
    s += (n - s) / 2.3;
  }
  return [[n, w], [s, e]];
};

// calculates the offset center and zoom offset to account for the data viewer
const calculateCenterAndZoom = (bounds, dimensions) => {
  const { windowWidth: mapWidth, mapHeight } = dimensions;
  const map = L.map(document.createElement('div'), {
    center: [0, 0],
    zoom: 0,
  });
  const { n, s, e, w } = getNSWE(bounds);
  const offsetBounds = L.latLngBounds(calculateOffsetBounds([[n, w], [s, e]], dimensions));
  const { lat, lng } = offsetBounds.getCenter();
  const zoom = map.getBoundsZoom(offsetBounds, false, [mapWidth * -1, mapHeight * -1]);
  return {
    lat,
    lng,
    zoom,
  };
};

const centerAndZoomIncluding = (containingBounds, containedBounds, dimensions) => {
  if (containedBounds && containedBounds[0] && containedBounds[0][0]) {
    const areaIsVisible = L.latLngBounds(containingBounds).contains(containedBounds);
    if (!areaIsVisible) {
      const newLatLngBounds = L.latLngBounds(containingBounds).extend(containedBounds);
      const newBounds = [
        [newLatLngBounds.getNorth(), newLatLngBounds.getWest()],
        [newLatLngBounds.getSouth(), newLatLngBounds.getEast()],
      ];
      return calculateCenterAndZoom(newBounds, dimensions);
    }
  }

  return null;
};

const centerAndZoomIntersects = (boundsA, boundsB, dimensions) => {
  if (boundsB && boundsB[0] && boundsB[0][0]) {
    const areaIsVisible = L.latLngBounds(boundsA).contains(boundsB)
      || L.latLngBounds(boundsA).overlaps(boundsB);
    if (!areaIsVisible) {
      const newLatLngBounds = L.latLngBounds(boundsA).extend(boundsB);
      const newBounds = [
        [newLatLngBounds.getNorth(), newLatLngBounds.getWest()],
        [newLatLngBounds.getSouth(), newLatLngBounds.getEast()],
      ];
      return calculateCenterAndZoom(newBounds, dimensions);
    }
  }

  return null;
};

const getAreaPolygon = (adId, holcId, visiblePolygons) => (
  visiblePolygons.find(vp => vp.id === holcId && vp.ad_id === adId)
);

const getAreaPolygonBB = (adId, holcId, visiblePolygons) => {
  const areaPolygon = getAreaPolygon(adId, holcId, visiblePolygons);
  return (areaPolygon && areaPolygon.polygonBoundingBox) ? areaPolygon.polygonBoundingBox : null;
};

const calculateRoughArea = (bounds) => {
  const { n, s, e, w } = getNSWE(bounds);
  return (n - s) * (e - w);
};

const getSelectableRasterBoundaries = (boundaries, mapBounds, cities, dimensions) => {
  const visibleAreaish = calculateRoughArea(calculateInsetBounds(mapBounds, dimensions));
  return boundaries
    .filter((b) => {
      const cityData = cities.find(c => c.ad_id === b.ad_id);
      const cityAreaish = calculateRoughArea(cityData.bounds);
      return cityAreaish / visibleAreaish <= 0.075;
    })
    .map(b => b.ad_id);
};

// ACTIONS

export const loadInitialData = () => (dispatch, getState) => {
  const { hash } = window.location;
  const hashValues = {};
  hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    hashValues[key] = value;
  });
  const actions = [];

  if (!hashValues.nogeo && navigator.geolocation) {
    dispatch({
      type: Actions.GEOLOCATING,
    });
    navigator.geolocation.getCurrentPosition((position) => {
      // only select from position if a city isn't specified, a location isn't specified
      const geolocationActions = [];
      geolocationActions.push({
        type: Actions.LOCATED_USER,
        payload: [position.coords.latitude, position.coords.longitude],
      });

      // locate the closest city
      if (!hashValues.city && !hashValues.loc && !hashValues.area) {
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

        // calculate closest city
        const { cities } = getState();
        const cityDists = cities
          .filter(c => c.centerLat && c.centerLng)
          .map(c => ({
            ad_id: c.ad_id,
            dist: PythagorasEquirectangular(c.centerLat, c.centerLng, position.coords.latitude, position.coords.longitude),
          }))
          .sort((a, b) => a.dist - b.dist);
        if (cityDists[0].dist <= 20 && cityDists[0] !== hashValues.city) {
          const id = cityDists[0].ad_id;
          // get data from the city that you need for the path and to set the map zoom and center
          const path = getCityFilePath(id, cities);

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
              const cityPolygons = responsesJSON[0];
              cityPolygons.boundaries = (cityPolygons.boundary) ? [cityPolygons.boundary] : [];
              const ads = responsesJSON[1];
              const { dimensions, map } = getState();
              const { bounds } = cities.find(c => c.ad_id === id);
              const { lat, lng, zoom } = calculateCenterAndZoom(bounds, dimensions);

              geolocationActions.push(
                {
                  type: Actions.SELECT_CITY_SUCCESS,
                  payload: id,
                },
                {
                  type: Actions.LOAD_ADS,
                  payload: ads,
                },
              );

              if (!hashValues.loc) {
                geolocationActions.push({
                  type: Actions.MOVE_MAP,
                  payload: {
                    zoom,
                    center: [lat, lng],
                    aboveThreshold: true,
                    visiblePolygons: cityPolygons.polygons,
                    visibleBoundaries: cityPolygons.boundaries,
                    visibleRasterPolygons: cityPolygons.rasterBoundaries,
                    selectableRasterBoundaries: getSelectableRasterBoundaries(cityPolygons.rasterBoundaries, map.bounds, cities, dimensions),
                    movingTo: {
                      zoom,
                      center: [lat, lng],
                    },
                  },
                });
              }

              // test to see if you can select the polygon
              cityPolygons.polygons.every((p) => {
                const geojsonPoint = {
                  type: 'Point',
                  coordinates: [position.coords.longitude, position.coords.latitude],
                };
                if (pointInPolygon(geojsonPoint, p.area_geojson)) {
                  geolocationActions.push({
                    type: Actions.SELECT_AREA,
                    payload: p.id,
                  });
                  return false;
                }
                return true;
              });

              dispatch(batchActions(geolocationActions));
            });
        }
      } else {
        dispatch(geolocationActions[0]);
      }
    }, (error) => {
      dispatch({
        type: Actions.GEOLOCATION_ERROR,
        payload: error,
      });
    });
  }
  if (hashValues.city) {
    const { cities } = getState();
    const adId = cities.find(c => c.slug === hashValues.city).ad_id;
    const path = getCityFilePath(adId, cities);

    return Promise.all([
      fetch(`./static/polygons/${path}`),
      fetch(`./static/ADs/${path}`),
    ])
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then((responsesJSON) => {
        const cityPolygons = responsesJSON[0];
        cityPolygons.boundaries = (cityPolygons.boundary) ? [cityPolygons.boundary] : [];
        const ads = responsesJSON[1];

        actions.push({
          type: Actions.SELECT_CITY_SUCCESS,
          payload: adId,
        });
        actions.push({
          type: Actions.LOAD_ADS,
          payload: ads,
        });
        actions.push({
          type: Actions.LOADED_POLYGONS,
          payload: cityPolygons,
        });

        if (hashValues.area) {
          actions.push({
            type: Actions.SELECT_AREA,
            payload: hashValues.area,
          });
          actions.push({
            type: Actions.HIGHLIGHT_AREAS,
            payload: [{
              adId,
              holcId: hashValues.area,
            }],
          });
        }

        if (hashValues.category) {
          actions.push({
            type: Actions.SELECT_CATEGORY,
            payload: hashValues.category,
          });
        }

        actions.push({
          type: Actions.INITIALIZED,
        });

        dispatch(batchActions(actions));
      });
  } else {
    dispatch({
      type: Actions.INITIALIZED,
    });
  }
};

export const selectCategory = eOrId => ({
  type: Actions.SELECT_CATEGORY,
  payload: getEventId(eOrId),
});

export const unselectCategory = () => ({
  type: Actions.UNSELECT_CATEGORY,
});

export const selectCity = (eOrId, coords) => (dispatch, getState) => {
  const id = getEventId(eOrId, 'number');

  // get data from the city that you need for the path and to set the map zoom and center
  const { cities, dimensions, map, selectedCity, loadingCity } = getState();
  const { loadingPolygonsFor, zoom: currentZoom } = map;

  const path = getCityFilePath(id, cities);
  const { bounds } = cities.find(c => c.ad_id === id);
  const { lat, lng, zoom } = coords || calculateCenterAndZoom(bounds, dimensions);

  // if it's alreeady loaded or is being loaded test to see if you need to zoom
  if (selectedCity === id || loadingCity === id) {
    if (currentZoom <= 11) {
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
    }
    return null;
  }

  // move the map and request the city data

  dispatch(batchActions([
    {
      type: Actions.SELECT_CITY_REQUEST,
      payload: id,
    },
    {
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
    },
  ]));

  const filesToLoad = (loadingPolygonsFor !== id)
    ? [`./static/ADs/${path}`, `./static/polygons/${path}`]
    : [`./static/ADs/${path}`];

  return Promise.all(filesToLoad.map(ftl => fetch(ftl)))
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then((responsesJSON) => {
      const ads = responsesJSON[0];
      const cityPolygons = responsesJSON[1];
      cityPolygons.boundaries = (cityPolygons.boundary) ? [cityPolygons.boundary] : [];

      const actions = [
        {
          type: Actions.LOAD_ADS,
          payload: ads,
        },
        {
          type: Actions.SELECT_CITY_SUCCESS,
          payload: id,
        },
      ];

      if (cityPolygons) {
        actions.push({
          type: Actions.LOADED_POLYGONS,
          payload: cityPolygons,
        });
      }

      dispatch(batchActions(actions));
    })
    .catch((err) => {
      console.warn('Fetch Error :-S', err);
    });
};

export const unselectCity = () => ({
  type: Actions.UNSELECT_CITY,
});

export const inspectArea = (eOrId) => {
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

export const selectArea = eOrId => (dispatch, getState) => {
  // don't do anything if sorting maps
  if (getState().map.sorting) {
    return null;
  }

  const ids = getEventId(eOrId);
  const [adId, holcId] = ids.split('-').map((v, i) => (
    (i === 0) ? parseInt(v, 10) : v
  ));

  const actions = [];
  const { selectedCity, selectedCategory, selectedArea, cities, showADScan, map, dimensions } = getState();
  const { bounds, visiblePolygons } = map;
  const cityData = getSelectedCityData(getState());

  const newCenterAndZoom = centerAndZoomIncluding(calculateInsetBounds(bounds, dimensions),
    getAreaPolygonBB(adId, holcId, visiblePolygons), dimensions);
  if (newCenterAndZoom) {
    const { lat, lng, zoom } = newCenterAndZoom;
    actions.push({
      type: Actions.MOVE_MAP,
      payload: {
        ...map,
        zoom,
        highlightedPolygons: [{
          adId,
          holcId,
        }],
        center: [lat, lng],
        movingTo: {
          zoom,
          center: [lat, lng],
        },
      },
    });
  }

  // load the city if necessary then the neighborhood
  if (selectedCity !== adId) {
    return fetch(`./static/ADs/${getCityFilePath(adId, cities)}`)
      .then(response => response.json())
      .then((ads) => {
        actions.push(
          {
            type: Actions.SELECT_CITY_SUCCESS,
            payload: adId,
          },
          {
            type: Actions.LOAD_ADS,
            payload: ads,
          },
          // update the selected neighborhood
          {
            type: Actions.SELECT_AREA,
            payload: holcId,
          },
        );

        // if not yet transcribed, show the ad scan
        if (selectedCity && selectedCity.hasImages && !selectedCity.hasADs && !showADScan) {
          actions.push({
            type: Actions.TOGGLE_AD_SCAN,
          });
        } else {
          actions.push({
            type: Actions.HIGHLIGHT_AREAS,
            payload: [{
              adId,
              holcId,
            }],
          });
        }

        dispatch(batchActions(actions));
      })
      .catch((err) => {
        console.warn('Fetch Error :-S', err);
      });
  }

  // if the city is alread loaded just update the selected neighborhood
  actions.push({
    type: Actions.SELECT_AREA,
    payload: (selectedArea !== holcId || selectedCategory) ? holcId : null,
  });
  
  // if not yet transcribed, show the ad scan
  if (cityData.hasImages && !cityData.hasADs && !showADScan && (selectedArea !== holcId)) {
    actions.push({
      type: Actions.TOGGLE_AD_SCAN,
    });
  } else {
    actions.push({
      type: Actions.HIGHLIGHT_AREAS,
      payload: (selectedArea !== holcId || selectedCategory) ? [{
        adId,
        holcId,
      }] : [],
    });
  }

  dispatch(batchActions(actions));
  return null;
};

export const zoomToArea = eOrId => (dispatch, getState) => {
  const ids = getEventId(eOrId);
  const [adId, holcId] = ids.split('-').map((v, i) => (
    (i === 0) ? parseInt(v, 10) : v
  ));
  const { map, dimensions } = getState();
  const { visiblePolygons } = map;

  // get the bounding box for the polygon
  const areaPolygon = visiblePolygons.find(vp => vp.id === holcId && vp.ad_id === adId);
  if (areaPolygon && areaPolygon.polygonBoundingBox) {
    const { lat, lng, zoom } = calculateCenterAndZoom(areaPolygon.polygonBoundingBox, dimensions);
    dispatch({
      type: Actions.MOVE_MAP,
      payload: {
        ...map,
        zoom,
        center: [lat, lng],
        movingTo: {
          zoom,
          center: [lat, lng],
        },
      },
    });
  }
};

export const zoomToCity = eOrId => (dispatch, getState) => {
  const adId = getEventId(eOrId, 'number');
  const { cities, map, dimensions } = getState();
  const cityData = cities.find(c => c.ad_id === adId);

  const { lat, lng, zoom } = calculateCenterAndZoom(cityData.bounds, dimensions);
  dispatch({
    type: Actions.MOVE_MAP,
    payload: {
      ...map,
      zoom,
      center: [lat, lng],
      movingTo: {
        zoom,
        center: [lat, lng],
      },
    },
  });
};

export const highlightArea = eOrId => (dispatch, getState) => {
  const ids = getEventId(eOrId);
  const [adId, holcId] = ids.split('-').map((v, i) => (
    (i === 0) ? parseInt(v, 10) : v
  ));
  const highlightedPolygons = [{
    adId,
    holcId,
  }];
  // if there's a selected Area, it stays highlighted
  const { selectedArea, selectedCity, map, dimensions } = getState();
  if (selectedArea && selectedArea !== holcId && selectedCity) {
    highlightedPolygons.push({
      adId: selectedCity,
      holcId: selectedArea,
    });
  }

  const actions = [];
  // calcuate if map movement is necessary
  const { bounds, visiblePolygons } = map;
  const newCenterAndZoom = centerAndZoomIntersects(calculateInsetBounds(bounds, dimensions),
    getAreaPolygonBB(adId, holcId, visiblePolygons), dimensions);
  if (newCenterAndZoom) {
    const { lat, lng, zoom } = newCenterAndZoom;
    actions.push({
      type: Actions.MOVE_MAP,
      payload: {
        ...map,
        zoom,
        center: [lat, lng],
        movingTo: {
          zoom,
          center: [lat, lng],
        },
      },
    });
  }

  actions.push({
    type: Actions.HIGHLIGHT_AREAS,
    payload: highlightedPolygons,
  });

  dispatch(batchActions(actions));
};

export const unhighlightArea = eOrId => (dispatch, getState) => {
  const { adSearchHOLCIds, selectedArea, selectedCity, map } = getState();
  const { highlightedPolygons } = map;
  // check to see if it's selected--if it isn't don't unhighlight it
  let adId;
  let holcId;
  if (eOrId && selectedArea) {
    const ids = getEventId(eOrId);
    [adId, holcId] = ids.split('-').map((v, i) => (
      (i === 0) ? parseInt(v, 10) : v
    ));
    const updatedHighlightedPolygons = (adId === selectedCity && holcId === selectedArea)
      ? highlightedPolygons
      : highlightedPolygons.filter(hp => (hp.adId !== adId || hp.holcId !== holcId));
    dispatch({
      type: Actions.HIGHLIGHT_AREAS,
      payload: updatedHighlightedPolygons,
    });
  } else {
    const isSelected = !eOrId || (adId === selectedCity && holcId === selectedArea);
    if (adSearchHOLCIds && adSearchHOLCIds.length > 0) {
      dispatch({
        type: Actions.SEARCHING_ADS_RESULTS,
        payload: adSearchHOLCIds,
      });
    } else if (!isSelected) {
      dispatch({
        type: Actions.UNHIGHLIGHT_AREA,
      });
    }
  }
};

export const unselectArea = () => ({
  type: Actions.UNSELECT_AREA,
});

export const mapMoveEnd = () => ({
  type: Actions.MOVE_MAP_END,
});

export const geolocating = () => ({
  type: Actions.GEOLOCATING,
});

export const geolocationFailed = () => ({
  type: Actions.GEOLOCATION_ERROR,
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
        visibleRasterPolygons: [],
        selectableRasterBoundaries: [],
        visibleBoundaries: [],
      },
    });
    return null;
  }

  const { cities, map, visibleCities: currentVisibleCities, dimensions } = getState();
  const latLngBounds = L.latLngBounds([...mapState.bounds]);

  // see if there's an existing sort order for the rasters
  const sortOrder = map.visibleRasters
    .filter(m => m.overlaps)
    .map(m => m.id);

  const visibleRasters = Rasters
    .filter(raster => (
      raster.bounds && raster.bounds[0][0] && latLngBounds.intersects(raster.bounds)
    ))
    .map(raster => ({
      ...raster,
      url: `${BUCKET_URL}/tiles/${raster.state}/${raster.file_name}/${raster.year}/{z}/{x}/{y}.png`,
    }))
    .sort((a, b) => {
      if (sortOrder.includes(a.id) && sortOrder.includes(b.id)) {
        return sortOrder.findIndex(id => id === a.id) - sortOrder.findIndex(id => id === b.id);
      }
      return 0;
    });

  const visibleCityIds = cities
    .filter(c => c.bounds && latLngBounds.intersects(c.bounds))
    .map(c => c.ad_id);

  // if there aren't any cities visible, clear the selected city
  if (visibleCityIds.length === 0) {
    dispatch({
      type: Actions.UNSELECT_CITY,
    });
    return null;
  }

  const { selectedCity, loadingCity } = getState();
  const { visiblePolygons, visibleBoundaries, visibleRasterPolygons } = map;

  // execute to load rasters before the async task of loading new polygons or city
  dispatch({
    type: Actions.MOVE_MAP,
    payload: {
      ...mapState,
      aboveThreshold,
      visibleRasters,
      visiblePolygons,
      visibleBoundaries,
      visibleRasterPolygons,
      selectableRasterBoundaries: getSelectableRasterBoundaries(visibleRasterPolygons, mapState.bounds, cities, dimensions),
    },
  });

  if (currentVisibleCities.length !== visibleCityIds.length
    || !currentVisibleCities.every(id => visibleCityIds.includes(id))) {
    dispatch({
      type: Actions.UPDATE_VISIBLE_CITIES,
      payload: visibleCityIds,
    });
  }

  // select the city if there's only one and it's not already selected
  if (visibleCityIds.length === 1 && selectedCity !== visibleCityIds[0]
    && loadingCity !== visibleCityIds[0]) {
    const path = getCityFilePath(visibleCityIds[0], cities);

    // load both the city and the polygons
    dispatch(batchActions([
      {
        type: Actions.SELECT_CITY_REQUEST,
        payload: visibleCityIds[0],
      },
      {
        type: Actions.LOADING_POLYGONS,
        payload: [visibleCityIds[0]],
      },
    ]));

    return Promise.all([
      fetch(`./static/polygons/${path}`),
      fetch(`./static/ADs/${path}`),
    ])
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then((responsesJSON) => {
        const cityPolygons = responsesJSON[0];
        cityPolygons.boundaries = (cityPolygons.boundary) ? [cityPolygons.boundary] : [];
        const ads = responsesJSON[1];

        dispatch(batchActions([
          {
            type: Actions.SELECT_CITY_SUCCESS,
            payload: visibleCityIds[0],
          },
          {
            type: Actions.LOAD_ADS,
            payload: ads,
          },
          {
            type: Actions.LOADED_POLYGONS,
            payload: cityPolygons,
          },
        ]));
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
  let updatedVisibleBoundaries = visibleBoundaries;
  let updatedVisibleRasterPolygons = visibleRasterPolygons;
  if (cityIdsToDrop.length > 0) {
    updatedVisiblePolygons = updatedVisiblePolygons.filter(p => !cityIdsToDrop.includes(p.ad_id));
    updatedVisibleBoundaries = updatedVisibleBoundaries.filter(p => !cityIdsToDrop.includes(p.ad_id));
    updatedVisibleRasterPolygons = updatedVisibleRasterPolygons.filter(p => !cityIdsToDrop.includes(p.ad_id));
  }

  const actions = [];

  // deselect city if it's no longer visible
  const citiesWithPolygons = [...new Set(updatedVisiblePolygons.map(p => p.ad_id))];
  if (selectedCity && !citiesWithPolygons.includes(selectedCity)) {
    actions.push({
      type: Actions.UNSELECT_CITY,
    });
  }

  // update if there isn't anything to add
  // otherwise, load the polygon files
  if (cityIdsToAdd.length === 0) {
    actions.push({
      type: Actions.LOADED_POLYGONS,
      payload: {
        polygons: updatedVisiblePolygons,
        boundaries: updatedVisibleBoundaries,
        rasterBoundaries: updatedVisibleRasterPolygons,
        selectableRasterBoundaries: getSelectableRasterBoundaries(updatedVisibleRasterPolygons, map.bounds, cities, dimensions),
      },
    });
    dispatch(batchActions(actions));
  } else {
    const paths = cityIdsToAdd.map(adId => `./static/polygons/${getCityFilePath(adId, cities)}`);

    actions.push({
      type: Actions.LOADING_POLYGONS,
      payload: cityIdsToAdd,
    });
    dispatch(batchActions(actions));

    return Promise.all(paths.map(fp => fetch(fp)))
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then((citiesPolygons) => {
        citiesPolygons.forEach((cityPolygons) => {
          updatedVisiblePolygons = updatedVisiblePolygons.concat(cityPolygons.polygons);
          updatedVisibleBoundaries = updatedVisibleBoundaries.concat([cityPolygons.boundary]);
          updatedVisibleRasterPolygons = updatedVisibleRasterPolygons.concat(cityPolygons.rasterBoundaries);
        });

        dispatch({
          type: Actions.LOADED_POLYGONS,
          payload: {
            polygons: updatedVisiblePolygons,
            boundaries: updatedVisibleBoundaries,
            rasterBoundaries: updatedVisibleRasterPolygons,
            selectableRasterBoundaries: getSelectableRasterBoundaries(updatedVisibleRasterPolygons, mapState.bounds, cities, dimensions),
          },
        });
      });
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

export const showOnlyPolygons = () => ({
  type: Actions.SHOW_ONLY_POLYGONS,
});

export const showMosaicMaps = () => ({
  type: Actions.SHOW_MOSAIC_MAPS,
});

export const showFullMaps = () => ({
  type: Actions.SHOW_FULL_MAPS,
});

export const toggleSortingMaps = () => ({
  type: Actions.TOGGLE_SORTING_MAPS,
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

export const toggleLandingPage = () => ({
  type: Actions.TOGGLE_LANDING_PAGE,
});

export const toggleNationalLegend = () => ({
  type: Actions.TOGGLE_NATIONAL_LEGEND,
});

export const resetMapView = () => (dispatch, getState) => {
  const { windowWidth: mapWidth, mapHeight } = getState().dimensions;

  // calculate the map zoom and center
  // L.Map.include({
  //   getSize: () => new L.Point(mapWidth, mapHeight),
  // });
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
  const zoom = map.getBoundsZoom(featureGroup.getBounds(), false, [-1 * mapWidth, -1 * mapHeight]);
  dispatch(batchActions([
    {
      type: Actions.UNSELECT_CITY,
    },
    {
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
    },
  ]));
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

export const bringMapToFront = eOrId => ({
  type: Actions.BRING_MAP_TO_FRONT,
  payload: getEventId(eOrId, 'number'),
});

export const clickOnMap = e => (dispatch, getState) => {
  //if sorting, find the lowest map that's being clicked on
  const { map, selectedCity, cities } = getState();
  const { sorting, visibleRasterPolygons, sortingPossibilities } = map;
  if (sorting && sortingPossibilities.length === 0) {
    const { lat, lng } = e.latlng;
    console.log(visibleRasterPolygons);
    const clickedRasters = visibleRasterPolygons.filter(m => leafletPip.pointInLayer([lng, lat], L.geoJson(m.the_geojson)).length > 0);
    console.log(clickedRasters);
    if (clickedRasters.length === 1 || clickedRasters.length === 2) {
      const mapId = clickedRasters[0].map_id;
      console.log(mapId);
      dispatch({
        type: Actions.BRING_MAP_TO_FRONT,
        payload: mapId,
      });
      // select the new city if it isn't already
      const cityData = (selectedCity) ? cities.find(c => c.ad_id === selectedCity) : null;
      if (!cityData || !cityData.mapIds.includes(mapId)) {
        const matchingCities = cities.filter(c => c.mapIds.includes(mapId));
        if (matchingCities.length === 1) {
          const selectedCityId = matchingCities[0].ad_id;
          const path = getCityFilePath(selectedCityId, cities);
          dispatch({
            type: Actions.SELECT_CITY_REQUEST,
            payload: selectedCityId,
          });

          return fetch(`./static/ADs/${path}`)
            .then(response => response.json())
            .then((ads) => {
              dispatch(batchActions([
                {
                  type: Actions.SELECT_CITY_SUCCESS,
                  payload: selectedCityId,
                },
                {
                  type: Actions.LOAD_ADS,
                  payload: ads,
                },
              ]));
            })
            .catch((err) => {
              console.warn('Fetch Error :-S', err);
            });
        }
      }
    } else if (clickedRasters.length >= 3) {
      dispatch({
        type: Actions.SORT_MAP_POSSIBILITIES,
        payload: {
          ids: clickedRasters.map(r => r.id),
          latLng: [lat, lng],
        },
      });
    }
  }

  return null;
};

export const selectText = e => (dispatch, getState) => {
  let selected = e;
  if (typeof e === 'object') {
    // set to null in case for closing when no id attached
    selected = null;
    if (typeof e === 'object' && e.target.options && e.target.options.id) {
      selected = e.target.options.id;
    } else if (e.target.id) {
      selected = e.target.id;
    }
  }
  if (typeof e === 'object' && !e.target) {
    selected = null;
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
