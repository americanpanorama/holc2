import { connect } from 'react-redux';
import AreaButton from '../presentational/AreaButton';
import { selectArea } from '../../../store/Actions';
import { getSelectedAreaData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const areaData = getSelectedAreaData(state);
  return areaData.nextAreaMetadata;
  // const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  // const formIds = Object.keys(state.areaDescriptions)
  //   .sort(collator.compare);
  // const nextHOLCId = formIds[formIds.indexOf(state.selectedArea) + 1];
  // const selectedCityId = state.selectedCity.data.id;
  // if (nextHOLCId) {
  //   return {
  //     id: `${selectedCityId}-${nextHOLCId}`,
  //     holcId: nextHOLCId,
  //     grade: state.selectedCity.data.polygons[nextHOLCId].grade,
  //     direction: 'next',
  //   };
  // }
  // return null;
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(AreaButton);
