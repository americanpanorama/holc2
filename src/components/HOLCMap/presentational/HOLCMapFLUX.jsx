import React from 'react';
import PropTypes from 'prop-types';
import * as L from 'leaflet';
import { Map, TileLayer, GeoJson, GeoJSON,  Circle, LayerGroup, Marker, setIconDefaultImagePath, CircleMarker, Tooltip } from 'react-leaflet';

// stores
import AreaDescriptionsStore from '../../../stores/AreaDescriptionsStore';
import CitiesStore from '../../../stores/CitiesStore';
import CityStore from '../../../stores/CityStore';
import MapStateStore from '../../../stores/MapStateStore';
import RasterStore from '../../../stores/RasterStore';
import UserLocationStore from '../../../stores/UserLocationStore';
import DimensionsStore from '../../../stores/DimensionsStore';

// components
//import { Legend } from '@panorama/toolkit';
import CartoDBTileLayer from '../CartoDBTileLayer';
//import { CartoDBTileLayerProd, Legend } from '../../../../panorama';
//import AreaPolygon from './AreaPolygon.jsx';
import Donut from '../Donut/Donut.jsx';

import BaseMap from '../containers/BaseMap';
import ClickableCities from '../containers/ClickableCities';


import cartodbConfig from '../../../../basemaps/cartodb/config.json';
import cartodbLayers from '../../../../basemaps/cartodb/basemaps.json';
import tileLayers from '../../../../basemaps/tileLayers.json';

export default class HOLCMap extends React.Component {

