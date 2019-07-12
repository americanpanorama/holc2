import { connect } from 'react-redux';
import BringMapToFrontButton from '../presentational/BringMapToFrontButton';
import { toggleSortingMaps } from '../../../store/Actions';

const mapStateToProps = state => ({
  disabled: !state.showHOLCMaps || !state.showFullHOLCMaps
    || !state.map.visibleRasters.some(raster => raster.overlaps),
});

const mapDispatchToProps = {
  action: toggleSortingMaps,
};

export default connect(mapStateToProps, mapDispatchToProps)(BringMapToFrontButton);
