import { EventEmitter } from 'events';
import AppDispatcher from '../utils/AppDispatcher';
import { AppActionTypes } from '../utils/AppActionCreator';
import MapStateStore from '../stores/MapStateStore';
import RasterStore from './RasterStore';
import Cities from '../../data/Cities.json';
import stateAbbrs from '../../data/state_abbr.json';

const CitiesStore = {

  data: {
    cities: Cities,
  },

  calculateSimpleRingsRadii: function (areaData) {
    let furthestRadius = 25000,
      fullArea = Math.PI * furthestRadius * furthestRadius,
      outerRadius,
      innerRadius = 0,
      donutArea,
      gradeArea,
      radii = {};

    ['d','c','b','a'].forEach((grade) => {
      let donutholeArea = Math.PI * innerRadius * innerRadius,
        gradeArea = fullArea * (areaData[grade] / areaData.total),
        outerRadius = Math.round(Math.sqrt((gradeArea + donutholeArea) / Math.PI));
      radii[grade] = {
        'inner': innerRadius,
        'outer': outerRadius
      };
      innerRadius = outerRadius;
    });

    return radii;
  },

  parsePopSnippetDisplayData: function(popStats) {
    let displayPop = {
      1930: this.parsePopSnippetDisplayDataDecade(popStats[1930]),
      1940: this.parsePopSnippetDisplayDataDecade(popStats[1940])
    };

    displayPop[1930].percents = displayPop[1930].percents.filter(pop30 => {
      let pop40 = displayPop[1940].percents.filter(pop40temp => (pop30.label == pop40temp.label));
      if (pop40.length == 0 && pop30.proportion >= 0.005) {
        displayPop[1940].percents.push({
          label: pop30.label,
          proportion: null 
        });
      }
      return (pop30.proportion >= 0.005);
    });

    displayPop[1940].percents = displayPop[1940].percents.filter(pop40 => {
      let pop30 = displayPop[1930].percents.filter(pop30temp => (pop30temp.label == pop40.label));
      if (pop30.length == 0 && pop40.proportion >= 0.005) {
        displayPop[1930].percents.push({
          label: pop40.label,
          proportion: null
        });
      }
      return (pop40.proportion >= 0.005);
    });

    displayPop[1940].percents.sort((a,b) => a.proportion < b.proportion);
    displayPop.order = displayPop[1940].percents.map(pop40 => pop40.label);

    return displayPop;
  },

  parsePopSnippetDisplayDataDecade: function(popStatsDecade) {
    let displayData = { total: popStatsDecade.total, percents: [] };

    // if there's data for foreign-born & native-born whites, use that
    if (popStatsDecade.fb_white && popStatsDecade.white) {
      displayData.percents.push( {
        label: 'Native-born white',
        proportion: (popStatsDecade.white - popStatsDecade.fb_white) / popStatsDecade.total 
      });
      displayData.percents.push( {
        label: 'Foreign-born white',
        proportion: popStatsDecade.fb_white / popStatsDecade.total 
      });
    } else if (popStatsDecade.white) {
      displayData.percents.push( {
        label: 'white',
        proportion: popStatsDecade.white / popStatsDecade.total 
      });
    }

    if (popStatsDecade.AfricanAmerican) {
      displayData.percents.push( {
        label: 'African American',
        proportion: popStatsDecade.AfricanAmerican / popStatsDecade.total 
      });
    }

    if (popStatsDecade.asianAmerican) {
      displayData.percents.push( {
        label: 'Asian American',
        proportion: popStatsDecade.asianAmerican / popStatsDecade.total 
      });
    }

    if (popStatsDecade.nativeAmerican) {
      displayData.percents.push( {
        label: 'Native American',
        proportion: popStatsDecade.nativeAmerican / popStatsDecade.total 
      });
    }

    if (popStatsDecade.fb_Chinese) {
      displayData.percents.push( {
        label: 'Foreign-born Chinese',
        proportion: popStatsDecade.fb_Chinese / popStatsDecade.total 
      });
    }

    if (popStatsDecade.fb_Japanese) {
      displayData.percents.push( {
        label: 'Foreign-born Japanese',
        proportion: popStatsDecade.fb_Japanese / popStatsDecade.total 
      });
    }

    if (popStatsDecade.fb_AfricanAmerican) {
      displayData.percents.push( {
        label: 'Foreign-born African American',
        proportion: popStatsDecade.fb_AfricanAmerican / popStatsDecade.total 
      });
    }

    return displayData;
  },

  /* GETS */

  getAdIdsFromMapId(mapId) { return (this.data.cities) ? Object.keys(this.data.cities).filter(adId => this.data.cities[adId].mapIds.indexOf(mapId) != -1).map(adId => parseInt(adId)) : []; },

  getADIdFromSlug(slug) { return (this.data.cities) ? Object.keys(this.data.cities).filter(adId => (this.data.cities[adId].slug == slug))[0] : null; },

  getADsList() { return Object.keys(this.data.cities).map(adId => this.data.cities[adId]); },

  getCenterPoint: function(adId) { return (this.data.cities[adId]) ? [ this.data.cities[adId].centerLat, this.data.cities[adId].centerLng] : null; },

  getCitiesMetadata: function() { return this.data.cities; },

  getCityName: function(adId) { return (this.data.cities[adId]) ? this.data.cities[adId].name : null; },

  getMapParentFileName: function(adId) {
    if (!this.data.cities[adId]) {
      return;
    }

    let parent = RasterStore.getMapsFromIds(this.getMapIds(adId)).filter(map => !map.inset);
    if (parent.length >= 1) {
      return parent[0].file_name.replace(/\s+/g, '');
    }
  },

  getDisplayPopStats: function(adId) { return (this.data.cities[adId]) ? this.data.cities[adId].displayPop : null; },

  getFormId: function(adId) { return (this.data.cities[adId]) ? this.data.cities[adId].form_id : null; },

  getFullCityMetadata: function(adId) { return this.data.cities[adId]; },

  getMapIds: function(adId) { return (this.data.cities[adId]) ? this.data.cities[adId].mapIds : []; },

  getMaps: function(adId) { return (this.data.cities[adId]) ? this.data.cities[adId].maps : []; },

  getSlug: function(adId) { return (this.data.cities[adId]) ? this.data.cities[adId].slug : null; },

  getState: function(adId) { return (this.data.cities[adId]) ? this.data.cities[adId].state : null; }, 

  getYear: function(adId) { return (this.data.cities[adId]) ? this.data.cities[adId].year : null; },

  hasLoaded: function () { return true; },

  hasADData: function(adId) { return (this.data.cities[adId] && this.data.cities[adId].hasADs); },

  hasADImages: function(adId) { return (this.data.cities [adId] && this.data.cities[adId].hasImages); },

  hasPolygons: function(adId) { return (this.data.cities[adId] && this.data.cities[adId].hasPolygons); }
};

// Mixin EventEmitter functionality
Object.assign(CitiesStore, EventEmitter.prototype);

export default CitiesStore;
