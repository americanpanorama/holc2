import * as React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet';

const ADImage = (props) => {
  return (
    <Map
      center={props.center} 
      zoom={props.zoom}
      minZoom={3}
      maxZoom={7}
      maxBounds={props.maxBounds}
      onMoveend={props.onMoveend}
      style={props.ADImageStyle}
      className='adimage'
    >
      { (props.hasADImages && props.ADTileUrl) &&
        <TileLayer
          url={props.ADTileUrl}
          zIndex={1000}
          detectRetina={true}
          maxNativeZoom={4}
          maxZoom={8}
        />
      }
    </Map>
  );
};

export default ADImage;

ADImage.propTypes = {

};
