import { connect } from 'react-redux';
import Header from '../presentational/Header';
import { citySelected, toggleCityStatsOnOff } from '../../../store/Actions';
import { getSelectedCityData } from '../../../store/selectors';

const MapStateToProps = (state) => {
  const selectedCityData = getSelectedCityData(state);
  if (selectedCityData) {
    const { slug, ad_id: adId, name, state: theState } = selectedCityData;
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
