const fs = require('fs');
const events = require('events');
const request = require('request');
const Polylabel = require('polylabel');
const GeojsonArea = require('@mapbox/geojson-area');
const stateAbbrs = require('../data/state_abbr.json');

const eventEmitter = new events.EventEmitter();

const url = 'https://digitalscholarshiplab.cartodb.com/api/v1/sql?format=JSON&q=';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let rastersData;
const citiesData = {};
const areasData = {};

const createRastersData = () => {
  const queryOverlaps = 'SELECT distinct(hm1.map_id) FROM digitalscholarshiplab.holc_maps_v2 AS hm1, digitalscholarshiplab.holc_maps AS hm2 WHERE hm1.map_id <> hm2.map_id AND ST_Overlaps(hm1.the_geom, hm2.the_geom)';

  request({
    url: `${url}${queryOverlaps}`,
    json: true,
  }, (error, response, theOverlaps) => {
    const overlaps = theOverlaps.rows.map(overlapObj => overlapObj.map_id);

    // get the raster data
    const queryRasters = 'SELECT *, ST_asgeojson(the_geom, 4) as the_geojson, st_xmin(the_geom) as minLng, st_xmax(the_geom) as maxLng, st_ymin(the_geom) as minLat, st_ymax(the_geom) as maxLat, st_x(st_centroid(the_geom)) as centerLng, st_y(st_centroid(the_geom)) as centerLat FROM holc_maps_v2';
    request({
      url: `${url}${queryRasters}`,
      json: true,
    }, (error, response, theRasters) => {

      rastersData = Object.keys(theRasters.rows).map((i) => {
        const r = theRasters.rows[i];
        return {
          id: r.map_id,
          parent_id: r.parent_id,
          the_geojson: JSON.parse(r.the_geojson),
          overlaps: (overlaps.indexOf(r.map_id) !== -1),
          city: r.name,
          state: r.state,
          file_name: r.file_name,
          name: r.name,
          minZoom: r.minzoom,
          maxZoom: r.maxzoom,
          bounds: [[r.minlat, r.minlng], [r.maxlat, r.maxlng]],
          minLat: r.minlat,
          maxLat: r.maxlat,
          minLng: r.minlng,
          maxLng: r.maxlng,
          centerLat: r.centerlat,
          centerLng: r.centerlng,
          sortLat: r.sortlat,
          sortLng: r.sortlng,
          inset: r.inset,
          url: `//s3.amazonaws.com/holc/tiles/${r.state}/${(r.file_name) ? r.file_name.replace(/\s+/g, '') : 'NEEDED'}/${r.year}/{z}/{x}/{y}.png`,
          //retinaUrl: `//s3.amazonaws.com/holc/tiles_retina/${r.state}/${r.file_name.replace(/\s+/g, '')}/${r.year}/{z}/{x}/{y}.png`,
          mapUrl: (!r.inset) ? `//s3.amazonaws.com/holc/tiles/${r.state}/${(r.file_name) ? r.file_name.replace(/\s+/g, '') : 'NEEDED'}/${r.year}/holc-scan.jpg` : null,
          rectifiedUrl: `//s3.amazonaws.com/holc/tiles/${r.state}/${(r.file_name) ? r.file_name.replace(/\s+/g, '') : 'NEEDED'}/${r.year}/rectified.zip`,
        };
      });
      // write the file
      fs.writeFileSync('../data/Rasters.json', JSON.stringify(rastersData));

      eventEmitter.emit('rastersDataCreated');
    });
  });
};

