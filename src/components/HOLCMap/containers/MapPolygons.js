import { connect } from 'react-redux';
import MapPolygons from '../presentational/MapPolygons';
import { selectCity } from '../../../store/Actions';

const mapStateToProps = state => ({
  polygons: state.map.visibleRasterPolygons.filter(vp => state.map.selectableRasterBoundaries.includes(vp.ad_id)),
});

const mapDispatchToProps = {
  selectCity,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapPolygons);
