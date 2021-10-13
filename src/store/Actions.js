import { batchActions } from 'redux-batched-actions';
import * as L from 'leaflet';
import leafletPip from '@mapbox/leaflet-pip';
import { pointInPolygon } from 'geojson-utils';
import TheStore from '.';
import Actions from './ActionTypes';
import calculateDimensions from './CalculateDimensions';
import Rasters from '../../data/Rasters.json';
import { BUCKET_URL } from '../../data/constants';

// ACTIONS
function moveMap(currentMapParams, updatedMapParams) {
  let { aboveThreshold } = currentMapParams;
  if (updatedMapParams.zoom) {
    aboveThreshold = updatedMapParams.zoom >= 9;
  }
  return {
    type: Actions.MOVE_MAP,
    payload: {
      ...currentMapParams,
      ...updatedMapParams,
      aboveThreshold,
    },
  };
}

export function selectCity(eOrId, coords) {
  return async (dispatch, getState) => {
    const id = getEventId(eOrId, 'number');

    // get data from the city that you need for the path and to set the map zoom and center
    const { cities, dimensions, map, selectedCity, loadingCity } = getState();
    const { loadingPolygonsFor, zoom: currentZoom } = map;

    const path = getCityFilePath(id, cities);
    const { bounds, mapIds } = cities.find(c => c.ad_id === id);
    const centerAndZoom = coords || calculateCenterAndZoom(bounds, dimensions);

    // if it's already loaded or is being loaded test to see if you need to zoom
    if (selectedCity === id || loadingCity === id) {
      if (currentZoom <= 11) {
        dispatch({
          type: Actions.MOVE_MAP,
          payload: {
            ...map,
            ...centerAndZoom,
            aboveThreshold: true,
            visibleRasters: [
              ...map.visibleRasters.filter(m => !mapIds.includes(m.id)),
              ...map.visibleRasters.filter(m => mapIds.includes(m.id)),
            ],
          },
        });
      }
      return null;
    }

    // move the map
    dispatch(moveMap(map, centerAndZoom));

    // load the city data
    dispatch({
      type: Actions.SELECT_CITY_REQUEST,
      payload: id,
    });
    const actions = [
      {
        type: Actions.LOAD_ADS,
        payload: await fetchJSON(`./static/areadescriptions/${path}`),
      },
      {
        type: Actions.SELECT_CITY_SUCCESS,
        payload: id,
      },
    ];
    if (loadingPolygonsFor !== id) {
      const cityPolygons = await fetchJSON(`./static/polygons/${path}`);
      cityPolygons.boundaries = (cityPolygons.boundary) ? [cityPolygons.boundary] : [];
      actions.push({
        type: Actions.LOADED_POLYGONS,
        payload: cityPolygons,
      });
    }
    dispatch(batchActions(actions));

    return null;
  };
}

export function selectArea(eOrId) {
  return async (dispatch, getState) => {
    // don't do anything if sorting maps
    if (getState().map.sorting) {
      return null;
    }

    const actions = [];

    const { adId, holcId } = parseAreaId(eOrId);
    const { selectedCity, cities, map, dimensions } = getState();

    const { bounds, visiblePolygons } = map;
    const { bounds: cityBounds, mapIds } = cities.find(c => c.ad_id === adId);
    let newCenterAndZoom = false;

    // zoom to include the area if necessary from the map.
    // if (bounds && bounds[0] && areaIsVisible(bounds, cityBounds, dimensions)) {
    //   newCenterAndZoom = centerAndZoomIncluding(calculateInsetBounds(bounds, dimensions),
    //     getAreaPolygonBB(adId, holcId, visiblePolygons), dimensions);
    //   if (newCenterAndZoom) {
    //     const { lat, lng, zoom } = newCenterAndZoom;
    //     actions.push({
    //       type: Actions.MOVE_MAP,
    //       payload: {
    //         ...map,
    //         zoom,
    //         highlightedPolygons: [{
    //           adId,
    //           holcId,
    //         }],
    //         center: [lat, lng],
    //         visibleRasterPolygons: [
    //           ...map.visibleRasterPolygons.filter(m => !mapIds.includes(m.map_id)),
    //           ...map.visibleRasterPolygons.filter(m => mapIds.includes(m.map_id)),
    //         ],
    //         visibleRasters: [
    //           ...map.visibleRasters.filter(m => !mapIds.includes(m.id)),
    //           ...map.visibleRasters.filter(m => mapIds.includes(m.id)),
    //         ],
    //       },
    //     });
    //   } 

    // load the city if necessary
    if (selectedCity !== adId) {
      await dispatch(selectCity(adId));
    }

    // select and highlight the area
    actions.push(
      {
        type: Actions.SELECT_AREA,
        payload: holcId,
      },
      {
        type: Actions.HIGHLIGHT_AREAS,
        payload: [{
          adId,
          holcId,
        }],
      },
    );

    dispatch(batchActions(actions));
    return null;
  };
}

