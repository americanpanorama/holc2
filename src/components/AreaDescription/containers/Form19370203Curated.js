import { connect } from 'react-redux';
import Form19370203Curated from '../presentational/Form19370203Curated';

const MapStateToProps = (state) => {
  const { selectedArea, selectedCity } = state;
  let adData = null;
  if (selectedArea && selectedCity.data && selectedCity.data.areaDescriptions
    && selectedCity.data.areaDescriptions.byNeighborhood[selectedArea]
    && selectedCity.data.areaDescriptions.byNeighborhood[selectedArea].areaDesc) {
    adData = selectedCity.data.areaDescriptions.byNeighborhood[selectedArea].areaDesc;
  }
  return {
    adData,
  };
};

export default connect(MapStateToProps)(Form19370203Curated);
