const fs = require('fs');
const events = require('events');
const request = require('request');
const Polylabel = require('polylabel');
const stateAbbrs = require('../data/state_abbr.json');

const eventEmitter = new events.EventEmitter();

const url = 'https://digitalscholarshiplab.cartodb.com/api/v1/sql?format=JSON&q=';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

let rastersData;
const citiesData = {};

const createRastersData = () => {
  const queryOverlaps = 'SELECT distinct(hm1.map_id) FROM digitalscholarshiplab.holc_maps AS hm1, digitalscholarshiplab.holc_maps AS hm2 WHERE hm1.map_id <> hm2.map_id AND ST_Overlaps(hm1.the_geom, hm2.the_geom)';

  request({
    url: `${url}${queryOverlaps}`,
    json: true,
  }, (error, response, theOverlaps) => {
    const overlaps = theOverlaps.rows.map(overlapObj => overlapObj.map_id);

    // get the raster data
    const queryRasters = 'SELECT holc_maps.*, ST_asgeojson(holc_maps.the_geom, 4) as the_geojson, st_xmin(holc_maps.the_geom) as minLng, st_xmax(holc_maps.the_geom) as maxLng, st_ymin(holc_maps.the_geom) as minLat, st_ymax(holc_maps.the_geom) as maxLat, st_x(st_centroid(holc_maps.the_geom)) as centerLng, st_y(st_centroid(holc_maps.the_geom)) as centerLat FROM holc_maps';
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
          url: `//s3.amazonaws.com/holc/tiles/${r.state}/${r.file_name.replace(/\s+/g, '')}/${r.year}/{z}/{x}/{y}.png`,
          retinaUrl: `//s3.amazonaws.com/holc/tiles_retina/${r.state}/${r.file_name.replace(/\s+/g, '')}/${r.year}/{z}/{x}/{y}.png`,
          mapUrl: (!r.inset) ? `//s3.amazonaws.com/holc/tiles/${r.state}/${r.file_name.replace(/\s+/g, '')}/${r.year}/holc-scan.jpg` : null,
          rectifiedUrl: `//s3.amazonaws.com/holc/tiles/${r.state}/${r.file_name.replace(/\s+/g, '')}/${r.year}/rectified.zip`,
        };
      });
      // write the file
      fs.writeFileSync('../data/Rasters.json', JSON.stringify(rastersData));

      eventEmitter.emit('rastersDataCreated');
    });
  });
};

