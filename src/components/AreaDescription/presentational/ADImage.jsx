import * as React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet';

import TheStore from '../../../store';

import ZoomInButton from '../containers/ZoomInButton';
import ZoomOutButton from '../containers/ZoomOutButton';
import CloseScanButton from '../containers/CloseScanButton';

export default class ADImage extends React.Component {
  constructor(props) {
    super(props);
    this.adScan = React.createRef();

    this.onScanMoved = this.onScanMoved.bind(this);
  }

  componentDidMount() {
    // treat this as the map moved to load cities
    this.onScanMoved();
  }

  onScanMoved() {
    const theADScan = this.adScan.current.leafletElement;
    const zoom = theADScan.getZoom();
    const center = [theADScan.getCenter().lat, theADScan.getCenter().lng];
    // check if this is an actual move
    const { adData, updateADScan } = this.props;
    const { zoom: oldZoom, center: oldCenter } = adData;
    if (zoom !== oldZoom || center[0] !== oldCenter[0] || center[1] !== oldCenter[1]) {
      TheStore.dispatch(updateADScan({
        zoom,
        center,
      }));
    }
  }

  render() {
    const { center, zoom, maxBounds, url } = this.props.adData;
    return (
      <div id="adImage">
        <Map
          center={center}
          zoom={zoom}
          minZoom={1}
          maxZoom={7}
          zoomControl={false}
          //maxBounds={maxBounds}
          onMoveEnd={this.onScanMoved}
          className="adimage"
          ref={this.adScan}
        >
          <TileLayer
            url={url}
            zIndex={1000}
            detectRetina
            maxNativeZoom={4}
            maxZoom={8}
            noWrap
          />
        </Map>

        <div id="adScanControls">
          <ZoomInButton />
          <ZoomOutButton />
          <CloseScanButton />
        </div>
      </div>
    );
  }
}

ADImage.propTypes = {
  adData: PropTypes.shape({
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    maxBounds: PropTypes.arrayOf(PropTypes.array),
    url: PropTypes.string,
    style: PropTypes.shape({
      height: PropTypes.number,
      width: PropTypes.number,
    }),
  }).isRequired,
  updateADScan: PropTypes.func.isRequired,
};
