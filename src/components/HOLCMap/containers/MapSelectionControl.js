import { connect } from 'react-redux';
import MapSelectionControl from '../presentational/MapSelectionControl';
import { showOnlyPolygons, showFullMaps, showMosaicMaps } from '../../../store/Actions';

const mapStateToProps = state => ({
  showHOLCMaps: state.showHOLCMaps,
  showFullHOLCMaps: state.showFullHOLCMaps,
});

const mapDispatchToProps = {
  showOnlyPolygons,
  showFullMaps,
  showMosaicMaps,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapSelectionControl);
