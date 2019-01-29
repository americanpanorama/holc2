import { connect } from 'react-redux';
import Sidebar from '../presentational/Sidebar';
import { toggleCityStatsOnOff } from '../../../store/Actions';

const mapStateToProps = (state) => {
  let show = null;
  let cityName = null;
  if (!state.showCityStats && state.selectedCity.data) {
    show = 'showButton';
    cityName = state.selectedCity.data.name;
  } else if (state.selectedArea) {
    show = 'areaDescription';
  } else if (state.selectedCity.data) {
    show = 'city';
  }
  return {
    show,
    style: state.dimensions.sidebarStyle,
    cityName,
  };
};

const MapDispatchToProps = {
  toggleCityStats: toggleCityStatsOnOff,
};

export default connect(mapStateToProps, MapDispatchToProps)(Sidebar);
