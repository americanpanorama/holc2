import { connect } from 'react-redux';
import DataViewer from '../presentational/DataViewer';
import { toggleCityStatsOnOff } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const { selectedArea, selectedCategory, selectedCity, showCityStats, dimensions } = state;
  let show = null;
  let cityName = null;
  if (!showCityStats && selectedCity.data) {
    show = 'showButton';
    cityName = selectedCity.data.name;
  } else if (selectedCategory) {
    show = 'category';
  } else if (selectedArea) {
    show = 'areaDescription';
  } else if (selectedCity.data) {
    show = 'city';
  }
  return {
    show,
    style: dimensions.dataViewerStyle,
    cityName,
  };
};

const MapDispatchToProps = {
  toggleCityStats: toggleCityStatsOnOff,
};

export default connect(mapStateToProps, MapDispatchToProps)(DataViewer);
