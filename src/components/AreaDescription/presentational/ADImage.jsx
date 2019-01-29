import * as React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet';

const ADImage = ({ adData }) => {
  const { center, zoom, maxBounds, url, style } = adData;
  return (
    <Map
      center={center}
      zoom={zoom}
      minZoom={3}
      maxZoom={7}
      maxBounds={maxBounds}
      //onMoveend={onMoveend}
      style={style}
      className="adimage"
    >
      <TileLayer
        url={url}
        zIndex={1000}
        detectRetina
        maxNativeZoom={4}
        maxZoom={8}
      />
    </Map>
  );
};


export default ADImage;

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
};
