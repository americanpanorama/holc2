import { connect } from 'react-redux';
import Header from '../presentational/Header';
import { citySelected, toggleCityStatsOnOff } from '../../../store/Actions';

const MapStateToProps = (state) => {
  const { slug, id: adId, name, state: theState } = state.selectedCity.data;
  return {
    slug,
    adId: parseInt(adId, 10),
    name,
    state: theState,
  };
};

const MapDispatchToProps = {
  onCitySelected: citySelected,
  onStateSelected: () => { return },
  toggleCityStats: toggleCityStatsOnOff,
};

export default connect(MapStateToProps, MapDispatchToProps)(Header);
