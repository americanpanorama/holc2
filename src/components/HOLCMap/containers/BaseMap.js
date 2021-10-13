import { connect } from 'react-redux';
import { TileLayer } from 'react-leaflet';

const mapStateToProps = state => ({
  url: 'https://api.mapbox.com/styles/v1/ur-dsl/cjtyox5ms3ycd1flvhg7kihdi/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidXItZHNsIiwiYSI6ImNqdGs3MHhxdDAwd2E0NHA2bmxoZjM1Y2IifQ.y1wfhup4U2U8KvHuOpFCng',
  key: (state.map.zoom >= 9) ? 'labels' : 'noLabels',
  zIndex: -1,
  tileSize: 512,
  zoomOffset: -1,
  detectRetina: true,
});

export default connect(mapStateToProps)(TileLayer);
