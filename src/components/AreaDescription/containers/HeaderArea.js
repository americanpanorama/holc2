import { connect } from 'react-redux';
import HeaderArea from '../presentational/HeaderArea';
import { unselectArea, zoomToArea } from '../../../store/Actions';
import { getSelectedAreaData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const areaData = getSelectedAreaData(state);
  return {
    holcId: state.selectedArea,
    adId: state.selectedCity,
    name: (areaData.areaDesc) ? areaData.areaDesc.name : null,
  };
};

const mapDispatchToProps = {
  unselectArea,
  zoomToArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderArea);
