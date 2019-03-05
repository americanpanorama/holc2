import { connect } from 'react-redux';
import ADImage from '../presentational/ADImage';
import { updateADScan } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const { adScan, selectedArea, selectedCity } = state;
  const { tileUrl, sheets } = selectedCity.data.areaDescriptions.byNeighborhood[selectedArea];
  const { zoom, center } = adScan;
  let maxBounds = [[-10, -180], [90, -60]];
  if (sheets === 2) {
    maxBounds = [[-10, -180], [90, 70]];
  }

  //maybe a little hacky, but rapped in an adData to match the prop for transcriptions
  return {
    adData: {
      center,
      zoom,
      maxBounds,
      url: tileUrl,
    },
  };
};

const mapDispatchToState = {
  updateADScan,
};

export default connect(mapStateToProps, mapDispatchToState)(ADImage);
