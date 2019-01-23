import { connect } from 'react-redux';
import HeaderArea from '../presentational/HeaderArea';
import { selectArea } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  const formIds = Object.keys(state.selectedCity.data.areaDescriptions.byNeighborhood)
    .sort(collator.compare);
  const selectedCityId = state.selectedCity.data.id;
  console.log(`${selectedCityId}-${formIds[formIds.indexOf(state.selectedArea) - 1]}`);
  return {
    holcId: state.selectedArea,
    name: state.selectedCity.data.areaDescriptions.name,
    previousAreaId: `${selectedCityId}-${formIds[formIds.indexOf(state.selectedArea) - 1]}`,
    nextAreaId: `${selectedCityId}-${formIds[formIds.indexOf(state.selectedArea) + 1]}`,
  };
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderArea);
