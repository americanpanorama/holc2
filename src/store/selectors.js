import { createSelector } from 'reselect';

const getAdSearchHOLCIds = state => state.adSearchHOLCIds;
const getAreaDescriptions = state => state.areaDescriptions;
const getCities = state => state.cities;
const getMapZoom = state => state.map.zoom;
const getSelectedArea = state => state.selectedArea;
const getSelectedCity = state => state.selectedCity;
const getSelectedGrade = state => state.selectedGrade;
const getShowHOLCMaps = state => state.showHOLCMaps;
const getVisiblePolygons = state => state.map.visiblePolygons;

export const getAreaMarkers = createSelector(
  [getSelectedCity, getMapZoom, getVisiblePolygons, getShowHOLCMaps, getSelectedGrade],
  (selectedCity, zoom, visiblePolygons, showHOLCMaps, selectedGrade) => {
    const cityPolygons = visiblePolygons.filter(p => p.ad_id === selectedCity);
    return (zoom >= 12 && !showHOLCMaps && cityPolygons.length > 0)
      ? cityPolygons.map(l => ({
        point: l.labelCoords,
        ad_id: l.ad_id,
        id: l.id,
        color: (!selectedGrade || selectedGrade === l.id.substr(0, 1)) ? 'black' : 'silver',
      }))
      : [];
  },
);

export const getPolygons = createSelector(
  [getVisiblePolygons, getShowHOLCMaps, getSelectedGrade, getSelectedCity, getSelectedArea, getAdSearchHOLCIds],
  (polygons, showHOLCMaps, selectedGrade, selectedCity, selectedArea, adSearchHOLCIds) => {
    const colors = {
      A: '#76a865',
      B: '#7cb5bd',
      C: '#d8d165',
      D: '#d9838d',
    };

    const fillColorsAdjusted = {
      A: '#58ff2c', // '#58cc2c',
      B: '#578DFF', //'#98f6ff',
      C: 'yellow', //'#a79500',
      D: '#FF3B4C', //'#ff536b',
    };

    // calculate the style each polygon
    return polygons.map((p) => {
      let fillColor = colors[p.grade];
      let fillOpacity = (showHOLCMaps) ? 0 : 0.25;
      let strokeColor = colors[p.grade];
      let strokeOpacity = (showHOLCMaps) ? 0 : 1;
      let weight = (showHOLCMaps) ? 0 : 1;

      // styling for selected grade
      if (!showHOLCMaps && selectedGrade && selectedGrade !== p.grade) {
        fillOpacity = 0.02;
        strokeOpacity = 0.5;
      }
      if (showHOLCMaps && selectedGrade && selectedGrade === p.grade) {
        fillOpacity = 0.25;
        strokeOpacity = 1;
      }

      // styling for selected and unseleced polygons
      if (!showHOLCMaps && selectedCity === p.ad_id && selectedArea) {
        if (selectedArea === p.id) {
          weight = 3;
        } else {
          fillOpacity = 0.04;
          strokeOpacity = 0.5;
        }
      }
      if (showHOLCMaps
        && selectedCity === p.ad_id
        && selectedArea && selectedArea === p.id) {
        fillOpacity = 0.4;
        strokeOpacity = 1;
        weight = 3;
        fillColor = fillColorsAdjusted[p.grade];
        strokeColor = 'black';
      }

      // styling for search results
      if (adSearchHOLCIds.length > 0) {
        if (!showHOLCMaps) {
          if (adSearchHOLCIds.includes(p.id)) {
            weight = 3;
          } else {
            fillOpacity = 0.04;
            strokeOpacity = 0.5;
          }
        }

        if (showHOLCMaps && adSearchHOLCIds.includes(p.id)) {
          fillOpacity = 0.4;
          strokeOpacity = 1;
          weight = 3;
          fillColor = fillColorsAdjusted[p.grade];
          strokeColor = 'black';
        }
      }

      return {
        ...p,
        fillColor,
        fillOpacity,
        strokeColor,
        strokeOpacity,
        weight,
      };
    });
  },
);

export const getSelectedCityData = createSelector(
  [getSelectedCity, getCities],
  (selectedCity, cities) => cities[selectedCity],
);

export const getSelectedAreaData = createSelector(
  [getSelectedArea, getSelectedCity, getAreaDescriptions, getPolygons],
  (selectedArea, selectedCity, ads, polygons) => {
    const cityPolygons = polygons.filter(p => p.ad_id === selectedCity);
    const polygon = cityPolygons.find(p => p.id === selectedArea);
    const areaDesc = (ads[selectedArea] && ads[selectedArea].ad_id === selectedCity)
      ? ads[selectedArea]
      : null;

    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    const adIds = Object.keys(ads).sort(collator.compare);
    const previousHOLCId = adIds[adIds.indexOf(selectedArea) - 1];
    const previousPolygon = cityPolygons.find(p => p.id === previousHOLCId);
    const previousAreaMetadata = (previousPolygon) ?
      {
        id: `${selectedCity}-${previousHOLCId}`,
        holcId: previousHOLCId,
        grade: previousPolygon.grade,
        direction: 'previous',
      }
      : null;
    const nextHOLCId = adIds[adIds.indexOf(selectedArea) + 1];
    const nextPolygon = cityPolygons.find(p => p.id === nextHOLCId);
    const nextAreaMetadata = (nextPolygon) ?
      {
        id: `${selectedCity}-${nextHOLCId}`,
        holcId: nextHOLCId,
        grade: nextPolygon.grade,
        direction: 'next',
      }
      : null;

    return {
      polygon,
      areaDesc,
      previousAreaMetadata,
      nextAreaMetadata,
    };
  },
);

export const getPopulation = createSelector(
  [getSelectedCity, getCities],
  (selectedCity, cities) => {
    const { population } = cities[selectedCity];
  },
);

