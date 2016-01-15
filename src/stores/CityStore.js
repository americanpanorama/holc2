import { EventEmitter } from 'events';
import AppDispatcher from '../utils/AppDispatcher';
import { AppActionTypes } from '../utils/AppActionCreator';
import CartoDBLoader from '../utils/CartoDBLoader';
import _ from 'lodash';
import Leaflet from 'leaflet';
import CircleToPolygon from '../utils/CircleToPolygon.js'

const CityStore = {

	data: {
		id: null,
		name: null,
		state: null,
		year: null,
		ringAreaSelected: {
			ringId: 0,
			grade: ''
		},
		areas: {},
		ringAreasGeometry: [], // not the rings themselves but the intersection of rings and areas
		loopLatLng: [],
		// the distance in meters between the loop center and the outermost point
		outerRingRadius: null,

		/** Percentages of each ring for each grade, with 
		 * density recording the amount of neighborhood area 
		 * in the ring.
		 * {
		 *   1: {
		 *     'A': float,
		 *     'B': float,
		 *     'C': float,
		 *     'D': float,
		 *     'density': float,
		 *   },
		 *   2: { ... },
		 *   ...
		 }
		 * }
		 */
		ringStats: {},
		areaDescriptions: {}
	},

	// TODO: Make a generic DataLoader class to define an interface,
	// and let CartoDBLoader extend and implement that?
	// Basic idea is that anything with a query method that returns a Promise
	// that resolves with an array of response data or rejects with an error
	// can be used here.
	dataLoader: CartoDBLoader,

	loadData: function (cityId) {
		//console.log('[4a] CityStore makes a data request ...');
		this.dataLoader.query([
			{
				query: "SELECT * from holc_cities where city_id = " + cityId,
				format: "JSON"
			},
			{
				query: "WITH the_hull as (select ST_ConvexHull(ST_Collect(ST_Envelope(holc_polygons.the_geom_webmercator))) as hull, city_id FROM holc_polygons where city_id = " + cityId + " GROUP BY city_id), maxdist as (SELECT st_length( st_transform(st_longestline(    st_transform(ST_SetSRID(ST_Point(looplng,looplat), 4326), 3857), hull  ), 2163)) / 3.5 as distintv, ST_SetSRID(ST_MakePoint( looplng,looplat),4326)::geography as the_point from the_hull join holc_cities on the_hull.city_id = holc_cities.city_id and holc_cities.city_id = " + cityId + " Order by distintv DESC Limit 1 ), city_buffers as (SELECT ST_Transform((ST_Buffer(the_point,distintv * 3.5)::geometry),3857) as buffer4, ST_Transform((ST_Buffer(the_point,distintv * 2.5)::geometry),3857) as buffer3, ST_Transform((ST_Buffer(the_point,distintv * 1.5)::geometry),3857) as buffer2, ST_Transform((ST_Buffer(the_point,distintv * 0.5)::geometry),3857) as buffer1 FROM maxdist ), city_rings as (SELECT ST_Difference(buffer4, buffer3) as the_geom_webmercator, 4 as ring_id, st_area(ST_Difference(buffer4, buffer3)) as ring_area from city_buffers union all select ST_Difference(buffer3, buffer2) as the_geom_webmercator, 3 as ring_id, st_area(ST_Difference(buffer3, buffer2)) as ring_area from city_buffers union all select ST_Difference(buffer2, buffer1) as the_geom_webmercator, 2 as ring_id, st_area(ST_Difference(buffer2, buffer1)) as ring_area from city_buffers union all select buffer1 as the_webmercator, 1 as ring_id, st_area(buffer1) as ring_area from city_buffers ) SELECT rhp.holc_grade, city_rings.ring_id, rhp.holc_id, ring_area, ST_AsGeoJSON(ST_Transform(ST_Intersection(rhp.the_geom_webmercator, city_rings.the_geom_webmercator), 4326)) as the_geojson, st_area(ST_Intersection(rhp.the_geom_webmercator, city_rings.the_geom_webmercator)) as area FROM holc_polygons rhp, city_rings WHERE rhp.city_id = " + cityId + " and ST_Intersects(rhp.the_geom_webmercator, city_rings.the_geom_webmercator)",
				format: "JSON"
			},
			{
				query: "with the_hull as (select ST_ConvexHull(ST_Collect(ST_Envelope(holc_polygons.the_geom_webmercator))) as hull, city_id FROM holc_polygons where city_id = " + cityId + " GROUP BY city_id) select st_length( st_transform(st_longestline(    st_transform(ST_SetSRID(ST_Point(looplng,looplat), 4326), 3857), hull  ), 2163)) as distintv, looplat, looplng from holc_cities join the_hull on the_hull.city_id = holc_cities.city_id and holc_cities.city_id = " + cityId,
				format: "JSON"
			},
			{
				query: "SELECT q.category_id, q.label, q.question, q.question_id, c.category, c.cat_label, ad.answer, ad.neighborhood_id, hp.city_id, hp.holc_grade, hp.holc_id, hp.holc_lette, hp.neighborho, hp.name, hp.location, ST_asgeojson (hp.the_geom) as the_geojson FROM digitalscholarshiplab.questions as q JOIN digitalscholarshiplab.category as c ON c.category_id = q.category_id JOIN area_descriptions as ad ON ad.question_id = q.question_id JOIN holc_polygons as hp ON hp.neighborho = ad.neighborhood_id WHERE city_id=" + cityId,
				format: "JSON"
			}
		]).then((response) => {
			let cityData = response[0][0];
			this.data.id = cityId;
			this.data.name = cityData.name;
			this.data.state = cityData.state;
			this.data.year = cityData.year;
			this.data.ringAreaSelected = {
				ringId: 0,
				grade: ''
			};
			this.data.ringAreasGeometry = response[1];
			this.data.ringStats = this.parseRingStats(this.data.ringAreasGeometry);
			this.data.outerRingRadius = response[2][0].distintv;
			this.data.loopLatLng = [response[2][0].looplat, response[2][0].looplng];
			this.data.areaDescriptions = this.parseAreaDescriptions(response[3]);

			//console.log('[4b] CityStore updated its data and calls storeChanged');
			this.emit(AppActionTypes.storeChanged);

		}, (error) => {
			// TODO: handle this.
			console.log("Commodity received error:", error);
			throw error;
		})
	},

	citySelected: function(cityId) {
		this.loadData(cityId);
	},

	getRingStats: function() {
		return this.data.ringStats;
	},

	getRingAreasGeometry: function() {
		return this.data.ringAreasGeometry;
	},

	getSelectedRingAreas: function() {
		return this.data.ringAreaSelected;
	},

	getOuterRingRadius: function() {
		return this.data.outerRingRadius;
	},

	getLoopLatLng: function() {
		return this.data.loopLatLng;
	},

	getAreaDescriptions: function() {
		return this.data.areaDescriptions;
	},

	queryCategory: function(catNum, catLetter) {
		if (Object.keys(this.data.areaDescriptions).length === 0) {
			return [];
		}

		let arr = []; // array to store results

		Object.keys(this.data.areaDescriptions).map((neighborhoodId, i) => {
			if (this.data.areaDescriptions[neighborhoodId].areaDesc.hasOwnProperty(catNum) && typeof(catLetter) == "undefined") {
				arr.push( { neighborhoodId: neighborhoodId, answer: this.data.areaDescriptions[neighborhoodId].areaDesc[catNum].a });
			} else if (this.data.areaDescriptions[neighborhoodId].areaDesc.hasOwnProperty(catNum) &&this.data.areaDescriptions[neighborhoodId].areaDesc[catNum].hasOwnProperty(catLetter)) {
				arr.push( { neighborhoodId: neighborhoodId, answer: this.data.areaDescriptions[neighborhoodId].areaDesc[catNum][catLetter].a });
			} else {
				arr.push({ neighborhoodId: neighborhoodId, answer: null });
			}
		});

		/* alphanum.js (C) Brian Huisman
		* Based on the Alphanum Algorithm by David Koelle
		* The Alphanum Algorithm is discussed at http://www.DaveKoelle.com
		*
		* Distributed under same license as original
		* 
		* This library is free software; you can redistribute it and/or
		* modify it under the terms of the GNU Lesser General Public
		* License as published by the Free Software Foundation; either
		* version 2.1 of the License, or any later version.
		* 
		* This library is distributed in the hope that it will be useful,
		* but WITHOUT ANY WARRANTY; without even the implied warranty of
		* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
		* Lesser General Public License for more details.
		* 
		* You should have received a copy of the GNU Lesser General Public
		* License along with this library; if not, write to the Free Software
		* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
		*/

		let alphanumCase = function(a, b) {
			function chunkify(t) {
				var tz = new Array();
				var x = 0, y = -1, n = 0, i, j;

				while (i = (j = t.charAt(x++)).charCodeAt(0)) {
					var m = (i == 46 || (i >=48 && i <= 57));
					if (m !== n) {
						tz[++y] = "";
						n = m;
					}
					tz[y] += j;
				}
				return tz;
			}
	
			var aa = chunkify(a.neighborhoodId.toLowerCase());
			var bb = chunkify(b.neighborhoodId.toLowerCase());		
			for (let x = 0; aa[x] && bb[x]; x++) {
				if (aa[x] !== bb[x]) {
					var c = Number(aa[x]), d = Number(bb[x]);
					if (c == aa[x] && d == bb[x]) {
						return c - d;
					} else return (aa[x] > bb[x]) ? 1 : -1;
				}
			}
			return aa.length - bb.length;
		}

		arr.sort(alphanumCase);

		return arr;
	},

	parseRingStats: function(ringAreaGeometry) {
		let ringCumulative = {
				1: {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'total': 0},
				2: {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'total': 0},
				3: {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'total': 0},
				4: {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'total': 0}
			},
			areaOfRings = {},
			ringStats = { 1 : {}, 2: {}, 3: {}, 4: {} };
		ringAreaGeometry.map((ring) => {
			ringCumulative[ring.ring_id][ring.holc_grade] += ring.area;
			ringCumulative[ring.ring_id].total += ring.area;
			areaOfRings[ring.ring_id] = ring.ring_area;
		});
		Object.keys(ringCumulative).map((ring_id) => {
			Object.keys(ringCumulative[ring_id]).map((grade) => {
				ringStats[ring_id][grade] = ringCumulative[ring_id][grade] / ringCumulative[ring_id].total;
				ringStats[ring_id].density = ringCumulative[ring_id].total / areaOfRings[ring_id];
			});
		});
		return ringStats;
	},

	parseAreaDescriptions: function(rawAdData) {
		let adData = {};

		for(var row in rawAdData) {
			// define id if undefined
			if(typeof adData[rawAdData[row].holc_id] == "undefined") {
				adData[rawAdData[row].holc_id] = {};
			}
			// assign properties    
			adData[rawAdData[row].holc_id].area_geojson = JSON.parse(rawAdData[row].the_geojson);
			//adData[rawAdData[row].holc_id].name = rawAdData[row].name;
			adData[rawAdData[row].holc_id].holc_grade = rawAdData[row].holc_grade;
			
			// define area description if undefined
			if(typeof adData[rawAdData[row].holc_id].areaDesc == "undefined") {
				adData[rawAdData[row].holc_id].areaDesc = {};
			}
			
			// define category id for area description if undefined                
			if(typeof adData[rawAdData[row].holc_id].areaDesc[rawAdData[row].cat_label] == "undefined") {
				adData[rawAdData[row].holc_id].areaDesc[rawAdData[row].cat_label] = {};
			}
			// check for labels, i.e. subcategories
			if(rawAdData[row].label != "") {
				// create sub-object if we have a subcategory...
				if(typeof adData[rawAdData[row].holc_id].areaDesc[rawAdData[row].cat_label][rawAdData[row].label] == "undefined") {
					adData[rawAdData[row].holc_id].areaDesc[rawAdData[row].cat_label][rawAdData[row].label] = {
						'question'     : rawAdData[row].question,
						'answer'    : rawAdData[row].answer
					}
				}
			} else { // ...otherwise create q+a fields within category
				adData[rawAdData[row].holc_id].areaDesc[rawAdData[row].cat_label] = {
					'question'     : rawAdData[row].question,
					'answer'    : rawAdData[row].answer
				}
			}    // end for
		}  // end if

		return adData;
	}

};

// Mixin EventEmitter functionality
Object.assign(CityStore, EventEmitter.prototype);

// Register callback to handle all updates
AppDispatcher.register((action) => {

	switch (action.type) {

		case AppActionTypes.loadInitialData:
			//console.log(`[2] The '${ AppActionTypes.loadInitialData }' event is handled by CityStore....`);
			CityStore.loadData(action.state.selectedCity);
			break;

		case AppActionTypes.citySelected:
			CityStore.citySelected(action.value);
			break;

		case AppActionTypes.ringAreaSelected:
			CityStore.ringAreaSelected(action.value);
			break;
	}


	return true;

});


export default CityStore;