import { connect } from 'react-redux';
import Search from '../presentational/Search';
import { selectCity } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const options = Object.keys(state.cities).map(id => ({
    ad_id: state.cities[id].ad_id,
    searchName: state.cities[id].searchName,
    name: state.cities[id].name,
    state: state.cities[id].state,
    displayPop: state.cities[id].displayPop,
    area: state.cities[id].area,
  }));
  return {
    options,
    citySearchStyle: state.dimensions.citySearchStyle,
  };
};

const MapDispatchToProps = {
  selectCity,
};

export default connect(mapStateToProps, MapDispatchToProps)(Search);
