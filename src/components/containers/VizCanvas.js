import { connect } from 'react-redux';
import VizCanvas from '../presentational/VizCanvas';
import HOLCMap from '../HOLCMap/containers/HOLCMap';
import ADImage from '../AreaDescription/containers/ADImage';

const mapStateToProps = (state) => {
  const { selectedArea, selectedCity, showADScan, showDataViewerFull, selectedCategory } = state;
  const VizComponent = (showADScan && selectedArea && selectedCity) ? ADImage : HOLCMap;
  const show = (!selectedCategory || !showDataViewerFull);
  console.log(show);
  return {
    VizComponent,
    show,
  };
};

export default connect(mapStateToProps)(VizCanvas);
