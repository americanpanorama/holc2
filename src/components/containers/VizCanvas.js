import { connect } from 'react-redux';
import VizCanvas from '../presentational/VizCanvas';
import HOLCMap from '../HOLCMap/containers/HOLCMap';
import ADImage from '../AreaDescription/containers/ADImage';

const mapStateToProps = (state) => {
  const { selectedArea, selectedCity, showADScan } = state;
  const VizComponent = (showADScan && selectedArea && selectedCity.data) ? ADImage : HOLCMap;
  return {
    VizComponent,
  };
};

export default connect(mapStateToProps)(VizCanvas);
