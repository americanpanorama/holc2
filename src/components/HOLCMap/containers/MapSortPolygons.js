import { connect } from 'react-redux';
import MapSortPolygons from '../presentational/MapSortPolygons';
import { bringMapToFront } from '../../../store/Actions';
import { getOverlappingMaps } from '../../../store/selectors';

const mapStateToProps = state => ({
  overlappingMaps: getOverlappingMaps(state),
});

const mapDispatchToProps = {
  bringMapToFront,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapSortPolygons);