  constructor (props) {
    super(props);

    this.onBringToFrontClick = this.onBringToFrontClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {

  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (this.refs.slider) {
      this.refs.slider.addEventListener('mouseover', () => {
        this.refs.the_map.leafletElement.dragging.disable();
      });
      this.refs.slider.addEventListener('mouseout', () => {
        this.refs.the_map.leafletElement.dragging.enable();
      });
    }

    if (this.refs.neighborhoodPolygonInverted) {
      this.refs.neighborhoodPolygonInverted.leafletElement.bringToBack();

      MapStateStore.getSortOrder().forEach(mapId => {
        if (this.refs['sortingPolygon' + mapId]) {
          this.refs['sortingPolygon' + mapId].leafletElement.bringToBack();
        }
      });
    }

  }

  onBringToFrontClick (event) {
    this.refs['holctiles' + event.target.options.id].leafletElement.bringToFront();
  }

  _isRetina(){
    return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
  }

  _basemapUrl() {
    let url = (MapStateStore.isAboveZoomThreshold()) ? tileLayers.layers[0].urlLabels : tileLayers.layers[0].urlNoLabels;
    url = (this._isRetina()) ? url.replace('0/{z}', '{z}').replace('.png', '@2x.png') : url;
    return url;
  }

  render () {

    const ADs = AreaDescriptionsStore.getVisible(),
      aboveThreshold = MapStateStore.isAboveZoomThreshold(),
      outerRadius = CityStore.getOuterRingRadius(),
      visibleMapsList = MapStateStore.getVisibleHOLCMapsList(),
      legendData = {
        items: [
          'A "Best"',
          'B "Still Desirable"',
          'C "Definitely Declining"',
          'D "Hazardous"',
        ]
      },
      dimensions = DimensionsStore.getDimensions();

    if (!aboveThreshold) {
      legendData.items.unshift('Area for each grade');
    }

    const icon = L.icon({
      iconUrl: '//dsl.richmond.edu/panorama/forcedmigration/static/narrative-icon-selected.svg',
      iconSize: [30, 60]
    });

    return (
      <Map 
        ref='the_map' 
        center={ this.props.state.map.center } 
        zoom={ this.props.state.map.zoom }  
        onMoveend={ this.props.onMapMoved } 
        className='the_map'
        //onClick={ this.props.onMapClick }
        id='the_map'
        style={this.props.style}
      >
        <BaseMap />

        {/* holc tiles */}
        { (aboveThreshold) ?
          visibleMapsList.map((item, i) => {
            return (
              <TileLayer
                ref={ 'holctiles' + item.id } 
                key={ 'holctiles' + item.id }
                url={ (this._isRetina()) ? item.retinaUrl : item.url }
                minZoom={ item.minZoom }
                maxNativeZoom={item.maxZoom}
                maxZoom={22}
                bounds= { item.bounds }
                opacity={ this.props.state.rasterOpacity }
              />
            );
          }) :
          ''
        }

        {/* polygon of map for sorting z level */}
        { (aboveThreshold) ? 
          visibleMapsList.map((item, i) => {
            if (RasterStore.overlapsAnotherMap(item.id) && visibleMapsList.length > 1) {
              return(
                <GeoJSON
                  data={ RasterStore.getGeoJSON(item.id) }
                  key={ 'sortPolygon' + item.id }
                  id={ item.id }
                  onClick={ this.props.onMapClick }
                  opacity={ 0 }
                  fillOpacity={ 0 }
                  className='sortingPolygon'
                  ref={ 'sortingPolygon' + item.id }
                />
              );
            }
          }) :
          null
        }


        {/* rings: donut holes */}
        { (aboveThreshold && outerRadius > 0 && dimensions.size !== 'mobile') &&
          [1,2,3,4].map(ringNum => {
            return (
              <Circle 
                center={ CityStore.getLoopLatLng() } 
                radius={ outerRadius * (ringNum * 2 - 1) / 7 } 
                fillOpacity={ (ringNum + 1 == this.props.state.selectedRingGrade.ringId) ? 0.75 : 0 } 
                fillColor= { '#b8cdcb' } 

                clickable={ false } 
                key={ 'ring' + ringNum } 
                weight={ 1 }
                color={ '#555' }
                dashArray='10,20'
              /> 
            );
          })
        }
      
        {/* rings: donuts */}
        { (false && aboveThreshold && outerRadius > 0 && this.props.state.selectedRingGrade.ringId > 0 && dimensions.size !== 'mobile') &&
          <Donut 
            center={ CityStore.getLoopLatLng() } 
            innerRadius={ (this.props.state.selectedRingGrade.ringId * 2 - 1) / 7 * outerRadius }
            outerRadius={ outerRadius }
            clickable={ false } 
            fillOpacity={ 0.75 } 
            fillColor= { '#b8cdcb' } 
            weight={ 1 }
            className={ 'donut' } 
            key={ 'donut' } 
          /> 
        }

        {/* rings: selected ring */}
        { (aboveThreshold && this.props.state.selectedRingGrade.ringId > 0) ?
          <LayerGroup>
            <GeoJSON 
              data={ CityStore.getInvertedGeoJsonForSelectedRingArea(this.props.state.selectedRingGrade.ringId, this.props.state.selectedRingGrade.grade) }
              clickable={ false }
              key={ 'invertedRingStroke'} 
              fillColor={ '#FFF'}
              fillOpacity={ 0.6 }
              color={ '#000' }
              weight={ 2 }
              opacity={ 0.9 }
              className={ 'invertedRingGradedArea' }
            />
            <GeoJSON 
              data={ CityStore.getGeoJsonForSelectedRingArea(this.props.state.selectedRingGrade.ringId, this.props.state.selectedRingGrade.grade) }
              clickable={ false }
              key={ 'ringStroke'} 
              fillOpacity={ (1 - this.props.state.rasterOpacity) / 2 }
              weight={ 2 }
              opacity={ 0.9 }
              className={ 'ringGradedArea grade' + this.props.state.selectedRingGrade.grade}
            />
          </LayerGroup> :
          null
        }

        {/* selected grade */}
        { (aboveThreshold && this.props.state.selectedGrade) &&
          <GeoJSON 
            data={ AreaDescriptionsStore.getGeoJsonForGrade(this.props.state.selectedCity, this.props.state.selectedGrade) }
            key={ 'selectedGradedNeighborhoods' } 
            className={ 'selectedGradedNeighborhoods grade' + this.props.state.selectedGrade } 
          />
        }

        { (aboveThreshold && this.props.state.highlightedNeighborhood && ADs[this.props.state.selectedCity] && ADs[this.props.state.selectedCity][this.props.state.highlightedNeighborhood] && ADs[this.props.state.selectedCity][this.props.state.highlightedNeighborhood].area_geojson_inverted) &&
          <GeoJSON
            data={ ADs[this.props.state.selectedCity][this.props.state.highlightedNeighborhood].area_geojson_inverted } 
            clickable={ false }
            className={ 'neighborhoodPolygonInverted grade' + ADs[this.props.state.selectedCity][this.props.state.highlightedNeighborhood].holc_grade } 
            key={ 'neighborhoodPolygonInverted' + this.props.state.highlightedNeighborhood }
            
          />
        }

        {/* selected neighborhood */}
        { (aboveThreshold && this.props.state.selectedNeighborhood && ADs[this.props.state.selectedCity] && ADs[this.props.state.selectedCity][this.props.state.selectedNeighborhood] && ADs[this.props.state.selectedCity][this.props.state.selectedNeighborhood].area_geojson_inverted) &&
          <GeoJSON
            data={ ADs[this.props.state.selectedCity][this.props.state.selectedNeighborhood].area_geojson_inverted } 
            onClick={ this.props.onNeighborhoodInvertedPolygonClick }
            className={ 'neighborhoodPolygonInverted' } 
            key={ 'neighborhoodPolygonInverted' + this.props.state.selectedNeighborhood }
            ref='neighborhoodPolygonInverted'
          />
        }

        {/* neighborhood polygons: shown on zoom level 10 and higher */}
        { (aboveThreshold) &&
          Object.keys(ADs).map(adId => {
            return (
              Object.keys(ADs[adId]).map((areaId) => {
                let strokeOpacity = 0.5;
                let fillOpacity = 0.4;
                let labelClassName = `neighborhoodLabel grade${ADs[adId][areaId].holc_grade}`;
                if (this.props.state.rasterOpacity > 0) {
                  strokeOpacity = 0;
                  fillOpacity = 0;
                }
                if (this.props.state.selectedGrade && this.props.state.selectedGrade !== ADs[adId][areaId].holc_grade) {
                  strokeOpacity = 0.25;
                  fillOpacity = 0.1;
                  labelClassName = `${labelClassName} deemphasized`;
                }
                // (this.props.state.selectedRingGrade.ringId > 0) ? (1 - this.props.state.rasterOpacity) / 5 : (1 - this.props.state.rasterOpacity) / 2
                // (this.props.state.selectedRingGrade.ringId > 0) ? 0 : (1 - this.props.state.rasterOpacity) / 5
                return (
                  <LayerGroup
                    key={ 'neighborhoodPolygon' + adId + '-' + areaId } 
                  >
                    <GeoJSON
                      data={ ADs[adId][areaId].area_geojson }
                      className={ 'neighborhoodPolygon grade' + ADs[adId][areaId].holc_grade }
                      onClick={ this.props.onNeighborhoodPolygonClick }
                      adId={ adId }
                      neighborhoodId={ areaId } 
                      fillOpacity={fillOpacity}
                      style={{
                        opacity: strokeOpacity,

                        //fillOpacity: fillOpacity,
                        pointerEvents: 'auto',
                        cursor: 'help'
                      }}
                    />
                    { (this.props.state.rasterOpacity === 0 && this.props.state.map.zoom >= 12) && 
                      <CircleMarker
                        center={ADs[adId][areaId].labelCoords}
                        radius={1}
                        key={ 'neighborhoodLabel' + adId + '-' + areaId } 
                        className='neighborhoodLabelBG'
                      >
                        <Tooltip
                          direction='center'
                          offset={[0, 0]}
                          opacity={1}
                          permanent={true}
                          className={labelClassName}
                          style={{
                            color: 'pink'
                          }}
                          ref={'labelFor' + adId}
                        >
                          <span>
                            {areaId}
                          </span>
                        </Tooltip>
                      </CircleMarker>
                    }
                  </LayerGroup>
                );
              })
            );
          })
        }


        {/* inverted polygons if ADs shown in AD search */}
        { (this.props.isSearchingADs) ?
          <LayerGroup>
            <GeoJSON
              data={ CityStore.getInvertedGeoJsonForCity() }
              fillOpacity={ 0.75 } 
              fillColor= { '#b8cdcb' } 
              weight={0}
            /> 
            { Object.keys(ADs).map(adId => {
              return (
                Object.keys(ADs[adId]).map((areaId) => {
                  if (true || !this.props.searchingADsAreas.includes(areaId)) {
                    return (
                      <GeoJSON
                        data={ ADs[adId][areaId].area_geojson }
                        fillOpacity={ 0.75 } 
                        fillColor= { this.props.searchingADsAreas.includes(areaId) ? 'transparent' : '#b8cdcb' } 
                        color= { this.props.searchingADsAreas.includes(areaId) ? 'black' : 'transparent' } 
                        weight={ this.props.searchingADsAreas.includes(areaId) ? 2 : 0}
                        opacity={1}
                      />
                    );
                  }

                })
              );
              
            })}
          </LayerGroup> : '' 
        }



        {/* cartogram marker for city: shown below zoom level 10; it's invisible but used for selection */}
        {(!aboveThreshold) &&
          <ClickableCities />
        }

        {/* text labels for cities */}
        { (!aboveThreshold) &&
          cartodbLayers.layergroup.layers.map((item, i) => {
            return (
              <CartoDBTileLayer
                key={ 'cartodb-tile-layer-' + i }
                userId={ cartodbConfig.userId }
                sql={ item.options.sql }
                cartocss={ item.options.cartocss }
                zIndex={1000}
              />
            );
          })
        }

        {/* marker for user's location */}
        { (aboveThreshold && UserLocationStore.getPoint()) &&
          <Marker position={ UserLocationStore.getPoint() } />
        }

        {/* button for national view*/}
        { (this.props.onCountryClick && dimensions.size !== 'mobile') &&
          <button
            className='nationalView'
            onClick={ this.props.onCountryClick }
          >
            <img src='static/us-outline.svg' />
          </button>
        }

        {/* JSX Comment 
        <Legend 
          { ...legendData } 
          className={ (!aboveThreshold) ? 'withCityMarker' : '' }
        /> */}

      </Map>
    );
  }
}
