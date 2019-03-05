import { connect } from 'react-redux';
import Header from '../presentational/Header';
import { citySelected, toggleCityStatsOnOff } from '../../../store/Actions';

const MapStateToProps = (state) => {
  const { selectedCity } = state;
  if (selectedCity.data) {
    const { slug, id: adId, name, state: theState } = selectedCity.data;
    return {
      slug,
      adId: parseInt(adId, 10),
      name,
      state: theState,
    };
  } else {
    return {};
  }
};

const MapDispatchToProps = {
  onCitySelected: citySelected,
  onStateSelected: () => { return },
  toggleCityStats: toggleCityStatsOnOff,
};

export default connect(MapStateToProps, MapDispatchToProps)(Header);
