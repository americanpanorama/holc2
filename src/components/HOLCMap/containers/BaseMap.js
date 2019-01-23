import { connect } from 'react-redux';
import { TileLayer } from 'react-leaflet';

const mapStateToProps = state => ({
  url: state.basemap,
  key: (state.map.zoom >= 9) ? 'labels' : 'noLabels',
  zIndex: -1,
});

export default connect(mapStateToProps)(TileLayer);