const createCitiesData = () => {
  const query = "WITH polygon_bounds as (select ad_id, st_xmin(st_envelope(st_collect(holc_polygons.the_geom))) as bbxmin, st_ymin(st_envelope(st_collect(holc_polygons.the_geom))) as bbymin, st_xmax(st_envelope(st_collect(holc_polygons.the_geom))) as bbxmax, st_ymax(st_envelope(st_collect(holc_polygons.the_geom))) as bbymax FROM holc_polygons group by ad_id), has_ads as (select count(data), ad_id from holc_ad_data join holc_polygons on holc_ad_data.polygon_id = holc_polygons.neighborhood_id group by ad_id) SELECT holc_ads.city_id as ad_id, city, state, holc_ads.year, looplat::numeric, looplng::numeric, form_id, total_pop_1940, total_pop_1930, american_indian_eskimo_1930, american_indian_eskimo_1940, asian_pacific_1930 as asian_pacific_islander_1930, asian_pacific_1940 as asian_pacific_1940, black_pop_1930, black_pop_1940, white_pop_1930, white_pop_1940, fb_30, fb30_afr_amer, fb30_all_other, fb30_chinese, fb30_indian, fb30_japanese, fb30_other_races, fb30_white, native_pop_1930, fb_40, fb40_afr_amer, fb40_all_other, fb40_chinese, fb40_indian, fb40_japanese, fb40_other_races, fb40_white, native_pop_1940, images, case when has_ads.ad_id is not null then true else false end as has_ads, sum(st_area(holc_polygons.the_geom_webmercator)) / 1609.34^2 as total_area, sum(CASE WHEN holc_grade = 'A' THEN st_area(holc_polygons.the_geom_webmercator) ELSE 0 END) / 1609.34^2 as area_a, sum(CASE WHEN holc_grade = 'B' THEN st_area(holc_polygons.the_geom_webmercator) ELSE 0 END) / 1609.34^2 as area_b, sum(CASE WHEN holc_grade = 'C' THEN st_area(holc_polygons.the_geom_webmercator) ELSE 0 END) / 1609.34^2 as area_c, sum(CASE WHEN holc_grade = 'D' THEN st_area(holc_polygons.the_geom_webmercator) ELSE 0 END) / 1609.34^2 as area_d, bbxmin, bbymin, bbxmax, bbymax, array_agg(distinct map_id) as map_ids FROM holc_polygons right join holc_ads on holc_polygons.ad_id = holc_ads.city_id left join polygon_bounds on holc_ads.city_id = polygon_bounds.ad_id join holc_maps_ads_join on holc_maps_ads_join.ad_id = holc_ads.city_id left join has_ads on has_ads.ad_id = holc_ads.city_id and holc_ads.looplng is not null and holc_ads.looplat is not null group by holc_ads.city_id, city, state, holc_ads.year, form_id, looplat, looplng, total_pop_1940, total_pop_1930, american_indian_eskimo_1930, american_indian_eskimo_1940, asian_pacific_1930, asian_pacific_1940, black_pop_1930, black_pop_1940, white_pop_1930, white_pop_1940, fb_30, fb30_afr_amer, fb30_all_other, fb30_chinese, fb30_indian, fb30_japanese, fb30_other_races, fb30_white, native_pop_1930, fb_40, fb40_afr_amer, fb40_all_other, fb40_chinese, fb40_indian, fb40_japanese, fb40_other_races, fb40_white, native_pop_1940, images, has_ads, bbxmin, bbymin, bbxmax, bbymax  order by state, city";


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

  request({
    url: `${url}${query}`,
    json: true,
  }, (error, response, cities) => {
    if (!error && response.statusCode === 200) {
      Object.keys(cities.rows).forEach((i) => {
        const c = cities.rows[i];
        citiesData[c.ad_id] = {
          ad_id: c.ad_id,
          name: c.city,
          state: c.state,
          year: (c.year) ? c.year.replace(/(\r\n\t|\n|\r\t)/gm, '') : null,
          searchName: `${c.city} ${stateAbbrs[c.state]} ${c.state}`,
          slug: `${c.city.toLowerCase().replace(/ +/g, '-')}-${c.state.toLowerCase()}`,
          form_id: c.form_id,
          centerLat: c.looplat,
          centerLng: c.looplng,
          bounds: (c.bbymin && c.bbxmin && c.bbymax && c.bbxmax) ? [[c.bbymin, c.bbxmin], [c.bbymax, c.bbxmax]] : null,
          hasImages: c.images,
          hasADs: c.has_ads,
          population: {
            1930: {
              total: c.total_pop_1930,

              AfricanAmerican: c.black_pop_1930,
              asianAmerican: c.asian_pacific_1930,
              nativeAmerican: c.american_indian_eskimo_1930,
              other: c.other_1930,
              white: c.white_pop_1930,

              fb: c.fb_30,
              fb_percent: c.fb30_percent,
              fb_AfricanAmerican: c.fb30_afr_amer,
              fb_allOther: c.fb30_all_other,
              fb_Chinese: c.fb30_chinese,
              fb_Indian: c.fb30_indian,
              fb_Japanese: c.fb30_japanese,

              fb_otherRaces: c.fb30_other_races,
              fb_white: c.fb30_white,
              native: c.native_pop_1930,
            },
            1940: {
              total: c.total_pop_1940,

              AfricanAmerican: c.black_pop_1940,
              asianAmerican: c.asian_pacific_1940,
              nativeAmerican: c.american_indian_eskimo_1940,
              other: c.other_1940,
              white: c.white_pop_1940,

              fb: c.fb_40,
              fb_percent: c.fb40_percent,
              fb_AfricanAmerican: c.fb40_afr_amer,
              fb_allOther: c.fb40_all_other,
              fb_Chinese: c.fb40_chinese,
              fb_Indian: c.fb40_indian,
              fb_Japanese: c.fb40_japanese,

              fb_otherRaces: c.fb40_other_races,
              fb_white: c.fb40_white,
              native: c.native_pop_1940,
            },
          },
          hasPolygons: (c.total_area !== null),
          area: {
            total: Math.round(c.total_area * 100) / 100,
            a: Math.round(c.area_a * 100) / 100,
            b: Math.round(c.area_b * 100) / 100,
            c: Math.round(c.area_c * 100) / 100,
            d: Math.round(c.area_d * 100) / 100,
          },
          maps: [],
          mapIds: c.map_ids,
        };

        citiesData[c.ad_id].displayPop = parsePopSnippetDisplayData(citiesData[c.ad_id].population);
      });

      // write the file
      fs.writeFileSync('../data/Cities.json', JSON.stringify(citiesData));
      console.log('wrote Cities.json');

      eventEmitter.emit('citiesDataCreated');
    }
  });
};

