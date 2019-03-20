import { connect } from 'react-redux';
import Search from '../presentational/Search';
import { selectCity } from '../../../store/Actions';
import { getSearchOptions } from '../../../store/selectors';

const mapStateToProps = (state) => {
  return {
    options: getSearchOptions(state),
    citySearchStyle: state.dimensions.citySearchStyle,
  };
};

const MapDispatchToProps = {
  selectCity,
};

export default connect(mapStateToProps, MapDispatchToProps)(Search);
