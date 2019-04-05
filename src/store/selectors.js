import { createSelector } from 'reselect';
import FormsMetadata from '../../data/formsMetadata.json';
import { constantsColors, constantsColorsVibrant, constantsPopLabels } from '../../data/constants';

const getAdScan = state => state.adScan;
const getAdSearchHOLCIds = state => state.adSearchHOLCIds;
const getAreaDescriptions = state => state.areaDescriptions;
const getCities = state => state.cities;
const getMapZoom = state => state.map.zoom;
const getSelectedArea = state => state.selectedArea;
const getSelectedCategory = state => state.selectedCategory;
const getSelectedCity = state => state.selectedCity;
const getSelectedGrade = state => state.selectedGrade;
const getShowHOLCMaps = state => state.showHOLCMaps;
const getVisiblePolygons = state => state.map.visiblePolygons;
const getVisibleRasters = state => state.map.visibleRasters;

export const getAreaMarkers = createSelector(
  [getSelectedCity, getMapZoom, getVisiblePolygons, getShowHOLCMaps, getSelectedGrade, getSelectedArea, getAdSearchHOLCIds],
  (selectedCity, zoom, visiblePolygons, showHOLCMaps, selectedGrade, selectedArea, adSearchHOLCIds) => {
    if (zoom < 12 || showHOLCMaps) {
      return [];
    }

    return visiblePolygons
      .filter(p => p.ad_id === selectedCity && p.id && p.labelCoords)
      .map((l) => {
        const color = ((selectedArea && l.id !== selectedArea)
          || (selectedGrade && l.grade !== selectedGrade)
          || (adSearchHOLCIds.length > 0 && !adSearchHOLCIds.includes(l.id)))
          ? 'silver' : 'black';
        const key = (l.arbId) ? `areaPolygon-${l.ad_id}-${l.arbId}` :
          `areaPolygon-${l.ad_id}-${l.id}`;
        return {
          point: l.labelCoords,
          ad_id: l.ad_id,
          key,
          id: l.id,
          color,
        };
      });
  },
);

