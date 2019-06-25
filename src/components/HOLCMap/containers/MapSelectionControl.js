import { connect } from 'react-redux';
import MapSelectionControl from '../presentational/MapSelectionControl';
import { showOnlyPolygons, showFullMaps, showMosaicMaps } from '../../../store/Actions';

const mapStateToProps = state => ({

});

const mapDispatchToProps = {
  showOnlyPolygons,
  showFullMaps,
  showMosaicMaps,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapSelectionControl);
