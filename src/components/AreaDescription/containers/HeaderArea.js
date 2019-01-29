import { connect } from 'react-redux';
import HeaderArea from '../presentational/HeaderArea';
import { selectArea } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  const formIds = Object.keys(state.selectedCity.data.areaDescriptions.byNeighborhood)
    .sort(collator.compare);
  const previousHOLCId = formIds[formIds.indexOf(state.selectedArea) - 1];
  const selectedCityId = state.selectedCity.data.id;
  return {
    holcId: state.selectedArea,
    name: state.selectedCity.data.areaDescriptions.name,
    previousArea: {
      id: `${selectedCityId}-${previousHOLCId}`,
      holcId: previousHOLCId,
      grade: state.selectedCity.data.polygons[previousHOLCId].grade,
    },
    nextAreaId: `${selectedCityId}-${formIds[formIds.indexOf(state.selectedArea) + 1]}`,
  };
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderArea);