const createCityData = (cityId) => {
  const c = citiesData[cityId];
  const cityData = {
    id: cityId,
    name: c.name,
    state: c.state,
    year: c.year,
    slug: c.slug,
    form_id: c.form_id,
    bucketPath: `//s3.amazonaws.com/holc/tiles/${c.state}/MAPPARENTFILENAME/${c.year}/`,
  };

  const cityDataSelected = {
    id: cityId,
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

        // get the area descriptions
        const queryADs = `SELECT holc_ads.city_id as ad_id, dir_name, holc_ads.year, holc_ads.state, holc_polygons.name, sheets, form_id, holc_id, holc_grade, polygon_id, cat_id, sub_cat_id, _order as order, data, ST_asgeojson (holc_polygons.the_geom, 4) as the_geojson, round(st_xmin(st_envelope(holc_polygons.the_geom))::numeric, 3) as bbxmin, round(st_ymin(st_envelope(holc_polygons.the_geom))::numeric, 3) as bbymin, round(st_xmax(st_envelope(holc_polygons.the_geom))::numeric, 3) as bbxmax, round(st_ymax(st_envelope(holc_polygons.the_geom))::numeric, 3) as bbymax, round(st_y(st_centroid(holc_polygons.the_geom))::numeric, 3) as centerlat, round(st_x(st_centroid(holc_polygons.the_geom))::numeric, 3) as centerlng, round((st_area(holc_polygons.the_geom::geography)/1000000 * 0.386102)::numeric, 3) as sqmi FROM holc_ad_data right join holc_polygons on holc_ad_data.polygon_id = holc_polygons.neighborhood_id join holc_ads on city_id = holc_polygons.ad_id where holc_ads.city_id = ${cityId}`;
        request({
          url: `${url}${queryADs}`,
          json: true,
        }, (error1, response1, theADsRaw) => {
          const theADs = theADsRaw.rows;
          cityDataSelected.areaDescriptions = {};
          if (theADs && theADs.length > 0) {
            cityDataSelected.areaDescriptions.form_id = theADs[0].form_id;

            cityDataSelected.areaDescriptions.byNeighborhood = ((rawAdData) => {
              const bucketUrl = '//s3.amazonaws.com/holc/';
              const adData = {};

              rawAdData.forEach((row) => {
                const d = row;
                const urlPath = `${d.state}/${d.dir_name}/${d.year}/`;
                const adImageUrl = `${bucketUrl}ads/${urlPath}${d.holc_id}`;

                // define id if undefined
                if (typeof adData[d.holc_id] === 'undefined') {
                  adData[d.holc_id] = {};
                }


                let labelCoords = [d.centerlat, d.centerlng];
                const coords = JSON.parse(d.the_geojson).coordinates[0];
                if (coords.length === 1) {
                  labelCoords = Polylabel(coords, 0.0001);
                  labelCoords = [labelCoords[1], labelCoords[0]];
                }

                adData[d.holc_id].area_geojson = (!adData[d.holc_id].area_geojson)
                  ? JSON.parse(d.the_geojson)
                  : adData[d.holc_id].area_geojson;
                adData[d.holc_id].area_geojson_inverted = (!adData[d.holc_id].area_geojson_inverted)
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
                  })(JSON.parse(d.the_geojson))
                  : adData[d.holc_id].area_geojson_inverted;
                adData[d.holc_id].labelCoords = labelCoords;
                adData[d.holc_id].center = [d.centerlat, d.centerlng];
                adData[d.holc_id].boundingBox = [[d.bbymin, d.bbxmin], [d.bbymax, d.bbxmax]];
                adData[d.holc_id].name = d.name;
                adData[d.holc_id].holc_grade = d.holc_grade;
                adData[d.holc_id].sqmi = d.sqmi;

                adData[d.holc_id].url = `${bucketUrl}tiles/${urlPath}full-size/${d.holc_id}.jpg`;
                adData[d.holc_id].tileUrl = `${adImageUrl}/{z}/{x}_{y}.png`;
                adData[d.holc_id].thumbnailUrl = `${adImageUrl}/thumbnail.jpg`;
                adData[d.holc_id].bucketPath = `${bucketUrl}tiles/${urlPath}`;

                adData[d.holc_id].sheets = d.sheets;

                // define area description if undefined
                if (typeof adData[d.holc_id].areaDesc === 'undefined' || typeof adData[d.holc_id].areaDesc === 'boolean') {
                  adData[d.holc_id].areaDesc = {};
                }

                // define category id for area description if undefined
                if (d.cat_id && d.sub_cat_id === '' && d.order === null) {
                  adData[d.holc_id].areaDesc[d.cat_id] = d.data;
                } else if (d.cat_id && typeof adData[d.holc_id].areaDesc[d.cat_id] === 'undefined') {
                  adData[d.holc_id].areaDesc[d.cat_id] = {};
                }
                // check for subcategories
                if (d.sub_cat_id) {
                  // create sub-object if we have a subcategory...
                  if (typeof adData[d.holc_id].areaDesc[d.cat_id][d.sub_cat_id] === 'undefined') {
                    adData[d.holc_id].areaDesc[d.cat_id][d.sub_cat_id] = {};

                    // look for order
                    if (d.order) {
                      adData[d.holc_id].areaDesc[d.cat_id][d.sub_cat_id][d.order] = d.data;
                    } else {
                      adData[d.holc_id].areaDesc[d.cat_id][d.sub_cat_id] = d.data;
                    }
                  }
                } else if (d.order) {
                  adData[d.holc_id].areaDesc[d.cat_id][d.order] = row.data;
                }

                if (Object.keys(adData[d.holc_id].areaDesc).length === 0) {
                  adData[d.holc_id].areaDesc = false;
                }
              });

              return adData;
            })(theADs);
          }

          // write the files
          const fileName = encodeURIComponent(`${cityData.state}-${cityData.name}-${cityData.year}.json`);
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

eventEmitter.on('citiesDataCreated', () => createCityData(Object.keys(citiesData)[0]));
eventEmitter.on('rastersDataCreated', () => createCitiesData());

createRastersData();