export function loadInitialData() {
  return async (dispatch, getState) => {
    const { hash } = window.location;
    const hashValues = {};
    hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
      const [key, value] = pair.split('=');
      hashValues[key] = value;
    });
    const actions = [];

    const { cities, edition } = getState();

    let coords;
    if (hashValues.loc) {
      const [zoom, lat, lng] = hashValues.loc.split('/').map(str => parseFloat(str));
      coords = {
        zoom,
        center: [lat, lng],
      };
    }
    const adId = (hashValues.city) ? cities.find(c => c.slug === hashValues.city).ad_id : undefined;

    if (!hashValues.nogeo && navigator.geolocation && edition !== 'placesAndSpaces') {
      dispatch({
        type: Actions.GEOLOCATING,
      });
      navigator.geolocation.getCurrentPosition(async (position) => {
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
          const cityDists = cities
            .filter(c => c.centerLat && c.centerLng
              && Math.abs(position.coords.latitude - c.centerLat) < 50 / 111
              && Math.abs(position.coords.longitude - c.centerLng) < 50 / 73)
            .map(c => ({
              ad_id: c.ad_id,
              dist: PythagorasEquirectangular(c.centerLat, c.centerLng, position.coords.latitude, position.coords.longitude),
            }))
            .sort((a, b) => a.dist - b.dist);

          if (cityDists.length >= 1 && cityDists[0].dist <= 40 && cityDists[0] !== hashValues.city) {
            const id = cityDists[0].ad_id;

            // load the city
            await dispatch(selectCity(id));

            geolocationActions.push({
              type: Actions.LOCATED_USER,
              payload: [position.coords.latitude, position.coords.longitude],
            });

            // test to see if you can select a polygon
            getState().map.visiblePolygons
              .filter(p => p.ad_id === id)
              .every((p) => {
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
          }
        } else {
          dispatch(geolocationActions[0]);
        }
      }, (error) => {
        dispatch({
          type: Actions.GEOLOCATION_ERROR,
          payload: error,
        });
      }, {
        enableHighAccuracy: true,
        timeout: 7500,
        maximumAge: 100000,
      });
    }
    if (hashValues.city) {
      await dispatch(selectCity(adId, coords));
    }
    if (hashValues.area) {
      await dispatch(selectArea(`${adId}-${hashValues.area}`));
    }
    if (hashValues.category) {
      dispatch(selectCategory(hashValues.category));
    }
    if (hashValues.text) {

      dispatch(selectText(hashValues.text));
    }

    actions.push({
      type: Actions.INITIALIZED,
    });

    dispatch(batchActions(actions));
  };
}

export function selectCategory(eOrId) {
  return {
    type: Actions.SELECT_CATEGORY,
    payload: getEventId(eOrId),
  };
}

export const unselectCategory = () => ({
  type: Actions.UNSELECT_CATEGORY,
});

export function unselectCity() {
  return {
    type: Actions.UNSELECT_CITY,
  };
}

