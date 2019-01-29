import React from 'react';
import PropTypes from 'prop-types';
import { Map, ZoomControl } from 'react-leaflet';
// import * as L from 'leaflet';
// import Proj4 from 'proj4leaflet';

import BaseMap from '../containers/BaseMap';
import ClickableCities from '../containers/ClickableCities';
import HOLCRasters from '../containers/HOLCRasters';
import AreaPolygons from '../containers/AreaPolygons';
import AreaMarkers from '../containers/AreaMarkers';
import MapToggleControl from '../containers/MapToggleControl';

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
    }));
  }

  render() {
    const { zoom, center, style, className } = this.props;
    // const crsParams = {
    //   bounds: [
    //     [-8040784.5135, -2577524.9210], [3668901.4484, 4785105.1096]
    //   ],
    // };
    // const crs = new Proj4.CRS('EPSG:2163', '+proj=laea +lat_0=45 +lon_0=-100 +x_0=0 +y_0=0 ' + '+a=6370997 +b=6370997 +units=m +no_defs'),
    //   crsParams);
    return (
      <React.Fragment>
        <Map
          zoom={zoom}
          center={center}
          id="the_map"
          className={`${className}`}
          ref={this.map}
          onMoveend={this.onMapMoved}
        >
          <BaseMap />
          <ClickableCities />
          <HOLCRasters />
          <AreaPolygons />
          <AreaMarkers />
        </Map>

        <MapToggleControl />
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
