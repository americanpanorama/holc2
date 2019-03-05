import { connect } from 'react-redux';
import HeaderArea from '../presentational/HeaderArea';
import { unselectArea } from '../../../store/Actions';

const mapStateToProps = (state) => {
  return {
    holcId: state.selectedArea,
    name: state.selectedCity.data.areaDescriptions.name,
  };
};

const mapDispatchToProps = {
  unselectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderArea);