const createCitiesData = () => {
  // const query = "WITH polygon_bounds as (select ad_id, st_xmin(st_envelope(st_collect(holc_polygons.the_geom))) as bbxmin, st_ymin(st_envelope(st_collect(holc_polygons.the_geom))) as bbymin, st_xmax(st_envelope(st_collect(holc_polygons.the_geom))) as bbxmax, st_ymax(st_envelope(st_collect(holc_polygons.the_geom))) as bbymax FROM holc_polygons group by ad_id), has_ads as (select count(data), ad_id from holc_ad_data join holc_polygons on holc_ad_data.polygon_id = holc_polygons.neighborhood_id group by ad_id) SELECT holc_ads.city_id as ad_id, city, state, holc_ads.year, looplat::numeric, looplng::numeric, form_id, total_pop_1940, total_pop_1930, american_indian_eskimo_1930, american_indian_eskimo_1940, asian_pacific_1930 as asian_pacific_islander_1930, asian_pacific_1940 as asian_pacific_1940, black_pop_1930, black_pop_1940, white_pop_1930, white_pop_1940, fb_30, fb30_afr_amer, fb30_all_other, fb30_chinese, fb30_indian, fb30_japanese, fb30_other_races, fb30_white, native_pop_1930, fb_40, fb40_afr_amer, fb40_all_other, fb40_chinese, fb40_indian, fb40_japanese, fb40_other_races, fb40_white, native_pop_1940, images, case when has_ads.ad_id is not null then true else false end as has_ads, sum(st_area(holc_polygons.the_geom_webmercator)) / 1609.34^2 as total_area, sum(CASE WHEN holc_grade = 'A' THEN st_area(holc_polygons.the_geom_webmercator) ELSE 0 END) / 1609.34^2 as area_a, sum(CASE WHEN holc_grade = 'B' THEN st_area(holc_polygons.the_geom_webmercator) ELSE 0 END) / 1609.34^2 as area_b, sum(CASE WHEN holc_grade = 'C' THEN st_area(holc_polygons.the_geom_webmercator) ELSE 0 END) / 1609.34^2 as area_c, sum(CASE WHEN holc_grade = 'D' THEN st_area(holc_polygons.the_geom_webmercator) ELSE 0 END) / 1609.34^2 as area_d, bbxmin, bbymin, bbxmax, bbymax, array_agg(distinct map_id) as map_ids FROM holc_polygons right join holc_ads on holc_polygons.ad_id = holc_ads.city_id left join polygon_bounds on holc_ads.city_id = polygon_bounds.ad_id join holc_maps_ads_join on holc_maps_ads_join.ad_id = holc_ads.city_id left join has_ads on has_ads.ad_id = holc_ads.city_id and holc_ads.looplng is not null and holc_ads.looplat is not null group by holc_ads.city_id, city, state, holc_ads.year, form_id, looplat, looplng, total_pop_1940, total_pop_1930, american_indian_eskimo_1930, american_indian_eskimo_1940, asian_pacific_1930, asian_pacific_1940, black_pop_1930, black_pop_1940, white_pop_1930, white_pop_1940, fb_30, fb30_afr_amer, fb30_all_other, fb30_chinese, fb30_indian, fb30_japanese, fb30_other_races, fb30_white, native_pop_1930, fb_40, fb40_afr_amer, fb40_all_other, fb40_chinese, fb40_indian, fb40_japanese, fb40_other_races, fb40_white, native_pop_1940, images, has_ads, bbxmin, bbymin, bbxmax, bbymax  order by state, city";

  const parsePopSnippetDisplayDataDecade = (popStatsDecade) => {
    const displayData = {
      total: popStatsDecade.total,
      percents: [],
    };

    // if there's data for foreign-born & native-born whites, use that
    if (popStatsDecade.fb_white && popStatsDecade.white) {
      displayData.percents.push({
        label: 'Native-born white',
        proportion: (popStatsDecade.white - popStatsDecade.fb_white) / popStatsDecade.total,
      });
      displayData.percents.push({
        label: 'Foreign-born white',
        proportion: popStatsDecade.fb_white / popStatsDecade.total,
      });
    } else if (popStatsDecade.white) {
      displayData.percents.push({
        label: 'white',
        proportion: popStatsDecade.white / popStatsDecade.total,
      });
    }

    if (popStatsDecade.AfricanAmerican) {
      displayData.percents.push({
        label: 'African American',
        proportion: popStatsDecade.AfricanAmerican / popStatsDecade.total,
      });
    }

    if (popStatsDecade.asianAmerican) {
      displayData.percents.push({
        label: 'Asian American',
        proportion: popStatsDecade.asianAmerican / popStatsDecade.total,
      });
    }

    if (popStatsDecade.nativeAmerican) {
      displayData.percents.push({
        label: 'Native American',
        proportion: popStatsDecade.nativeAmerican / popStatsDecade.total,
      });
    }

    if (popStatsDecade.fb_Chinese) {
      displayData.percents.push({
        label: 'Foreign-born Chinese',
        proportion: popStatsDecade.fb_Chinese / popStatsDecade.total,
      });
    }

    if (popStatsDecade.fb_Japanese) {
      displayData.percents.push({
        label: 'Foreign-born Japanese',
        proportion: popStatsDecade.fb_Japanese / popStatsDecade.total,
      });
    }

    if (popStatsDecade.fb_AfricanAmerican) {
      displayData.percents.push({
        label: 'Foreign-born African American',
        proportion: popStatsDecade.fb_AfricanAmerican / popStatsDecade.total,
      });
    }

    return displayData;
  };

  const parsePopSnippetDisplayData = (popStats) => {
    const displayPop = {
      1930: parsePopSnippetDisplayDataDecade(popStats[1930]),
      1940: parsePopSnippetDisplayDataDecade(popStats[1940]),
    };

    displayPop[1930].percents = displayPop[1930].percents.filter((pop30) => {
      const pop40 = displayPop[1940].percents.filter(pop40temp => (pop30.label == pop40temp.label));
      if (pop40.length === 0 && pop30.proportion >= 0.005) {
        displayPop[1940].percents.push({
          label: pop30.label,
          proportion: null,
        });
      }
      return (pop30.proportion >= 0.005);
    });

    displayPop[1940].percents = displayPop[1940].percents.filter((pop40) => {
      const pop30 = displayPop[1930].percents.filter(pop30temp => (pop30temp.label === pop40.label));
      if (pop30.length === 0 && pop40.proportion >= 0.005) {
        displayPop[1930].percents.push({
          label: pop40.label,
          proportion: null,
        });
      }
      return (pop40.proportion >= 0.005);
    });

    displayPop[1940].percents.sort((a, b) => a.proportion < b.proportion);
    displayPop.order = displayPop[1940].percents.map(pop40 => pop40.label);

    return displayPop;
  };

  console.log('querying basic city data');
  const query = 'select * from holc_ad_v2';
  request({
    url: `${url}${query}`,
    json: true,
  }, (error, response, cities) => {
    if (!error && response.statusCode === 200) {
      // process basic info
      Object.keys(cities.rows).forEach((i) => {
        const c = cities.rows[i];
        citiesData[c.city_id] = {
          ad_id: c.city_id,
          name: c.city,
          state: c.state,
          year: (c.year) ? c.year.replace(/(\r\n\t|\n|\r\t)/gm, '') : '19XX',
          searchName: `${c.city} ${stateAbbrs[c.state]} ${c.state}`,
          slug: `${c.city.toLowerCase().replace(/ +/g, '-')}-${c.state.toLowerCase()}`,
          form_id: c.form_id,
          hasImages: c.images,
          hasADs: false,
          mapIds: [],
          area: {
            total: 0,
            a: 0,
            b: 0,
            c: 0,
            d: 0,
          },
        };
      });

      console.log('querying area data');
      const queryArea = 'select sum(st_area(the_geom_webmercator) / 1609.34^2 ) as area, holc_grade, ad_id from holc_polygons group by (ad_id, holc_grade) order by ad_id, holc_grade';
      request({
        url: `${url}${queryArea}`,
        json: true,
      }, (error, response, areas) => {
        Object.keys(areas.rows).forEach((i) => {
          const a = areas.rows[i];
          // initialize if it doesn't exist
          if (citiesData[a.ad_id] && a.holc_grade) {
            citiesData[a.ad_id].hasPolygons = (citiesData[a.ad_id].hasPolygons || a.area > 0);
            citiesData[a.ad_id].area[a.holc_grade.toLowerCase()] = Math.round(a.area * 100) / 100;
            citiesData[a.ad_id].area.total += citiesData[a.ad_id].area[a.holc_grade.toLowerCase()];
          }
        });

        console.log('querying bound boxes');
        const queryBB = 'select ad_id, st_x(st_centroid(st_collect(holc_polygons.the_geom))) as center_lng, st_y(st_centroid(st_collect(holc_polygons.the_geom))) as center_lat, st_xmin(st_envelope(st_collect(holc_polygons.the_geom))) as bbxmin, st_ymin(st_envelope(st_collect(holc_polygons.the_geom))) as bbymin, st_xmax(st_envelope(st_collect(holc_polygons.the_geom))) as bbxmax, st_ymax(st_envelope(st_collect(holc_polygons.the_geom))) as bbymax FROM holc_polygons group by ad_id';
        request({
          url: `${url}${queryBB}`,
          json: true,
        }, (error, response, bounds) => {
          Object.keys(bounds.rows).forEach((i) => {
            const b = bounds.rows[i];
            if (citiesData[b.ad_id]) {
              citiesData[b.ad_id].bounds = (b.bbymin && b.bbxmin && b.bbymax && b.bbxmax) ?
                [
                  [Math.round(b.bbymin * 1000) / 1000, Math.round(b.bbxmin * 1000) / 1000],
                  [Math.round(b.bbymax * 1000) / 1000, Math.round(b.bbxmax * 1000) / 1000],
                ] : null;
              citiesData[b.ad_id].centerLat = b.center_lat;
              citiesData[b.ad_id].centerLng = b.center_lng;
            }
          });

          console.log('querying if has ADs');
          const queryHasAds = 'SELECT ad_id, Count(data) FROM holc_ad_data JOIN holc_polygons ON holc_ad_data.polygon_id = holc_polygons.neighborhood_id GROUP BY ad_id';
          request({
            url: `${url}${queryHasAds}`,
            json: true,
          }, (error, response, adCount) => {
            Object.keys(adCount.rows).forEach((i) => {
              if (citiesData[adCount.rows[i].ad_id] && adCount.rows[i].count > 0) {
                citiesData[adCount.rows[i].ad_id].hasADs = true;
              }
            });

            console.log('querying map ids');
            const queryMapIds = 'SELECT ad_id, map_id FROM digitalscholarshiplab.holc_maps_ads_join_v2';
            request({
              url: `${url}${queryMapIds}`,
              json: true,
            }, (error, response, mapIds) => {
              Object.keys(mapIds.rows).forEach((i) => {
                const m = mapIds.rows[i];
                if (citiesData[m.ad_id]) {
                  citiesData[m.ad_id].mapIds = [
                    ...citiesData[m.ad_id].mapIds,
                    m.map_id,
                  ];
                }
              });

              console.log('querying demography');
              const queryDemography = 'select * from city_population_data';
              request({
                url: `${url}${queryDemography}`,
                json: true,
              }, (error, response, demographics) => {
                Object.keys(demographics.rows).forEach((i) => {
                  const p = demographics.rows[i];
                  if (citiesData[p.city_id]) {
                    console.log(p);
                    citiesData[p.city_id].population = {
                      1930: {
                        total: p.total_pop_1930,

                        AfricanAmerican: p.black_pop_1930,
                        asianAmerican: p.asian_pacific_1930,
                        nativeAmerican: p.american_indian_eskimo_1930,
                        other: p.other_1930,
                        white: p.white_pop_1930,

                        fb: p.fb_30,
                        fb_percent: p.fb30_percent,
                        fb_AfricanAmerican: p.fb30_afr_amer,
                        fb_allOther: p.fb30_all_other,
                        fb_Chinese: p.fb30_chinese,
                        fb_Indian: p.fb30_indian,
                        fb_Japanese: p.fb30_japanese,

                        fb_otherRaces: p.fb30_other_races,
                        fb_white: p.fb30_white,
                        native: p.native_pop_1930,
                      },
                      1940: {
                        total: p.total_pop_1940,

                        AfricanAmerican: p.black_pop_1940,
                        asianAmerican: p.asian_pacific_1940,
                        nativeAmerican: p.american_indian_eskimo_1940,
                        other: p.other_1940,
                        white: p.white_pop_1940,

                        fb: p.fb_40,
                        fb_percent: p.fb40_percent,
                        fb_AfricanAmerican: p.fb40_afr_amer,
                        fb_allOther: p.fb40_all_other,
                        fb_Chinese: p.fb40_chinese,
                        fb_Indian: p.fb40_indian,
                        fb_Japanese: p.fb40_japanese,

                        fb_otherRaces: p.fb40_other_races,
                        fb_white: p.fb40_white,
                        native: p.native_pop_1940,
                      },
                    };
                    citiesData[p.city_id].displayPop = parsePopSnippetDisplayData(citiesData[p.city_id].population);
                  }
                });
                // write the file
                //console.log(JSON.stringify(citiesData));
                fs.writeFileSync('../data/Cities.json', JSON.stringify(citiesData));
                console.log('wrote Cities.json');

                eventEmitter.emit('citiesDataCreated');
              });
            });
          });
        });
      });
    }
  });
};