export const getPolygons = createSelector(
  [getVisiblePolygons, getShowHOLCMaps, getSelectedGrade, getSelectedCity, getSelectedArea, getAdSearchHOLCIds, getMapZoom],
  (polygons, showHOLCMaps, selectedGrade, selectedCity, selectedArea, adSearchHOLCIds, zoom) => {
    // calculate the style each polygon
    const zFillOpacity = 0.95 - Math.min((zoom - 9) / 4, 1) * 0.75;

    return polygons.map((p) => {
      let fillColor = constantsColors[`grade${p.grade}`];
      let fillOpacity = (showHOLCMaps) ? 0 : zFillOpacity;
      let strokeColor = '#888'; //constantsColors[`grade${p.grade}`];
      let strokeOpacity = (showHOLCMaps) ? 0 : 0.95;
      let weight = (showHOLCMaps) ? 0 : 1.5;
      const key = (p.arbId) ? `areaPolygon-${p.ad_id}-${p.arbId}` :
        `areaPolygon-${p.ad_id}-${p.id}`;

      // styling for selected grade
      if (!showHOLCMaps && selectedGrade && selectedGrade !== p.grade) {
        fillOpacity = 0.02;
        strokeOpacity = 0.5;
      }
      if (showHOLCMaps && selectedGrade && selectedGrade === p.grade) {
        fillOpacity = 0.4;
        strokeOpacity = 1;
        weight = 3;
        fillColor = constantsColorsVibrant[`grade${p.grade}`];
        strokeColor = 'black';
      }

      // styling for selected and unseleced polygons
      if (!showHOLCMaps && selectedCity === p.ad_id && selectedArea) {
        if (selectedArea === p.id) {
          weight = 3;
          strokeColor = 'black';
        } else {
          fillOpacity = zFillOpacity / 3;
        }
      }
      if (showHOLCMaps
        && selectedCity === p.ad_id
        && selectedArea && selectedArea === p.id) {
        fillOpacity = 0.4;
        strokeOpacity = 1;
        weight = 3;
        fillColor = constantsColorsVibrant[`grade${p.grade}`];
        strokeColor = 'black';
      }

      // styling for search results
      if (adSearchHOLCIds.length > 0) {
        if (!showHOLCMaps) {
          if (adSearchHOLCIds.includes(p.id)) {
            weight = 3;
            fillOpacity = Math.min(0.9, zFillOpacity * 1.5);
            strokeColor = 'black';
          } else {
            fillOpacity = 0.04;
            strokeOpacity = 0.5;
          }
        }

        if (showHOLCMaps && adSearchHOLCIds.includes(p.id)) {
          fillOpacity = 0.5;
          strokeOpacity = 1;
          weight = 3;
          fillColor = constantsColorsVibrant[`grade${p.grade}`];
          strokeColor = 'black';
        }
      }

      return {
        ...p,
        key,
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
  (selectedCity, cities) => cities.find(c => c.ad_id === selectedCity),
);

export const getSelectedCityPopulation = createSelector(
  [getSelectedCityData],
  (cityData) => {
    const { population } = cityData;
    if (!population || !population.total) {
      return null;
    }

    const { total } = population;
    const percents = Object.keys(population)
      .filter(k => k !== 'total' && population[k] > 0 && population[k] / total >= 0.005)
      .sort((a, b) => population[b] - population[a])
      .map(k => ({
        label: constantsPopLabels.find(pl => pl.key === k).label,
        proportion: `${Math.round(population[k] / total * 1000) / 10}%`,
      }));
    return {
      total,
      percents,
    };
  },
);

export const getSelectedAreaDescription = createSelector(
  [getSelectedArea, getSelectedCity, getAreaDescriptions],
  (selectedArea, selectedCity, ads) => (
    (ads[selectedArea] && ads[selectedArea].ad_id === selectedCity) ? ads[selectedArea] : null
  ),
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

export const getSelectedCategoryData = createSelector(
  [getSelectedCategory, getSelectedCityData, getAreaDescriptions],
  (selectedCategory, cityData, areaDescriptions) => {
    const values = { A: [], B: [], C: [], D: [] };
    let title;
    let prevCat;
    let nextCat;

    if (selectedCategory && cityData && areaDescriptions) {
      const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
      const [cat, subcat] = selectedCategory.split('-');
      const { form_id: formId } = cityData;
      Object.keys(areaDescriptions)
        .sort(collator.compare)
        .forEach((holcId) => {
          const { holc_grade: holcGrade, areaDesc } = areaDescriptions[holcId];

          if (areaDesc && ['A', 'B', 'C', 'D'].includes(holcGrade)) {
            if (!subcat) {
              values[holcGrade].push({
                holcId,
                value: areaDesc[cat],
              });
              title = `${cat} ${FormsMetadata[formId][cat]}`;
            } else {
              values[holcGrade].push({
                holcId,
                value: areaDesc[cat][subcat],
              });
              title = `${cat}${subcat} ${FormsMetadata[formId][cat].header} ${FormsMetadata[formId][cat].subcats[subcat]}`;
            }
          }
        });

      let subcatToTest = subcat;

      for (let checkcat = (!subcatToTest || subcatToTest === 'a') ? parseInt(cat, 10) - 1 : parseInt(cat, 10);
        !prevCat && checkcat >= 1;
        checkcat -= 1) {
        for (let checksubcat = (!subcatToTest || subcatToTest === 'a') ? 'z' : String.fromCharCode(subcatToTest.charCodeAt() - 1);
          !prevCat && checksubcat >= 'a';
          checksubcat = String.fromCharCode(checksubcat.charCodeAt() - 1), subcatToTest = undefined) {
          if (typeof FormsMetadata[formId][checkcat] === 'string') {
            prevCat = checkcat.toString();
          }
          if (FormsMetadata[formId][checkcat] && FormsMetadata[formId][checkcat].subcats
            && typeof FormsMetadata[formId][checkcat].subcats[checksubcat] === 'string') {
            prevCat = `${checkcat}-${checksubcat}`;
          }
        }
      }

      subcatToTest = subcat;

      for (let checkcat = (!subcatToTest) ? parseInt(cat, 10) + 1 : parseInt(cat, 10);
        !nextCat && checkcat < 30;
        checkcat += 1) {
        for (let checksubcat = (!subcatToTest || subcatToTest === 'z') ? 'a' : String.fromCharCode(subcatToTest.charCodeAt() + 1);
          !nextCat && checksubcat <= 'z';
          checksubcat = String.fromCharCode(checksubcat.charCodeAt() + 1), subcatToTest = undefined) {
          if (typeof FormsMetadata[formId][checkcat] === 'string') {
            nextCat = checkcat.toString();
          }
          if (FormsMetadata[formId][checkcat] && FormsMetadata[formId][checkcat].subcats
            && typeof FormsMetadata[formId][checkcat].subcats[checksubcat] === 'string') {
            nextCat = `${checkcat}-${checksubcat}`;
          }
        }
      }
    }

    return {
      values,
      title,
      prevCat,
      nextCat,
    };
  },
);

export const getSearchOptions = createSelector(
  [getCities],
  cities => (
    cities.map(c => ({
      ad_id: c.ad_id,
      searchName: c.searchName,
      name: c.name,
      state: c.state,
      population: {
        total: (c.population && c.population.total) ? c.population.total : null,
        percents: (c.population && c.population.total) ? Object.keys(c.population)
          .filter(k => k !== 'total' && c.population[k] > 0 && c.population[k] / c.population.total >= 0.005)
          .sort((a, b) => c.population[b] - c.population[a])
          .map(k => ({
            label: constantsPopLabels.find(pl => pl.key === k).label,
            proportion: `${Math.round(c.population[k] / c.population.total * 100)}%`,
          })) : null,
      },
      area: c.area,
    }))
  ),
);

export const getADScanMetadata = createSelector(
  [getAdScan, getSelectedAreaDescription],
  (adScan, ad) => {
    const { zoom, center } = adScan;
    const { url, sheets } = ad;
    let maxBounds = [[-10, -180], [90, -60]];
    if (sheets === 2) {
      maxBounds = [[-10, -180], [90, 70]];
    }
    return {
      center,
      zoom,
      maxBounds,
      url,
    };
  },
);

export const getPopulation = createSelector(
  [getSelectedCity, getCities],
  (selectedCity, cities) => {
    const { population } = cities[selectedCity];
  },
);

export const getCityMarkers = createSelector(
  [getVisibleRasters, getMapZoom],
  (rasters, zoom) => {
    if (zoom >= 12 || zoom < 9) {
      return [];
    }
    return rasters
      .filter(r => r.centerLng && r.bounds && !r.inset)
      .map(r => ({
        position: [r.bounds[0][0] - 0.075 / (1 + zoom - 9), r.centerLng],
        label: r.city,
        id: r.id,
      }));
  },
);
