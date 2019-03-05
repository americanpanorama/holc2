import { connect } from 'react-redux';
import ADSearch from '../presentational/ADSearch';
import { selectArea } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const parseADforSearch = (AD) => {
    const searchDown = (obj) => {
      let concat = '';
      if (typeof obj === 'string') {
        concat = obj;
      } else if (typeof obj === 'object') {
        Object.keys(obj).forEach((aKey) => {
          concat = `${concat} ${searchDown(obj[aKey])}`;
        });
      }
      return concat;
    };
    return searchDown(AD);
  };

  const { byNeighborhood } = state.selectedCity.data.areaDescriptions;
  const ADsForSearch = Object.keys(byNeighborhood).map(holcId => ({
    holcId,
    grade: byNeighborhood[holcId].holc_grade,
    name: byNeighborhood[holcId].name,
    areaDesc: byNeighborhood[holcId].areaDesc,
    value: parseADforSearch(byNeighborhood[holcId].areaDesc),
  }));

  return {
    ADsForSearch,
    city: state.selectedCity.data.name,
  };
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(ADSearch);