const createAreaData = () => {
  const query = 'select ad_id, holc_id, holc_grade, sheets, name from holc_polygons';
  request({
    url: `${url}${query}`,
    json: true,
  }, (error, response, d) => {
    const areas = d.rows;
    areas.forEach((a) => {
      const { ad_id, holc_id, holc_grade, sheets, name } = a;
      if (citiesData[ad_id]) {
        const { state, name: city, year } = citiesData[ad_id];
        areasData[ad_id] = (areasData[ad_id]) ? areasData[ad_id] : {};
        areasData[ad_id][holc_id] = {
          ad_id,
          name,
          holc_grade,
          sheets,
          url: `//s3.amazonaws.com/holc/${state}/${city.replace(' ', '')}/${year || '19XX'}/`,
          areaDesc: {},
        };
      }
    });

    console.log('areasData Created');
    eventEmitter.emit('areasDataCreated');
  });
};

const createPolygonFilesForCity = ({ ad_id: adId, name, state, year }) => {
  console.log(`querying polygons for ${name}`);
  const query = `select holc_id as id, holc_grade as grade, ST_asgeojson(the_geom, 4) as area_geojson, round(st_area(the_geom::geography)) as area, round(st_xmin(ST_SetSRID(the_geom,4326))::numeric, 3) as minlng , round(st_ymin(ST_SetSRID(the_geom, 4326))::numeric, 3) as minlat, round(st_xmax(ST_SetSRID(the_geom, 4326))::numeric, 3) as maxlng, round(st_ymax(ST_SetSRID(the_geom, 4326))::numeric, 3) as maxlat from holc_polygons where ad_id = ${adId}`;
  request({
    url: `${url}${query}`,
    json: true,
  }, (error, response, d) => {
    const polygons = d.rows.map((p) => {
      const { id, grade, area_geojson, area, minlat, minlng, maxlat, maxlng } = p;
      const areaGeojson = JSON.parse(area_geojson);
      const polygonBoundingBox = [[minlat, minlng], [maxlat, maxlng]];
      let labelCoords;
      if (areaGeojson.coordinates) {
        // find the largest polygon
        let largest = 0;
        let iOfLargest = 0;
        if (areaGeojson.type === 'MultiPolygon') {
          areaGeojson.coordinates.forEach((coordinates, j) => {
            const area = GeojsonArea.geometry({ type: 'Polygon', coordinates });
            if (area > largest) {
              iOfLargest = j;
              largest = area;
            }
          });
        }

        // select the polygon to use
        const theCoords = areaGeojson.coordinates[iOfLargest];

        // calculate the point
        if (theCoords) {
          labelCoords = Polylabel(theCoords, 0.0001);
          labelCoords = [labelCoords[1], labelCoords[0]].map(c => Math.round(c * 1000) / 1000);
        }
      }
      return {
        id,
        ad_id: adId,
        grade,
        area_geojson: JSON.parse(area_geojson),
        area,
        polygonBoundingBox,
        labelCoords,
      };
    });

    const fileName = `${`${state}${name}${year || '19XX'}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;
    fs.writeFileSync(`../static/polygons/${fileName}`, JSON.stringify(polygons));
    fs.writeFileSync(`../build/static/polygons/${fileName}`, JSON.stringify(polygons));
    console.log(`wrote polygons/${fileName}\n`);

    // run the next city
    const adIds = Object.keys(citiesData).map(id => parseInt(id));
    const iNum = adIds.findIndex(id => id === adId);
    if (iNum < adIds.length - 1) {
      const nextAdId = adIds[iNum + 1];
      createPolygonFilesForCity(citiesData[nextAdId]);
    }
  });
};