export function zoomToArea(eOrId) {
  return (dispatch, getState) => {
    const { adId, holcId } = parseAreaId(eOrId);
    const { map, dimensions } = getState();
    const { visiblePolygons } = map;
    // get the bounding box for the polygon
    const areaPolygon = visiblePolygons.find(vp => vp.id === holcId && vp.ad_id === adId);
    if (areaPolygon && areaPolygon.polygonBoundingBox) {
      dispatch(moveMap(map, calculateCenterAndZoom(areaPolygon.polygonBoundingBox, dimensions)));
    }
  };
}

export function zoomToCity(eOrId) {
  return (dispatch, getState) => {
    const adId = getEventId(eOrId, 'number');
    const { cities, map, dimensions } = getState();
    const cityData = cities.find(c => c.ad_id === adId);
    dispatch(moveMap(map, calculateCenterAndZoom(cityData.bounds, dimensions)));
  };
}

export function highlightArea(eOrId) {
  return (dispatch, getState) => {
    const { adId, holcId } = parseAreaId(eOrId);

    const { selectedArea, selectedCity, map, dimensions, cities } = getState();
    const { visiblePolygons } = map;

    const { bounds: cityBounds } = cities.find(c => c.ad_id === adId);

    // move the map if it's not visible
    dispatch(moveMapToShow(map, getAreaPolygonBB(adId, holcId, visiblePolygons), dimensions, cityBounds));

    const highlightedPolygons = [{
      adId,
      holcId,
    }];

    // if there's a selected Area, it stays highlighted
    if (selectedArea && selectedArea !== holcId && selectedCity) {
      highlightedPolygons.push({
        adId: selectedCity,
        holcId: selectedArea,
      });
    }

    dispatch({
      type: Actions.HIGHLIGHT_AREAS,
      payload: highlightedPolygons,
    });
  };
}

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

export function updateMap(mapState) {
  return async (dispatch, getState) => {
    const { zoom, center, bounds } = mapState;
    const aboveThreshold = (zoom >= 9);

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
    const latLngBounds = L.latLngBounds([...bounds]);

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
      dispatch(unselectCity());
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
      const coords = {
        zoom,
        center,
      };
      dispatch(selectCity(visibleCityIds[0], coords));
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
}

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

export const toggleNationalLegend = () => ({
  type: Actions.TOGGLE_NATIONAL_LEGEND,
});

export const toggleCityMarkerStyle = () => ({
  type: Actions.TOGGLE_CITY_MARKER_STYLE,
});

export const resetMapView = () => (dispatch, getState) => {
  const { windowWidth: mapWidth, mapHeight } = getState().dimensions;

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

export const clickOnMap = e => (dispatch, getState) => {
  //if sorting, find the lowest map that's being clicked on
  const { map, selectedCity, cities } = getState();
  const { sorting, visibleRasterPolygons, sortingPossibilities } = map;
  if (sorting && sortingPossibilities.length === 0) {
    const { lat, lng } = e.latlng;
    const clickedRasters = visibleRasterPolygons.filter(m => leafletPip.pointInLayer([lng, lat], L.geoJson(m.the_geojson)).length > 0);
    if (clickedRasters.length === 1 || clickedRasters.length === 2) {
      const mapId = clickedRasters[0].map_id;
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

          return fetch(`./static/areadescriptions/${path}`)
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
          ids: clickedRasters.map(r => r.map_id),
          latLng: [lat, lng],
        },
      });
    }
  }

  return null;
};

export function selectText(e) {
  const selected = getEventId(e);
  return {
    type: Actions.SELECT_TEXT,
    payload: selected,
  };
}

export function closeText() {
  return {
    type: Actions.SELECT_TEXT,
    payload: null,
  };
}

