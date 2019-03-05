import { connect } from 'react-redux';
import AreaButton from '../presentational/AreaButton';
import { selectArea } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const formIds = Object.keys(state.selectedCity.data.areaDescriptions.byNeighborhood)
    .sort(collator.compare);
  const nextHOLCId = formIds[formIds.indexOf(state.selectedArea) + 1];
  const selectedCityId = state.selectedCity.data.id;
  if (nextHOLCId) {
    return {
      id: `${selectedCityId}-${nextHOLCId}`,
      holcId: nextHOLCId,
      grade: state.selectedCity.data.polygons[nextHOLCId].grade,
      direction: 'next',
    };
  }
  return null;
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(AreaButton);
