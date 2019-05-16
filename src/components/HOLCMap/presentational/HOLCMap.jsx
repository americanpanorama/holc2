import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'react-leaflet';

import BaseMap from '../containers/BaseMap';
import USMask from '../containers/USMask';
import ClickableCities from '../containers/ClickableCities';
import Legend from '../containers/Legend';
import CityMarkers from '../containers/CityMarkers';
import HOLCRasters from '../containers/HOLCRasters';
import MapSortPolygons from '../containers/MapSortPolygons';
import AreaPolygons from '../containers/AreaPolygons';
import AreaMarkers from '../containers/AreaMarkers';
import UserLocation from '../containers/UserLocation';
import MapToggleControl from '../containers/MapToggleControl';
import ZoomInButton from '../containers/ZoomInButton';
import ZoomOutButton from '../containers/ZoomOutButton';
import BringMapToFrontButton from '../containers/BringMapToFrontButton';
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
    const { zoom: oldZoom, center: oldCenter, bounds: oldBounds } = this.props;
    const theMap = this.map.current.leafletElement;
    const zoom = theMap.getZoom();
    const center = [theMap.getCenter().lat, theMap.getCenter().lng];
    const latLngBounds = theMap.getBounds();
    const bounds = [[latLngBounds.getNorthWest().lat, latLngBounds.getNorthWest().lng],
      [latLngBounds.getSouthEast().lat, latLngBounds.getSouthEast().lng]];
    // only dispatch if something has changed
    if (!oldBounds || oldBounds.length !== bounds.length
      || !oldBounds[0].every((value, index) => value === bounds[0][index])
      || !oldBounds[1].every((value, index) => value === bounds[1][index])
      || !oldCenter.every((value, index) => value === center[index])
      || oldZoom !== zoom) {
      TheStore.dispatch(updateMap({
        zoom,
        center,
        bounds,
        movingTo: null,
      }));
    }
  }

  render() {
    // const VectorGrid = withLeaflet(VectorGridDefault);
    // // console.log(VectorGrid);
    const { zoom, center, className, clickOnMap } = this.props;
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
          padding={0.5}
          maxBounds={[[15, -170], [60, -41]]}
          onClick={clickOnMap}
        >
          <BaseMap />
          <USMask />
          <ClickableCities />
          <CityMarkers />
          <HOLCRasters />
          <AreaPolygons />
          <AreaMarkers />
          <MapSortPolygons />
          <UserLocation />
        </Map>

        <Legend />

        <div id="mapControls">
          <MapToggleControl />
          <BringMapToFrontButton />
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
  bounds: PropTypes.arrayOf(PropTypes.array),
  className: PropTypes.string.isRequired,
  clickOnMap: PropTypes.func.isRequired,
  style: PropTypes.shape({
    height: PropTypes.number,
  }).isRequired,
};

HOLCMap.defaultProps = {
  bounds: undefined,
};
