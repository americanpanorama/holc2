import { connect } from 'react-redux';
import ADImage from '../presentational/ADImage';

const mapStateToProps = (state) => {
  const { tileUrl, sheets } = state.selectedCity.data.areaDescriptions.byNeighborhood[state.selectedArea];
  let maxBounds = [[-10, -180], [90, -60]];
  if (sheets === 2) {
    maxBounds = [[-10, -180], [90, 70]];
  }

  //maybe a little hacky, but rapped in an adData to match the prop for transcriptions
  return {
    adData: {
      center: [-125, 75],
      zoom: 3,
      maxBounds,
      url: tileUrl,
    },
  };
};

export default connect(mapStateToProps)(ADImage);
