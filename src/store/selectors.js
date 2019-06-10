import { createSelector } from 'reselect';
import FormsMetadata from '../../data/formsMetadata.json';
import FormsInstructions from '../../data/formsInstructions.json';
import Rasters from '../../data/Rasters.json';
import stateAbbrs from '../../data/state_abbr.json';
import { constantsColors, constantsColorsVibrant, constantsPopLabels, HEADER_RED_COLOR } from '../../data/constants';

const getAdScan = state => state.adScan;
const getAdSearchHOLCIds = state => state.adSearchHOLCIds;
const getAreaDescriptions = state => state.areaDescriptions;
const getCities = state => state.cities;
const getFormMetadata = state => state.formsMetadata;
const getMapZoom = state => state.map.zoom;
const isSortingMaps = state => state.map.sorting;
const getSortingPossibilities = state => state.map.sortingPossibilities;
const getSelectedArea = state => state.selectedArea;
const getSelectedCategory = state => state.selectedCategory;
const getSelectedCity = state => state.selectedCity;
const getSelectedGrade = state => state.selectedGrade;
const getShowHOLCMaps = state => state.showHOLCMaps;
const getVisiblePolygons = state => state.map.visiblePolygons;
const getHighlightedPolygons = state => state.map.highlightedPolygons;
const getLoadingPolygonsFor = state => state.map.loadingPolygonsFor;
const getVisibleRasters = state => state.map.visibleRasters;
const isGeolocating = state => state.map.geolocating;
const getLoadingCity = state => state.loadingCity;
const getShowDataViewerFull = state => state.showDataViewerFull;
const getDimensions = state => state.dimensions;

export const getInspectedPolygon = createSelector(
  [getSelectedArea, getSelectedCity, getHighlightedPolygons],
  (selectedArea, selectedCity, highlightedPolygons) => {
    // if there's just one polygon, it's the one to show
    // if there are multiple ones,
    // remove the selected polygon to test whether there is just one that's being hovered over
    let inspectedPolygon;
    if (highlightedPolygons.length === 1) {
      inspectedPolygon = highlightedPolygons[0];
    } else {
      const highlightedSansSelected = highlightedPolygons
        .filter(hp => hp.holcId !== selectedArea || hp.adId !== selectedCity);
      if (highlightedSansSelected.length === 1) {
        inspectedPolygon = highlightedSansSelected[0];
      }
    }
    return inspectedPolygon;
  },
);

