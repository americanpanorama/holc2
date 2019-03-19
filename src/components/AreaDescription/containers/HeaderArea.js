import { connect } from 'react-redux';
import HeaderArea from '../presentational/HeaderArea';
import { unselectArea } from '../../../store/Actions';
import { getSelectedAreaData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const areaData = getSelectedAreaData(state);
  return {
    holcId: state.selectedArea,
    name: (areaData.polygon) ? areaData.polygon.name : null,
  };
};

const mapDispatchToProps = {
  unselectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderArea);
