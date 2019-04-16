import { connect } from 'react-redux';
import ADSearch from '../presentational/ADSearch';
import { selectArea } from '../../../store/Actions';
import { getSelectedCityData } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const selectedCityData = getSelectedCityData(state);
  const { areaDescriptions } = state;

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


  const ADsForSearch = (areaDescriptions)
    ? Object.keys(areaDescriptions).map(holcId => ({
      adId: selectedCityData.ad_id,
      holcId,
      grade: areaDescriptions[holcId].holc_grade,
      name: areaDescriptions[holcId].name,
      areaDesc: areaDescriptions[holcId].areaDesc,
      value: parseADforSearch(areaDescriptions[holcId].areaDesc),
    }))
    : [];

  return {
    ADsForSearch,
    adId: selectedCityData.ad_id,
  };
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(ADSearch);
