import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'react-leaflet';

import BaseMap from '../containers/BaseMap';
import ClickableCities from '../containers/ClickableCities';
import CityMarkers from '../containers/CityMarkers';
import HOLCRasters from '../containers/HOLCRasters';
import AreaPolygons from '../containers/AreaPolygons';
import AreaMarkers from '../containers/AreaMarkers';
import UserLocation from '../containers/UserLocation';
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
    const { zoom, center, className} = this.props;
    return (
      <React.Fragment>
        <Map
          zoom={zoom}
          center={center}
          id="the_map"
          ref={this.map}
          zoomControl={false}
          onMoveEnd={this.onMapMoved}
          className={className}
          padding={0.3}
        >
          <BaseMap />
          <ClickableCities />
          <CityMarkers />
          <HOLCRasters />
          <AreaPolygons />
          <AreaMarkers />
          <UserLocation />
        </Map>

        <div id="mapControls">
          <MapToggleControl />
          <div id="zoomControls">
            <ZoomInButton />
            <ZoomOutButton />
            <ResetViewButton />
          </div>
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