export function changeFromHash() {
  return async (dispatch, getState) => {
    const actions = [];
    // get the current values
    const {
      map,
      selectedCity,
      selectedArea,
      selectedCategory,
      showADSelections,
      showDataViewerFull,
      showHOLCMaps,
      showFullHOLCMaps,
      showADScan,
      adScan,
      selectedText,
      cities,
    } = getState();
    const { zoom, center } = map;
    let adZoom;
    let adCenter;
    if (showADScan) {
      ({ zoom: adZoom, center: adCenter } = adScan);
    }

    const { hash } = window.location;
    const hashValues = {};
    hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
      const [key, value] = pair.split('=');
      hashValues[key] = value;
    });

    let coords;
    const adId = (hashValues.city) ? cities.find(c => c.slug === hashValues.city).ad_id : undefined;


    // handle city
    //console.log(hashValues.city, adId, selectedCity);
    if (hashValues.city && (!selectedCity || selectedCity !== adId)) {
      // console.log('awaiting city');
      await dispatch(selectCity(adId, coords));
    } else if (!hashValues.city && selectedCity) {
      actions.push({
        type: Actions.UNSELECT_CITY,
      });
    }

    // handle area 
    if (hashValues.area && hashValues.area !== selectedArea) {
      // console.log(`adding area ${hashValues.area} to actions`);
      actions.push({
        type: Actions.SELECT_AREA,
        payload: hashValues.area,
      });
      actions.push({
        type: Actions.HIGHLIGHT_AREAS,
        payload: [{
          adId: getState().selectedCity,
          holcId: hashValues.area,
        }],
      });
    } else if (!hashValues.area && selectedArea) {
      actions.push({
        type: Actions.UNSELECT_AREA,
      });
      dispatch({
        type: Actions.UNHIGHLIGHT_AREA,
      });
    }

    if (hashValues.loc) {
      const [newZoom, lat, lng] = hashValues.loc.split('/').map(str => parseFloat(str));
      coords = {
        zoom,
        center: [lat, lng],
      };
      if (zoom !== newZoom || center[0] !== lat || center[1] !== lng) {
        actions.push({
          type: Actions.MOVE_MAP,
          payload: {
            ...map,
            ...coords,
            aboveThreshold: (newZoom >= 9),
          },
        });
      }
    }

    if (hashValues.adview && hashValues.adview === 'full' && showADSelections) {
      actions.push({
        type: Actions.TOGGLE_AD_SELECTION,
      });
    }
    if (hashValues.adviewer && hashValues.adviewer === 'sidebar' && showDataViewerFull) {
      actions.push({
        type: Actions.TOGGLE_DATA_VIEWER_FULL,
      });
    }
    if (hashValues.maps && hashValues.maps === '0' && showHOLCMaps) {
      actions.push({
        type: Actions.TOGGLE_HOLC_MAPS,
      });
    }
    if (hashValues.mapview && hashValues.mapview === 'graded' && showFullHOLCMaps) {
      actions.push({
        type: Actions.SHOW_MOSAIC_MAPS,
      });
    }

    if (hashValues.adimage) {
      const [newAdZoom, adY, adX] = hashValues.adimage.split('/').map(str => parseFloat(str));
      if (!showADScan) {
        actions.push({
          type: Actions.TOGGLE_AD_SCAN,
        });
      } else if (showADScan && (adZoom !== newAdZoom || adCenter[0] !== adY || adCenter[1] !== adX)) {
        actions.push({
          type: Actions.MOVE_ADSCAN,
          payload: {
            zoom: newAdZoom,
            center: [adY, adX],
          },
        });
      }
    }
    if (hashValues.category && hashValues.category !== selectedCategory) {
      actions.push({
        type: Actions.SELECT_CATEGORY,
        payload: getEventId(hashValues.category),
      });
    }
    if (hashValues.text && hashValues.text !== selectedText) {
      actions.push({
        type: Actions.SELECT_TEXT,
        payload: hashValues.text,
      });
    }

    if (!showADSelections && !Object.keys(hashValues).includes('adview')) {
      actions.push({
        type: Actions.TOGGLE_AD_SELECTION,
      });
    }

    if (!showDataViewerFull && !Object.keys(hashValues).includes('adviewer')) {
      actions.push({
        type: Actions.TOGGLE_DATA_VIEWER_FULL,
      });
    }

    if (!showHOLCMaps && !Object.keys(hashValues).includes('maps')) {
      actions.push({
        type: Actions.TOGGLE_HOLC_MAPS,
      });
    }

    if (!showFullHOLCMaps && !Object.keys(hashValues).includes('mapview')) {
      actions.push({
        type: Actions.SHOW_FULL_MAPS,
      });
    }

    if (selectedText && !Object.keys(hashValues).includes('text')) {
      actions.push({
        type: Actions.SELECT_TEXT,
        payload: null,
      });
    }

    if (showADScan && !Object.keys(hashValues).includes('adimage')) {
      actions.push({
        type: Actions.TOGGLE_AD_SCAN,
      });
    }

    if (actions.length > 0) {
      dispatch(batchActions(actions));
    }
  };
}

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

