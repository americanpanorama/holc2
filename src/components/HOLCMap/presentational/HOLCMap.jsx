import React from 'react';
import PropTypes from 'prop-types';
import { Map, withLeaflet } from 'react-leaflet';
//import VectorGridDefault from 'react-leaflet-vectorgrid';

// import * as L from 'leaflet';
// import Proj4 from 'proj4leaflet';

import BaseMap from '../containers/BaseMap';
import ClickableCities from '../containers/ClickableCities';
import CityMarkers from '../containers/CityMarkers';
import HOLCRasters from '../containers/HOLCRasters';
import AreaPolygons from '../containers/AreaPolygons';
import AreaMarkers from '../containers/AreaMarkers';
import MapToggleControl from '../containers/MapToggleControl';
import ZoomInButton from '../containers/ZoomInButton';
import ZoomOutButton from '../containers/ZoomOutButton';
import ResetViewButton from '../containers/ResetViewButton';

import TheStore from '../../../store';
import { updateMap } from '../../../store/Actions';

export default class HOLCMap extends React.Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();

    this.onMapMoved = this.onMapMoved.bind(this);
  }

  componentDidMount() {
    // treat this as the map moved to load cities
    this.onMapMoved();
  }

  onMapMoved() {
    const theMap = this.map.current.leafletElement;
    const zoom = theMap.getZoom();
    const center = [theMap.getCenter().lat, theMap.getCenter().lng];
    const latLngBounds = theMap.getBounds();
    const bounds = [[latLngBounds.getNorthWest().lat, latLngBounds.getNorthWest().lng],
      [latLngBounds.getSouthEast().lat, latLngBounds.getSouthEast().lng]];
    TheStore.dispatch(updateMap({
      zoom,
      center,
      bounds,
      movingTo: null,
    }));
  }

  render() {
    // const VectorGrid = withLeaflet(VectorGridDefault);
    // // console.log(VectorGrid);
    const { zoom, center, className } = this.props;
    return (
      <React.Fragment>
        <Map
          zoom={zoom}
          center={center}
          id="the_map"
          className={`${className}`}
          ref={this.map}
          zoomControl={false}
          onMoveEnd={this.onMapMoved}
          padding={0.3}
        >

        <BaseMap />
      {/* JSX Comment  
          {(aboveThreshold) ? <BaseMap /> : (
            <VectorGrid
              type="protobuf"
              url="https://tiles.arcgis.com/tiles/ak2bo87wLfUpMrt1/arcgis/rest/services/HOLC_Vector_Tiles/VectorTileServer/tile/{z}/{y}/{x}.pbf"
              subdomains="0123"
              vectorTileLayerStyles={{
                US_States_Albers: {
                  weight: 1,
                  color: '#D4DADC',
                  fillColor: '#FAFAF8',
                  fillOpacity: 1,
                  fill: true,
                },
                holc_points: {
                  fillColor: '#ddd',
                  fillOpacity: 1,
                  fill: false,
                  weight: 1,
                  color: '#aaa',
                  textSize: 13,
                },
              }}
            />
          )} */}
          
          <ClickableCities />
          <CityMarkers />
          <HOLCRasters />
          <AreaPolygons />
          <AreaMarkers />
        </Map>

        <div id="mapControls">
          <MapToggleControl />
          <ZoomInButton />
          <ZoomOutButton />
          <ResetViewButton />
        </div>
      </React.Fragment>
    );
  }
}

HOLCMap.propTypes = {
  zoom: PropTypes.number.isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  className: PropTypes.string.isRequired,
  style: PropTypes.shape({
    height: PropTypes.number,
  }).isRequired,
};
