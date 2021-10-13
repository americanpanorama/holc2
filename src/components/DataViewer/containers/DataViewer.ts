import { connect } from 'react-redux';
import DataViewer from '../presentational/DataViewer';
import { toggleCityStatsOnOff } from '../../../store/Actions';
import { getSelectedCityData, getSelectedCategoryData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const { selectedArea, selectedCategory, selectedCity, showCityStats, dimensions } = state;
  let show = null;
  let buttonLabel;
  const cityName = (selectedCity) ? getSelectedCityData(state).name : null;
  if (selectedCategory) {
    show = 'category';
    buttonLabel = `Show ${getSelectedCategoryData(state).title}`;
  } else if (selectedArea) {
    show = 'areaDescription';
    buttonLabel = `Show area description for ${selectedArea}`;
  } else if (selectedCity) {
    show = 'city';
    buttonLabel = `Show stats & info for ${cityName}`;
  }
  if (!showCityStats && selectedCity) {
    show = 'showButton';
  }
  return {
    show,
    style: dimensions.dataViewerStyle,
    buttonLabel,
  };
};

const MapDispatchToProps = {
  toggleCityStats: toggleCityStatsOnOff,
};

export default connect(mapStateToProps, MapDispatchToProps)(DataViewer);