export const gradeUnselected = () => TheStore.dispatch(selectGrade(null));
export const toggleMaps = () => TheStore.dispatch(toggleMapsOnOff());
export const toggleCityStats = () => TheStore.dispatch(toggleCityStatsOnOff());
export const windowResized = () => TheStore.dispatch(recalculateDimensions());
export const hashChanged = () => TheStore.dispatch(changeFromHash());



// UTILITY FUNCTIONS
function getCityFilePath(adId, cities) {
  const { name, state, year } = cities.find(c => c.ad_id === adId);
  return `${`${state}${name}${year}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;
}

function getEventId(eOrId, type = 'string') {
  let id = eOrId.id || eOrId;
  if (!eOrId.id && typeof eOrId === 'object') {
    const ct = eOrId.currentTarget || eOrId.target;
    id = ct.id || ct.options.id;
  }
  return (type === 'number') ? parseInt(id, 10) : id;
}

function parseAreaId(areaId) {
  const [adId, holcId] = getEventId(areaId)
    .split(/-(.+)/)
    .map((v, i) => (
      (i === 0) ? parseInt(v, 10) : v
    ));
  return {
    adId,
    holcId,
  };
}

function getNSWE(bounds) {
  return {
    n: Math.max(bounds[0][0], bounds[1][0]),
    s: Math.min(bounds[0][0], bounds[1][0]),
    e: Math.max(bounds[0][1], bounds[1][1]),
    w: Math.min(bounds[0][1], bounds[1][1]),
  };
}

// calculates the expanded bounds to offset the map to account for the data viewer
function calculateOffsetBounds(bounds, dimensions) {
  const { windowWidth: mapWidth, dataViewerWidth, media } = dimensions;
  let { n, s, e, w } = getNSWE(bounds);
  const padding = 20;
  if (media !== 'phone' && media !== 'tablet-portrait') {
    const horizontalOffsetRatio = 1 / (1 - (dataViewerWidth + padding * 2) / mapWidth) - 1;
    w -= (e - w) * horizontalOffsetRatio;
  } else {
    // this bit of extra offset creates some paddinb between the bounds and the data viewer
    s -= (n - s) * 1.15;
  }
  return [[n, w], [s, e]];
}

// calculates the reduced bounds of the functionally viewable map accounting for the data viewer
function calculateInsetBounds(bounds, dimensions) {
  const { windowWidth: mapWidth, mapHeight, dataViewerWidth, media } = dimensions;
  let { n, s, e, w } = getNSWE(bounds);
  if (media !== 'phone' && media !== 'tablet-portrait') {
    const padding = 20;
    const verticalOffsetRatio = padding / mapHeight;
    const westOffsetRatio = (dataViewerWidth + padding * 2) / mapWidth;
    const eastOffsetRatio = padding / mapWidth;
    n -= (n - s) * verticalOffsetRatio;
    s += (n - s) * verticalOffsetRatio;
    w += (e - w) * westOffsetRatio;
    e -= (e - w) * eastOffsetRatio;
  } else {
    s += (n - s) / 2.3;
  }
  return [[n, w], [s, e]];
}