const createADsForCity = (adId) => {
  const { name, state, year } = citiesData[Object.keys(citiesData).find(id => parseInt(id) === parseInt(adId))];
  console.log(`querying ADs for ${name}`);
  const queryAreas = `SELECT holc_id, cat_id, sub_cat_id, _order as order, data FROM holc_ad_data right join holc_polygons on holc_ad_data.polygon_id = holc_polygons.neighborhood_id join holc_ads on city_id = holc_polygons.ad_id where holc_ads.city_id = ${adId} and holc_id is not null`;
  request({
    url: `${url}${queryAreas}`,
    json: true,
  }, (error, response, a) => {
    a.rows.forEach((d) => {
      const { holc_id: holcId, cat_id: catId, sub_cat_id: subcatId, order, data } = d;
      if (data && !areasData[adId]) {
        areasData[adId] = {};
      }
      if (data && !areasData[adId][holcId]) {
        areasData[adId][holcId] = { areaDesc: false };
      }
      if (data && !areasData[adId][holcId].areaDesc) {
        areasData[adId][holcId].areaDesc = {};
      }

      // define category id for area description if undefined
      //console.log(catId, subcatId, order, areasData[adId][holcId].areaDesc[catId], catId && typeof areasData[adId][holcId].areaDesc[catId] === 'undefined');
      if (catId && !subcatId && !order) {
        areasData[adId][holcId].areaDesc[catId] = data;
      } else if (catId && typeof areasData[adId][holcId].areaDesc[catId] === 'undefined') {
        areasData[adId][holcId].areaDesc[catId] = {};
      }
      // check for subcategories
      if (subcatId) {
        // look for order
        if (order) {
          areasData[adId][holcId].areaDesc[catId][subcatId] = areasData[adId][holcId].areaDesc[catId][subcatId] || {};
          areasData[adId][holcId].areaDesc[catId][subcatId][order] = data;
        } else {
          areasData[adId][holcId].areaDesc[catId][subcatId] = data;
        }
      } else if (order) {
        areasData[adId][holcId].areaDesc[catId][order] = data;
      }
    });

    // write the file
    const fileName = `${`${state}${name}${year || '1911'}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;
    fs.writeFileSync(`../static/ADs/${fileName}`, JSON.stringify(areasData[adId]));
    fs.writeFileSync(`../build/static/ADs/${fileName}`, JSON.stringify(areasData[adId]));
    console.log(`wrote ADs/${fileName}\n`);

    // run the next city
    const adIds = Object.keys(areasData).map(id => parseInt(id));
    const iNum = adIds.findIndex(id => id === adId);
    if (iNum < adIds.length - 1) {
      const nextAdId = adIds[iNum + 1];
      createADsForCity(nextAdId);
    }
  });
};