export const getAreaMarkers = createSelector(
  [getVisiblePolygons, getHighlightedPolygons, getShowHOLCMaps, getMapZoom, getSelectedCity],
  (polygons, highlightedPolygons, showHOLCMaps, zoom, selectedCity) => {
    if (zoom < 10 || showHOLCMaps) {
      return [];
    }

    return polygons
      .filter(p => p.ad_id === selectedCity && p.id && p.labelCoords)
      .map((l) => {
        const color = (highlightedPolygons.length === 0 ||
          highlightedPolygons.some(hp => hp.adId === l.ad_id && hp.holcId === l.id))
          ? '#333' : 'silver';
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
  [getVisiblePolygons, getHighlightedPolygons, getShowHOLCMaps, getMapZoom],
  (polygons, highlightedPolygons, showHOLCMaps, zoom) => {
    // calculate the style each polygon
    const zFillOpacity = 0.95 - Math.min((zoom - 9) / 4, 1) * 0.75;

    return polygons.map((p) => {
      let fillColor = constantsColors[`grade${p.grade}`];
      let fillOpacity = (showHOLCMaps) ? 0 : zFillOpacity;
      let strokeColor = '#888'; //constantsColors[`grade${p.grade}`];
      let strokeOpacity = (showHOLCMaps) ? 0 : 0.95;
      let weight = (showHOLCMaps) ? 0 : 1;

      const key = (p.arbId) ? `areaPolygon-${p.ad_id}-${p.arbId}` :
        `areaPolygon-${p.ad_id}-${p.id}`;

      if (highlightedPolygons.length > 0) {
        if (highlightedPolygons.some(hp => hp.adId === p.ad_id && hp.holcId === p.id)) {
          if (!showHOLCMaps) {
            weight = 3;
            fillOpacity = Math.min(0.9, zFillOpacity * 2);
            strokeColor = 'black';
          } else {
            fillOpacity = 0.1;
            fillColor = constantsColorsVibrant[`grade${p.grade}`];
          }
        } else if (!showHOLCMaps) {
          fillOpacity = Math.max(0.2, zFillOpacity * 0.5);
          strokeOpacity = 0.5;
          weight = 0.5;
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

export const getRasters = createSelector(
  [getShowHOLCMaps, getVisibleRasters, getSelectedCityData],
  (showHOLCMaps, rasters, cityData) => {
    if (!showHOLCMaps) {
      return [];
    }

    const overlappingIds = rasters
      .sort((a, b) => {
        if (cityData && cityData.mapIds.includes(a.id)) {
          return 1;
        }
        if (cityData && cityData.mapIds.includes(b.id)) {
          return -1;
        }
        return 0;
      })
      .filter(raster => raster.overlaps)
      .map(raster => raster.id);

    return rasters.map(raster => ({
      ...raster,
      zIndex: (overlappingIds.includes(raster.id))
        ? overlappingIds.findIndex(id => id === raster.id) : null,
      overlappingIds,
    }));
  },
);

export const getAreaRasters = createSelector(
  [getShowHOLCMaps, getVisiblePolygons, getHighlightedPolygons],

  (showHOLCMaps, visiblePolygons, highlightedPolygons) => {
    if (!showHOLCMaps) {
      return [];
    }

    return highlightedPolygons
      .filter(hp => visiblePolygons.findIndex(p => p.ad_id === hp.adId
        && p.id === hp.holcId) !== -1)
      .map((hp) => {
        const {
          neighborhoodId,
          polygonBoundingBox,
        } = visiblePolygons.find(p => p.ad_id === hp.adId && p.id === hp.holcId);
        return ({
          id: neighborhoodId,
          minZoom: 7,
          maxZoom: 15,
          url: `//s3.amazonaws.com/holc/polygon_tiles/${neighborhoodId}/{z}/{x}/{y}.png`,
          bounds: polygonBoundingBox,
        });
      });
  },
);

export const getSelectedCityADSelections = createSelector(
  [getSelectedCityData, getFormMetadata],
  (cityData, formsMetadata) => {
    const selections = cityData.areaDescSelections;
    const formMetadata = formsMetadata[cityData.form_id];

    if (selections) {
      return selections.map((s) => {
        let cat;
        let subcat;
        let catName;
        if (s.cat) {
          if (!isNaN(s.cat)) {
            ({ cat } = s);
          } else {
            [cat, subcat] = s.cat.split('');
          }
          catName = (formMetadata[cat].header) ? formMetadata[cat].header : formMetadata[cat];
          if (subcat && formMetadata[cat].subcats[subcat]) {
            catName = `${catName}: ${formMetadata[cat].subcats[subcat]}`;
          }
        }
        return {
          ...s,
          catName,
        };
      });
    }

    return [];
  },
);

export const getLoadingCityData = createSelector(
  [getLoadingCity, getCities],
  (cityId, cities) => cities.find(c => c.ad_id === cityId),
);

export const getLoadingPolygonsCitiesData = createSelector(
  [getLoadingPolygonsFor, getCities],
  (cityIds, cities) => cities.filter(c => cityIds.includes(c.ad_id)),
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
    (ads && ads[selectedArea] && ads[selectedArea].ad_id === selectedCity) ? ads[selectedArea] : null
  ),
);

export const getSelectedAreaData = createSelector(
  [getSelectedArea, getSelectedCity, getAreaDescriptions, getPolygons],
  (selectedArea, selectedCity, ads, polygons) => {
    const cityPolygons = polygons.filter(p => p.ad_id === selectedCity);
    const polygon = cityPolygons.find(p => p.id === selectedArea);
    const areaDesc = (ads && ads[selectedArea] && ads[selectedArea].ad_id === selectedCity)
      ? ads[selectedArea]
      : null;

    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    const adIds = (ads) ? Object.keys(ads).sort(collator.compare) : [];
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
    let instructions;
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

          if (areaDesc && areaDesc[cat] && ['A', 'B', 'C', 'D'].includes(holcGrade)) {
            if (!subcat) {
              values[holcGrade].push({
                holcId,
                value: areaDesc[cat],
              });
              title = `${cat} ${FormsMetadata[formId][cat]}`;
              instructions = (FormsInstructions[formId] && FormsInstructions[formId][cat])
                ? FormsInstructions[formId][cat] : null;
            } else {
              values[holcGrade].push({
                holcId,
                value: areaDesc[cat][subcat],
              });
              title = `${cat}${subcat} ${FormsMetadata[formId][cat].header} ${FormsMetadata[formId][cat].subcats[subcat]}`;
              instructions = (FormsInstructions[formId] && FormsInstructions[formId][cat]
                && FormsInstructions[formId][cat].subcats &&
                FormsInstructions[formId][cat].subcats[subcat])
                ? FormsInstructions[formId][cat].subcats[subcat] : null;
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
      instructions,
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
        bounds: r.bounds,
        centerLng: r.centerLng,
        centerLat: r.centerLat,
        label: r.city,
        area: r.area,
        id: r.id,
      }));
  },
);

export const getLoadingNotification = createSelector(
  [getLoadingCityData, getLoadingPolygonsCitiesData, isGeolocating, isSortingMaps],
  (cityData, loadingPolygonsCitiesData, geolocating, isSortingMaps) => {
    const notifications = [];
    if (isSortingMaps) {
      notifications.push('Clicking on a highlighted map will bring it to the front. The click will effect the bottommost map. Repeat if necessary.');
    }
    if (geolocating) {
      notifications.push('determining your location');
    }
    if (cityData || loadingPolygonsCitiesData.length > 0) {
      // add the city data if it's polygons are not already being loaded
      let citiesData;
      if (loadingPolygonsCitiesData.length === 0) {
        citiesData = [cityData];
      } else if (!cityData) {
        citiesData = loadingPolygonsCitiesData;
      } else {
        citiesData = (!loadingPolygonsCitiesData.map(c => c.ad_id).includes(cityData.ad_id))
          ? [
            ...loadingPolygonsCitiesData,
            cityData,
          ]
          : loadingPolygonsCitiesData;
      }
      notifications.push(`loading ${citiesData.map(c => c.name).join(', ')}`);
    }
    return notifications.join('; ');
  },
);

export const getOverlappingMaps = createSelector(
  [getVisibleRasters, getShowHOLCMaps, isSortingMaps],
  (rasters, showHOLCMaps, isSortingMaps) => {
    if (!showHOLCMaps || !isSortingMaps) {
      return [];
    }
    const categoricalColors = ['rgb(158, 218, 229)', 'rgb(174, 199, 232)', 'rgb(255, 127, 14)', 'rgb(255, 187, 120)', 'rgb(44, 160, 44)', 'rgb(152, 223, 138)', 'rgb(31, 119, 180)', 'rgb(214, 39, 40)', 'rgb(255, 152, 150)', 'rgb(148, 103, 189)', 'rgb(197, 176, 213)', 'rgb(140, 86, 75)', 'rgb(196, 156, 148)', 'rgb(227, 119, 194)', 'rgb(247, 182, 210)', 'rgb(127, 127, 127)', 'rgb(199, 199, 199)', 'rgb(188, 189, 34)', 'rgb(219, 219, 141)', 'rgb(23, 190, 207)'];
    const allOverlappingRasters = rasters.filter(m => m.overlaps);
    const overlappingRasters = allOverlappingRasters.map((m, i) => {
      const shade = 200 - 200 * i / allOverlappingRasters.length;
      const weight = 1 + 4 * i / allOverlappingRasters.length;
      const sortOrder = allOverlappingRasters.length - i;
      return {
        ...m,
        fillColor: categoricalColors[i % 20],
        weight,
        sortOrder,
      };
    });
    console.log(overlappingRasters);
    return overlappingRasters;
  },
);

export const getDownloadData = createSelector(
  [getCities],
  (cities) => {
    const citiesByState = [];
    cities.forEach((city) => {
      const { ad_id: adId, name, year, state, mapIds, hasPolygons } = city;
      const fileName = `${state}${name}${year}`.replace(/[^a-zA-Z0-9]/g, '');
      // get the rasters
      if (mapIds.length > 0) {
        const cityDownloadData = {
          adId,
          city: name,
          rasters: [],
          geospatial: [],
          polygons: (hasPolygons)
            ? {
              imgUrl: `static/citysvgs/${fileName}.svg`,
              geojson: `static/downloads/geojson/${fileName}.geojson`,
              shapefile: `static/downloads/shapefiles/${fileName}.zip`,
            } : null,
        };

        mapIds.forEach((mId) => {
          const raster = Rasters.find(r => r.id === mId);
          if (raster) {
            const {
              file_name: fileName,
              name: rasterName,
              inset, mapUrl,
              rectifiedUrl,
            } = Rasters.find(r => r.id === mId);
            if (mapUrl) {
              cityDownloadData.rasters.push({
                fileName,
                name: rasterName,
                mapUrl,
                id: mId,
              });
            }
            cityDownloadData.geospatial.push({
              id: mId,
              fileName,
              name: rasterName,
              rectifiedUrl,
              inset,
            });
          } else {
            console.warn(`no raster for ${mId}`);
            return false;
          }
        });

        const i = citiesByState.findIndex(cbs => cbs.state === stateAbbrs[state]);
        if (i !== -1) {
          citiesByState[i].cities.push(cityDownloadData);
        } else {
          citiesByState.push({
            state: stateAbbrs[city.state],
            cities: [cityDownloadData],
          });
        }
      }
    });

    // sort the cities in each state
    citiesByState.forEach((stateData, i3) => {
      citiesByState[i3].cities = citiesByState[i3].cities.sort((a, b) => {
        if (a.city < b.city) {
          return -1;
        }
        if (a.city > b.city) {
          return 1;
        }
        return 0;
      });
    });

    return citiesByState.sort((a, b) => {
      if (a.state < b.state) {
        return -1;
      }
      if (a.state > b.state) {
        return 1;
      }
      return 0;
    });
  },
);

export const getInspectedMiniMapParams = createSelector(
  [getShowDataViewerFull, getVisiblePolygons, getInspectedPolygon],
  (showDataViewerFull, visiblePolygons, inspectedPolygon) => {
    if (showDataViewerFull && inspectedPolygon) {
      const { adId, holcId } = inspectedPolygon;
      // get the bounding box for the polygon
      const areaPolygon = visiblePolygons.find(vp => vp.id === holcId && vp.ad_id === adId);
      if (areaPolygon && areaPolygon.polygonBoundingBox) {
        return {
          bounds: areaPolygon.polygonBoundingBox,
          highlightedHolcId: holcId,
          highlightedAdId: adId,
        };
      }
    }
    return {};
  },
);
