import { connect } from 'react-redux';
import Header from '../presentational/Header';
import { selectCity, toggleCityStatsOnOff } from '../../../store/Actions';
import { getSelectedCityData } from '../../../store/selectors';

const MapStateToProps = (state) => {
  const { showDataViewerFull } = state;
  const selectedCityData = getSelectedCityData(state);
  if (selectedCityData) {
    const { slug, ad_id: adId, name, state: theState } = selectedCityData;
    return {
      slug,
      adId: parseInt(adId, 10),
      name,
      state: theState,
      showMinimizeButton: !showDataViewerFull,
    };
  } else {
    return {};
  }
};

const MapDispatchToProps = {
  onCitySelected: selectCity,
  onStateSelected: () => { return },
  toggleCityStats: toggleCityStatsOnOff,
};

export default connect(MapStateToProps, MapDispatchToProps)(Header);