const createCityData = (cityId) => {
  const c = citiesData[cityId];
  const cityData = {
    id: parseInt(cityId),
    name: c.name,
    state: c.state,
    year: c.year,
    slug: c.slug,
    form_id: c.form_id,
    bucketPath: `//s3.amazonaws.com/holc/tiles/${c.state}/MAPPARENTFILENAME/${c.year}/`,
    polygons: {},
  };

  const cityDataSelected = {
    id: parseInt(cityId),
    loopLatLng: [c.centerLat, c.centerLng],
  };

  const queryRingData = `WITH the_hull as (select ST_Collect(digitalscholarshiplab.holc_polygons.the_geom_webmercator) as hull, ad_id FROM digitalscholarshiplab.holc_polygons where ad_id = ${cityId} GROUP BY ad_id), maxdist as (SELECT st_distance_sphere(st_transform(st_endpoint(st_longestline(st_transform(ST_SetSRID(ST_MakePoint(looplng,looplat),4326),3857), hull)), 4326), ST_SetSRID(ST_MakePoint(looplng,looplat), 4326)) as outerringradius, st_length(st_longestline(st_transform(ST_SetSRID(ST_Point(looplng,looplat),4326),3857), hull)) / 3.5 as distintv, ST_Transform(ST_SetSRID(ST_MakePoint(looplng,looplat),4326),3857)::geometry as the_point from the_hull join holc_ads on the_hull.ad_id = holc_ads.city_id and holc_ads.city_id = ${cityId} Order by distintv DESC Limit 1 ), city_buffers as (SELECT ST_Transform((ST_Buffer(the_point,distintv * 3.5,'quad_segs=32')::geometry),3857) as buffer4, ST_Transform((ST_Buffer(the_point,distintv * 2.5,'quad_segs=32')::geometry),3857) as buffer3, ST_Transform((ST_Buffer(the_point,distintv * 1.5,'quad_segs=32')::geometry),3857) as buffer2, ST_Transform((ST_Buffer(the_point,distintv * 0.5,'quad_segs=32')::geometry),3857) as buffer1 FROM maxdist), city_rings as (SELECT ST_Difference(buffer4, buffer3) as the_geom_webmercator, 4 as ring_id, st_area(ST_Difference(buffer4, buffer3)) as ring_area from city_buffers union all select ST_Difference(buffer3, buffer2) as the_geom_webmercator, 3 as ring_id, st_area(ST_Difference(buffer3, buffer2)) as ring_area from city_buffers union all select ST_Difference(buffer2, buffer1) as the_geom_webmercator, 2 as ring_id, st_area(ST_Difference(buffer2, buffer1)) as ring_area from city_buffers union all select buffer1 as the_webmercator, 1 as ring_id, st_area(buffer1) as ring_area from city_buffers ), combined_grades as (SELECT holc_grade, ST_union(the_geom_webmercator) as the_geom_webmercator FROM digitalscholarshiplab.holc_polygons where ad_id = ${cityId} group by holc_grade) SELECT holc_grade as grade, ring_id as ring, ST_AsGeoJSON(ST_Transform(ST_Intersection(city_rings.the_geom_webmercator, combined_grades.the_geom_webmercator),4326), 4) as the_geojson, ST_AsGeoJSON(ST_Transform(ST_Difference(city_rings.the_geom_webmercator, combined_grades.the_geom_webmercator),4326), 4) as inverted_geojson, st_area(ST_Intersection(city_rings.the_geom_webmercator, combined_grades.the_geom_webmercator)) as area, ST_Area(city_rings.the_geom_webmercator) as ring_area, outerringradius FROM city_rings, combined_grades, maxdist`;

  request({
    url: `${url}${queryRingData}`,
    json: true,
  }, (error, response, ringData) => {
    const rd = ringData.rows;

    cityDataSelected.gradedArea = Object.keys(rd).reduce((cv, i) => cv + rd[i].area, 0);

    cityDataSelected.gradedAreaOfRings = Object.keys(rd).reduce((cv, i) => ({
      1: (rd[i].ring === 1) ? cv['1'] + rd[i].area : cv['1'],
      2: (rd[i].ring === 2) ? cv['2'] + rd[i].area : cv['2'],
      3: (rd[i].ring === 3) ? cv['3'] + rd[i].area : cv['3'],
      4: (rd[i].ring === 4) ? cv['4'] + rd[i].area : cv['4'],
    }), { 1: 0, 2: 0, 3: 0, 4: 0 });

    cityDataSelected.gradedAreaByGrade = Object.keys(rd).reduce((cv, i) => ({
      A: (rd[i].grade === 'A') ? cv.A + rd[i].area : cv.A,
      B: (rd[i].grade === 'B') ? cv.B + rd[i].area : cv.B,
      C: (rd[i].grade === 'C') ? cv.C + rd[i].area : cv.C,
      D: (rd[i].grade === 'D') ? cv.D + rd[i].area : cv.D,
    }), { A: 0, B: 0, C: 0, D: 0 });

    cityDataSelected.gradeStats = ((gradedAreaByGrade, gradedArea) => {
      const grades = ['A', 'B', 'C', 'D'];

      return grades.map(grade => ({
        grade,
        percent: Math.round(gradedAreaByGrade[grade] / gradedArea * 10000) / 10000,
      }));
    })(cityDataSelected.gradedAreaByGrade, cityDataSelected.gradedArea);

    cityDataSelected.ringAreaGeometry = ((rd1) => {
      if (rd1.length === 0) {
        return false;
      }

      const defaultProps = {
        the_geojson: {},
        inverted_geojson: {},
        percent: 0,
        overallPercent: 0,
      };
      const ringAreasGeometry = {
        1: { A: defaultProps, B: defaultProps, C: defaultProps, D: defaultProps },
        2: { A: defaultProps, B: defaultProps, C: defaultProps, D: defaultProps },
        3: { A: defaultProps, B: defaultProps, C: defaultProps, D: defaultProps },
        4: { A: defaultProps, B: defaultProps, C: defaultProps, D: defaultProps },
      };

      rd1.forEach((d) => {
        ringAreasGeometry[d.ring].density = cityDataSelected.gradedAreaOfRings[d.ring] / d.ring_area;
        ringAreasGeometry[d.ring][d.grade] = {
          the_geojson: JSON.parse(d.the_geojson),
          inverted_geojson: JSON.parse(d.inverted_geojson),
          percent: d.area / cityDataSelected.gradedAreaOfRings[d.ring],
          overallPercent: d.area / cityDataSelected.gradedArea,
        };
      });

      return ringAreasGeometry;
    })(rd);


    cityDataSelected.ringStats = ((rd1) => {
      if (!rd1 || Object.keys(rd1).length === 0) {
        return false;
      }

      const formattedStats = [];
      for (let ringId = 1; ringId <= 4; ringId++) {
        const percents = [];
        ['A', 'B', 'C', 'D'].forEach((grade) => {
          if (rd1[ringId][grade].overallPercent > 0) {
            percents.push({
              percent: Math.round(rd1[ringId][grade].percent * 10000) / 10000,
              overallPercent: Math.round(rd1[ringId][grade].overallPercent * 10000) / 10000,
              opacity: Math.round(rd1[ringId].density * 100) / 100,
              ringId: ringId,
              grade: grade,
            });
          }
        });
        formattedStats.push({ percents: percents });
      }

      return formattedStats;
    })(cityDataSelected.ringAreaGeometry);

    cityDataSelected.outerRingRadius = (rd[0]) ? rd[0].outerringradius : false;

    // get the bounding box and center of the polygons
    const queryBBandCenter = `Select round(st_x(st_centroid(ST_SetSRID(st_extent(the_geom),4326)))::numeric, 3) as centerLng, round(st_y(st_centroid(ST_SetSRID(st_extent(the_geom),4326)))::numeric, 3) as centerLat, round(st_xmin(ST_SetSRID(st_extent(the_geom),4326))::numeric, 3) as minlng, round(st_ymin(ST_SetSRID(st_extent(the_geom),4326))::numeric, 3) as minlat, round(st_xmax(ST_SetSRID(st_extent(the_geom),4326))::numeric, 3) as maxlng, round(st_ymax(ST_SetSRID(st_extent(the_geom),4326))::numeric, 3) as maxlat from digitalscholarshiplab.holc_polygons where ad_id = ${cityId}`;
    request({
      url: `${url}${queryBBandCenter}`,
      json: true,
    }, (error, response, bbAndCenter) => {
      const polygonLatLngs = bbAndCenter.rows[0];
      if (polygonLatLngs.minlat) {
        cityData.polygonBoundingBox = [
          [polygonLatLngs.minlat, polygonLatLngs.minlng],
          [polygonLatLngs.maxlat, polygonLatLngs.maxlng],
        ];
        cityData.polygonsCenter = [polygonLatLngs.centerlat, polygonLatLngs.centerlng];
      } else {
        cityData.polygonBoundingBox = null;
        cityData.polygonsCenter = null;
      }

      // get the inverted geojson
      const queryGeojson = `SELECT ST_AsGeoJSON(ST_Transform(st_union(the_geom_webmercator), 4326)) as the_geom from holc_polygons where ad_id = ${cityId}`;
      request({
        url: `${url}${queryGeojson}`,
        json: true,
      }, (error, response, theGeojson) => {
        if (theGeojson.rows[0].the_geom) {
          cityDataSelected.inverted_geojson = ((theGeojson1) => {
            //Create a new set of latlngs, adding our world-sized ring first
            const NWHemisphere = [[0, 0], [0, 90], [-180, 90], [-180, 0], [0, 0]];
            const newLatLngs = [NWHemisphere];
            const holes = [];
            const invertedGeojson = {
              type: theGeojson1.type,
            };

            theGeojson1.coordinates.forEach((polygon) => {
              polygon.forEach((polygonpieces, i2) => {
                if (i2 === 0) {
                  newLatLngs.push(polygonpieces);
                } else {
                  holes.push(polygonpieces);
                }
              });
            });
            invertedGeojson.coordinates = (holes.length > 0) ? [newLatLngs.concat(holes)] : [newLatLngs];
            return invertedGeojson;
          })(JSON.parse(theGeojson.rows[0].the_geom));
        } else {
          cityDataSelected.inverted_geojson = null;
        }

        // get the area descriptions and calculate label positions
        const queryADs = `SELECT holc_ads.city_id as ad_id, dir_name, holc_ads.year, holc_ads.state, holc_polygons.name, sheets, form_id, holc_id, holc_grade, polygon_id, cat_id, sub_cat_id, _order as order, data, ST_asgeojson (holc_polygons.the_geom, 4) as the_geojson, round(st_xmin(st_envelope(holc_polygons.the_geom))::numeric, 3) as bbxmin, round(st_ymin(st_envelope(holc_polygons.the_geom))::numeric, 3) as bbymin, round(st_xmax(st_envelope(holc_polygons.the_geom))::numeric, 3) as bbxmax, round(st_ymax(st_envelope(holc_polygons.the_geom))::numeric, 3) as bbymax, round(st_y(st_centroid(holc_polygons.the_geom))::numeric, 3) as centerlat, round(st_x(st_centroid(holc_polygons.the_geom))::numeric, 3) as centerlng, round((st_area(holc_polygons.the_geom::geography)/1000000 * 0.386102)::numeric, 3) as sqmi FROM holc_ad_data right join holc_polygons on holc_ad_data.polygon_id = holc_polygons.neighborhood_id join holc_ads on city_id = holc_polygons.ad_id where holc_ads.city_id = ${cityId}`;
        request({
          url: `${url}${queryADs}`,
          json: true,
        }, (error1, response1, theADsRaw) => {
          const theADs = theADsRaw.rows;
          cityDataSelected.areaDescriptions = {};
          if (theADs && theADs.length > 0) {
            // determine the label position
            cityDataSelected.labelPositions = theADs
              .filter((d, i) => theADs.findIndex(a => a.holc_id === d.holc_id) === i)
              .map(ad => ({ the_geojson: JSON.parse(ad.the_geojson), id: ad.holc_id }))
              .filter(d => d.the_geojson.coordinates)
              .map((d) => {
                let labelCoords;
                // find the largest polygon
                let largest = 0;
                let iOfLargest = 0;
                if (d.the_geojson.type === 'MultiPolygon') {
                  d.the_geojson.coordinates.forEach((coordinates, j) => {
                    const area = GeojsonArea.geometry({ type: 'Polygon', coordinates });
                    if (area > largest) {
                      iOfLargest = j;
                      largest = area;
                    }
                  });
                }

                // select the polygon to use
                const theCoords = d.the_geojson.coordinates[iOfLargest];

                // calculate the point
                if (theCoords) {
                  labelCoords = Polylabel(theCoords, 0.0001);
                  labelCoords = [labelCoords[1], labelCoords[0]];
                }
                return {
                  id: d.id,
                  point: labelCoords,
                };
              });

            cityDataSelected.areaDescriptions.form_id = theADs[0].form_id;

            cityDataSelected.areaDescriptions.byNeighborhood = ((rawAdData) => {
              const bucketUrl = '//s3.amazonaws.com/holc/';
              const adData = {};

              rawAdData.forEach((row) => {
                const {
                  state,
                  dir_name: dirName,
                  year,
                  holc_id: holcId,
                  holc_grade: holcGrade,
                  the_geojson: theGeojson,
                  centerlat,
                  centerlng,
                  bbymin,
                  bbxmin,
                  bbymax,
                  bbxmax,
                  name,
                  sqmi,
                  sheets,
                  cat_id: catId,
                  sub_cat_id: subcatId,
                  order,
                  data,
                } = row;
                const urlPath = `${state}/${dirName}/${year}/`;
                const adImageUrl = `${bucketUrl}ads/${urlPath}${holcId}`;

                // append the polygons to the city data--probably refactor as this is not where this should go
                cityData.polygons[holcId] = (cityData.polygons[holcId]) ? cityData.polygons[holcId] : {};
                cityData.polygons[holcId].id = holcId;
                cityData.polygons[holcId].grade = holcGrade;
                cityData.polygons[holcId].area_geojson = (!cityData.polygons[holcId].area_geojson)
                  ? JSON.parse(theGeojson)
                  : cityData.polygons[holcId].area_geojson;

                // define id if undefined
                adData[holcId] = adData[holcId] || {};

                adData[holcId].area_geojson_inverted = (!adData[holcId].area_geojson_inverted)
                  ? ((geojson) => {
                    //Create a new set of latlngs, adding our world-sized ring first
                    const NWHemisphere = [[0, 0], [0, 90], [-180, 90], [-180, 0], [0, 0]];
                    const newLatLngs = [NWHemisphere];
                    const holes = [];

                    geojson.coordinates.forEach((polygon) => {
                      polygon.forEach((polygonpieces, i2) => {
                        if (i2 === 0) {
                          newLatLngs.push(polygonpieces);
                        } else {
                          holes.push(polygonpieces);
                        }
                      });
                    });
                    geojson.coordinates = (holes.length > 0) ? [newLatLngs.concat(holes)] : [newLatLngs];
                    return geojson;
                  })(JSON.parse(theGeojson))
                  : adData[holcId].area_geojson_inverted;
                adData[holcId].center = [centerlat, centerlng];
                adData[holcId].boundingBox = [[bbymin, bbxmin], [bbymax, bbxmax]];
                adData[holcId].name = name;
                adData[holcId].holc_grade = holcGrade;
                adData[holcId].sqmi = sqmi;

                adData[holcId].url = `${bucketUrl}tiles/${urlPath}full-size/${holcId}.jpg`;
                adData[holcId].tileUrl = `${adImageUrl}/{z}/{x}_{y}.png`;
                adData[holcId].thumbnailUrl = `${adImageUrl}/thumbnail.jpg`;
                adData[holcId].bucketPath = `${bucketUrl}tiles/${urlPath}`;

                adData[holcId].sheets = sheets;

                // define area description if undefined
                if (typeof adData[holcId].areaDesc === 'undefined' || typeof adData[holcId].areaDesc === 'boolean') {
                  adData[holcId].areaDesc = {};
                }

                // define category id for area description if undefined
                if (catId && !subcatId && !order) {
                  adData[holcId].areaDesc[catId] = data;
                } else if (catId && typeof adData[holcId].areaDesc[catId] === 'undefined') {
                  adData[holcId].areaDesc[catId] = {};
                }
                //console.log(553, holcId, catId, subcatId, order);
                // check for subcategories
                if (subcatId) {
                  //console.log(556, holcId, catId, subcatId, order);
                  // look for order
                  if (order) {
                    //console.log(561, holcId, catId, subcatId, order);
                    adData[holcId].areaDesc[catId][subcatId] = adData[holcId].areaDesc[catId][subcatId] || {};
                    //console.log(adData[holcId].areaDesc[catId][subcatId]);
                    adData[holcId].areaDesc[catId][subcatId][order] = data;
                    //console.log(adData[holcId].areaDesc[catId][subcatId]);
                  } else {
                    adData[holcId].areaDesc[catId][subcatId] = data;
                  }
                } else if (order) {
                  adData[holcId].areaDesc[catId][order] = data;
                }

                if (Object.keys(adData[holcId].areaDesc).length === 0) {
                  adData[holcId].areaDesc = false;
                }
              });

              return adData;
            })(theADs);
          }

          // write the files
          const fileName = `${`${cityData.state}-${cityData.name}-${cityData.year}`.replace(/[^a-zA-Z0-9]/g, '')}.json`;
          fs.writeFileSync(`../static/cities/${fileName}`, JSON.stringify(cityData));
          fs.writeFileSync(`../build/static/cities/${fileName}`, JSON.stringify(cityData));
          console.log(`wrote cities/${fileName}`);
          fs.writeFileSync(`../static/citiesSelected/${fileName}`, JSON.stringify(cityDataSelected));
          fs.writeFileSync(`../build/static/citiesSelected/${fileName}`, JSON.stringify(cityDataSelected));
          console.log(`wrote citiesSelected/${fileName}`);

          // run the next city
          const iNum = Object.keys(citiesData).findIndex(id => id === cityId);
          if (iNum < Object.keys(citiesData).length - 1) {
            createCityData(Object.keys(citiesData)[iNum + 1]);
          }
        });
      });
    });
  });
};

eventEmitter.on('rastersDataCreated', () => createCitiesData());

// eventEmitter.on('citiesDataCreated', () => {
//   createAreaData();
//   const adId = Object.keys(citiesData)[0];
//   createPolygonFilesForCity(citiesData[adId]);
// });

// eventEmitter.on('areasDataCreated', () => {
//   const adId = Object.keys(areasData)[0];
//   createADsForCity(adId);
// });

createRastersData();
//createCitiesData();

