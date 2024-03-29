import { createSelector } from 'reselect';
import FormsMetadata from '../../data/formsMetadata.json';
import FormsInstructions from '../../data/formsInstructions.json';
import Rasters from '../../data/Rasters.json';
import stateAbbrs from '../../data/state_abbr.json';
import { constantsColors, constantsColorsVibrant, constantsPopLabels, HEADER_RED_COLOR, BUCKET_URL } from '../../data/constants';

const getAdScan = state => state.adScan;
const getAdSearchHOLCIds = state => state.adSearchHOLCIds;
const getAreaDescriptions = state => state.areaDescriptions;
const getAdSelections = state => state.adSelections;
const getCities = state => state.cities;
const getVisibleCities = state => state.visibleCities;
const getFormMetadata = state => state.formsMetadata;
const getMapZoom = state => state.map.zoom;
const isSortingMaps = state => state.map.sorting;
const getSortingPossibilities = state => state.map.sortingPossibilities;
const getSelectedArea = state => state.selectedArea;
const getSelectedCategory = state => state.selectedCategory;
const getSelectedCity = state => state.selectedCity;
const getSelectedGrade = state => state.selectedGrade;
const getShowHOLCMaps = state => state.showHOLCMaps;
const getShowFullHOLCMaps = state => state.showFullHOLCMaps;
const getVisiblePolygons = state => state.map.visiblePolygons;
const getVisibleBoundaries = state => state.map.visibleBoundaries;
const getVisibleRasterPolygons = state => state.map.visibleRasterPolygons;
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
  [getVisiblePolygons, getHighlightedPolygons, getShowHOLCMaps, getMapZoom, getSelectedCity, getCities],
  (polygons, highlightedPolygons, showHOLCMaps, zoom, selectedCity, cities) => {
    if (zoom < 10 || showHOLCMaps) {
      return [];
    }

    return polygons
      .filter(p => p.id && p.labelCoords && (!selectedCity || selectedCity === p.ad_id))
      .map((l) => {
        const color = (highlightedPolygons.length === 0
          || highlightedPolygons.some(hp => hp.adId === l.ad_id && hp.holcId === l.id))
          ? '#333' : 'green';
        const key = (l.arbId) ? `areaPolygon-${l.ad_id}-${l.arbId}`
          : `areaPolygon-${l.ad_id}-${l.id}`;
        const city = cities.find(c => c.ad_id === l.ad_id);
        const { slug } = city;
        return {
          point: l.labelCoords,
          ad_id: l.ad_id,
          slug,
          key,
          id: l.id,
          color,
          fontSize: 21 - ((16 - zoom) * 3),
        };
      });
  },
);

export const getPolygons = createSelector(
  [getVisiblePolygons, getHighlightedPolygons, getShowHOLCMaps, getMapZoom, getCities, getVisibleCities, getSelectedCity, getSelectedArea],
  (polygons, highlightedPolygons, showHOLCMaps, zoom, cities, visibleCities, selectedCity, selectedArea) => {
    // calculate the style each polygon
    const zFillOpacity = 0.95 - Math.min((zoom - 9) / 4, 1) * 0.75;

    const testing = false;

    const adsInCities = visibleCities.map(adId => ({
      adId,
      hasADs: cities.find(c => c.ad_id === adId).hasImages || cities.find(c => c.ad_id === adId).hasADs,
    }));

    return polygons.map((p) => {
      let fillColor = constantsColors[`grade${p.grade}`];
      let fillOpacity = (showHOLCMaps && !testing) ? 0 : zFillOpacity;
      let strokeColor = '#888'; //constantsColors[`grade${p.grade}`];
      let strokeOpacity = 0.95;
      let weight = (showHOLCMaps) ? 0 : 1;

      if (testing) {
        fillOpacity = 0.3;
      }

      const key = (p.arbId) ? `areaPolygon-${p.ad_id}-${p.arbId}`
        : `areaPolygon-${p.ad_id}-${p.id}`;
      const hasAD = (adsInCities.find(d => d.adId === p.ad_id)) ? adsInCities.find(d => d.adId === p.ad_id).hasADs : true;

      if (highlightedPolygons.length > 0) {
        if (highlightedPolygons.some(hp => hp.adId === p.ad_id && hp.holcId === p.id)) {
          if (!showHOLCMaps) {
            weight = 3;
            fillOpacity = Math.min(0.9, zFillOpacity * 2);
            strokeColor = 'black';
          } else {
            fillOpacity = 0;
            fillColor = constantsColorsVibrant[`grade${p.grade}`];
            weight = (zoom - 8) * 0.5;
            strokeColor = 'black';
            strokeOpacity = (zoom <= 13) ? 1 : 1 - Math.min((zoom - 13) / 3, 1);
          }
        } else if (!showHOLCMaps) {
          fillOpacity = Math.max(0.2, zFillOpacity * 0.5);
          strokeOpacity = 0.5;
          weight = 0.5;
        }
      }

      return {
        ...p,
        hasAD,
        key,
        fillColor,
        fillOpacity,
        strokeColor,
        strokeOpacity,
        weight,
        isSelected: selectedArea && p.id === selectedArea && p.ad_id === selectedCity,
      };
    });
  },
);