// calculates the offset center and zoom offset to account for the data viewer
function calculateCenterAndZoom(bounds, dimensions) {
  const { windowWidth: mapWidth, mapHeight, media, dataViewerWidth } = dimensions;
  const padding = 20;
  const insetWidth = (media !== 'phone' && media !== 'tablet-portrait')
    ? mapWidth - dataViewerWidth - padding * 3
    : mapWidth;
  const insetHeight = (media !== 'phone' && media !== 'tablet-portrait')
    ? mapHeight - padding * 2
    : mapHeight / 2;

  // create a leaflet map to run some of the map math, starting with the map bounds as a leaflet latlngbounds object.
  const map = L.map(document.createElement('div'), {
    center: [0, 0],
    zoom: 0,
  });
  const { n, s, e, w } = getNSWE(bounds);
  const polygonBounds = L.latLngBounds(bounds);

  // Calculate the zoom using the polygonBounds and the width of the visible part of the map.
  // The padding (insetWidth/insetHeight) is needed because the leaflet map isn't in the dom
  // and doesn't have dimensions
  const zoom = map.getBoundsZoom(polygonBounds, false, [insetWidth * -1, insetHeight * -1]);

  // this is uncomfortably hacky
  // set the leaflet map instance size and view centering the bounds so you can get the bounds of the actual map
  map._size = L.point(mapWidth, mapHeight);
  map.setView(polygonBounds.getCenter(), zoom);
  const mapBounds = map.getBounds();

  // calculate the center  for the inset
  let { lat, lng } = polygonBounds.getCenter();

  // use the offsetBounds to offset the center to account for the data viewer
  if (media !== 'phone' && media !== 'tablet-portrait') {
    // calculate how much you need to offset the lng by calculating the percent of the width the
    // dataviewer occupies and then that width in meridians/lngs.
    // the 1.5 for the padding leaves half a gutter between the viewer and the map, which seems more visually balanced
    const dataViewerWidthPercent = (dataViewerWidth + padding * 1.5) / mapWidth;
    const dataViewerWidthLngs = (mapBounds.getEast() - mapBounds.getWest()) * dataViewerWidthPercent;
    lng -= dataViewerWidthLngs / 2;
  } else {
    const dataViewerHeightLats = (mapBounds.getNorth() - mapBounds.getSouth()) * 0.5;
    lat -= dataViewerHeightLats / 2;
  }

  return {
    zoom,
    center: [lat, lng],
  };
}

function centerAndZoomIncluding(containingBounds, containedBounds, dimensions) {
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
}

function centerAndZoomIntersects(boundsA, boundsB, dimensions) {
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
}

function areaIsVisible(boundsA, boundsB) {
  if (boundsB && boundsB[0] && boundsB[0][0]) {
    return L.latLngBounds(boundsA).contains(boundsB) || L.latLngBounds(boundsA).overlaps(boundsB);
  }
  return false;
}

function getAreaPolygon(adId, holcId, visiblePolygons) {
  return visiblePolygons.find(vp => vp.id === holcId && vp.ad_id === adId);
}

function getAreaPolygonBB(adId, holcId, visiblePolygons) {
  const areaPolygon = getAreaPolygon(adId, holcId, visiblePolygons);
  return (areaPolygon && areaPolygon.polygonBoundingBox) ? areaPolygon.polygonBoundingBox : null;
}

function calculateRoughArea(bounds) {
  const { n, s, e, w } = getNSWE(bounds);
  return (n - s) * (e - w);
}

function getSelectableRasterBoundaries(boundaries, mapBounds, cities, dimensions) {
  const visibleAreaish = calculateRoughArea(calculateInsetBounds(mapBounds, dimensions));
  return boundaries
    .filter((b) => {
      const cityData = cities.find(c => c.ad_id === b.ad_id);
      const cityAreaish = calculateRoughArea(cityData.bounds);
      return cityAreaish / visibleAreaish <= 0.075;
    })
    .map(b => b.ad_id);
}

async function fetchJSON(path) {
  const response = await fetch(path);
  const json = await response.json();
  return json;
}

function moveMapToShow(map, bb, dimensions, cityBounds) {
  // calcuate if map movement is necessary
  const bounds = (map.bounds && map.bounds.length > 0) ? map.bounds : cityBounds;
  const newCenterAndZoom = centerAndZoomIntersects(calculateInsetBounds(bounds, dimensions),
    bb, dimensions);
  if (newCenterAndZoom) {
    return moveMap(map, newCenterAndZoom);
  }
  return {
    type: null,
  };
}