export const getSelectedCityData = createSelector(
  [getSelectedCity, getCities],
  (selectedCity, cities) => cities.find(c => c.ad_id === selectedCity),
);

export const getRasters = createSelector(
  [getShowHOLCMaps, getShowFullHOLCMaps, getVisibleRasters, getSelectedCityData],
  (showHOLCMaps, showFullHOLCMaps, rasters, cityData) => {
    if (!showHOLCMaps) {
      return [];
    }

    const overlappingIds = rasters
      .filter(raster => raster.overlaps)
      .map(raster => raster.id);

    return rasters.map(raster => ({
      ...raster,
      url: (showFullHOLCMaps) ? raster.url : raster.url.replace('/tiles/', '/tiles_mosaic/'),
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

export const getCityAreaRasters = createSelector(
  [getShowHOLCMaps, getVisiblePolygons],

  (showHOLCMaps, visiblePolygons) => {
    // if (!showHOLCMaps) {
    //   return [];
    // }

    return visiblePolygons
      .map((p) => {
        const { neighborhoodId, polygonBoundingBox } = p;
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
  [getAdSelections, getSelectedCityData, getFormMetadata],
  (selections, cityData, formsMetadata) => {
    if (!cityData.hasADs) {
      return false;
    }
    let { form_id: formId } = cityData;
    // Madison's unique in using two different forms--the selections only use one form
    if (formId === 6234766) {
      formId = 19370826;
    }

    const formMetadata = formsMetadata[formId];

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
      // acount for Madison's multiple forms if it's the selected city
      // Madison is a pain in the ass
      if (cityData.name === 'Madison') {
        const AugToOctCats = {
          2: 1,
          3: 1,
          4: 1,
          14: 5,
          '5-a': 2,
          '5-b': 2,
          '5-c': 2,
          '5-d': 2,
          '5-e': 2,
          '5-f': 2,
          '5-g': 2,
          '12-a': 4,
          '12-b': 4,
        };
        const AugToOctSubcats = {
          2: 'a',
          3: 'b',
          4: 'c',
          '5-a': 'a',
          '5-b': 'b',
          '5-c': 'c',
          '5-d': 'd',
          '5-e': 'e',
          '5-f': 'f',
          '5-g': 'g',
          '12-a': 'a',
          '12-b': 'b',
        };

        const OctToAugCats = {
          '1-a': 2,
          '1-b': 3,
          '1-c': 4,
          '2-a': 5,
          '2-b': 5,
          '2-c': 5,
          '2-d': 5,
          '2-e': 5,
          '2-f': 5,
          '2-g': 5,
          '4-a': 12,
          '4-b': 12,
          5: 14,
        };
        const OctToAugSubcats = {
          '2-a': 'a',
          '2-b': 'b',
          '2-c': 'c',
          '2-d': 'd',
          '2-e': 'e',
          '2-f': 'f',
          '2-g': 'g',
          '4-a': 'a',
          '4-b': 'b',
        };
        // figure out which form to use, which luckily you can parse from the category selected
        const formToUse = (cat > 5 || (['2', '3', '4'].includes(cat) && !subcat) || (cat === '5' && subcat)) ? 19370826 : 19371001;
        const uses19371001 = ['D10', 'D9', 'C15'];
        title = (!subcat)
          ? `${FormsMetadata[formToUse][cat]}`
          : `${FormsMetadata[formToUse][cat].header} ${FormsMetadata[formToUse][cat].subcats[subcat]}`;
        Object.keys(areaDescriptions)
          .sort(collator.compare)
          .forEach((holcId) => {
            const { holc_grade: holcGrade, areaDesc } = areaDescriptions[holcId];

            let catToUse = cat;
            let subCatToUse = subcat;
            if (formToUse === 19370826 && uses19371001.includes(holcId)) {
              catToUse = AugToOctCats[selectedCategory];
              subCatToUse = AugToOctSubcats[selectedCategory];
            }
            if (formToUse === 19371001 && !uses19371001.includes(holcId)) {
              catToUse = OctToAugCats[selectedCategory];
              subCatToUse = OctToAugSubcats[selectedCategory];
            }

            if (areaDesc && areaDesc[catToUse] && ['A', 'B', 'C', 'D'].includes(holcGrade)) {
              if (['2-c', '2-d', '5-c', '5-d'].includes(selectedCategory)) {
                values[holcGrade].push({
                  holcId,
                  value: `${(areaDesc[catToUse] && areaDesc[catToUse][subCatToUse]['1']) ? areaDesc[catToUse][subCatToUse]['1'] : ''}; ${(areaDesc[catToUse] && areaDesc[catToUse][subCatToUse]['2']) ? areaDesc[catToUse][subCatToUse]['2'] : ''}`,
                });
              } else if (!subCatToUse) {
                values[holcGrade].push({
                  holcId,
                  value: areaDesc[catToUse],
                });
              } else {
                values[holcGrade].push({
                  holcId,
                  value: areaDesc[catToUse][subCatToUse],
                });
              }
            }
          });
      } else {
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
                title = (formId !== 1) ? `${cat} ${FormsMetadata[formId][cat]}` : 'Area Descriptions';
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
  [getVisibleRasters, getVisibleRasterPolygons, getShowHOLCMaps, isSortingMaps],
  (rasters, visibleRasterPolygons, showHOLCMaps, isSortingMaps) => {
    if (!showHOLCMaps || !isSortingMaps) {
      return [];
    }
    const categoricalColors = ['rgb(158, 218, 229)', 'rgb(174, 199, 232)', 'rgb(255, 127, 14)', 'rgb(255, 187, 120)', 'rgb(44, 160, 44)', 'rgb(152, 223, 138)', 'rgb(31, 119, 180)', 'rgb(214, 39, 40)', 'rgb(255, 152, 150)', 'rgb(148, 103, 189)', 'rgb(197, 176, 213)', 'rgb(140, 86, 75)', 'rgb(196, 156, 148)', 'rgb(227, 119, 194)', 'rgb(247, 182, 210)', 'rgb(127, 127, 127)', 'rgb(199, 199, 199)', 'rgb(188, 189, 34)', 'rgb(219, 219, 141)', 'rgb(23, 190, 207)'];
    const allOverlappingRasters = rasters.filter(m => m.overlaps);
    const overlappingRasters = allOverlappingRasters
      .map((m, i) => {
        const weight = 1 + 4 * i / allOverlappingRasters.length;
        const sortOrder = allOverlappingRasters.length - i;
        return {
          ...m,
          the_geojson: (visibleRasterPolygons.find(vrp => vrp.map_id === m.id))
            ? visibleRasterPolygons.find(vrp => vrp.map_id === m.id).the_geojson : null,
          fillColor: categoricalColors[i % 20],
          weight,
          sortOrder,
        };
      })
      .filter(or => or.the_geojson);
    return overlappingRasters;
  },
);

export const getDownloadData = createSelector(
  [getCities],
  (cities) => {
    const citiesByState = [];
    cities.forEach((city) => {
      const { ad_id: adId, name, year, state, mapIds, hasPolygons, hasADs, slug } = city;
      const fileName = `${state}${name}${year}`.replace(/[^a-zA-Z0-9]/g, '');
      // get the rasters
      if (mapIds.length > 0) {
        const cityDownloadData = {
          adId,
          city: name,
          slug,
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
              year: rasterYear,
              inset,
            } = Rasters.find(r => r.id === mId);
            if (hasADs && !raster.parent_id) {
              cityDownloadData.adsUrl = `${BUCKET_URL}/tiles/${state}/${fileName}/${rasterYear}/ads.zip`;
              cityDownloadData.adsThumbnailUrl = `${BUCKET_URL}/tiles/${state}/${fileName}/${rasterYear}/adThumbnail.jpg`;
            } 
            if (fileName && state && year && !inset) {
              cityDownloadData.rasters.push({
                fileName,
                name: rasterName,
                mapUrl: `${BUCKET_URL}/tiles/${state}/${fileName}/${rasterYear}/holc-scan.jpg`,
                id: mId,
              });
            }
            cityDownloadData.geospatial.push({
              id: mId,
              fileName,
              name: rasterName,
              rectifiedUrl: `${BUCKET_URL}/tiles/${state}/${fileName}/${rasterYear}/rectified.zip`,
              inset: !!inset,
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

export const getCityBoundaries = createSelector(
  [getCities, getVisibleBoundaries, getSelectedCity, getShowHOLCMaps, getShowFullHOLCMaps],
  (cities, visibleBoundaries, selectedCity, showHOLCMaps, showFullHOLCMaps) => {
    if (showHOLCMaps && showFullHOLCMaps) {
      return [];
    }

    const adIdsWithoutADs = cities
      .filter(c => !c.hasADs && !c.hasImages)
      .map(c => c.ad_id);

    return visibleBoundaries
      .map(b => ({
        adId: b.ad_id,
        boundaryGeojson: b.the_geojson,
        weight: (!selectedCity || b.ad_id === selectedCity) ? 1 : 0.5,
        color: (!selectedCity || b.ad_id === selectedCity) ? 'black' : 'grey',
        fillColor: 'white',
        fillOpacity: (!selectedCity || b.ad_id === selectedCity) ? 0 : 0.5,
        selectable: adIdsWithoutADs.includes(b.ad_id) && b.ad_id !== selectedCity,
        key: `boundaryFor-${b.ad_id}`,
      }));
  },
);
