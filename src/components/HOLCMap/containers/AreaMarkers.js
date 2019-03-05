import { connect } from 'react-redux';
import AreaMarkers from '../presentational/AreaMarkers';

const mapStateToProps = (state) => {
  const { map, selectedCity, showHOLCMaps } = state;
  const { zoom } = map;
  const { data: cityData, id: adId } = selectedCity;
  return {
    labels: (zoom >= 12 && cityData && !showHOLCMaps)
      ? cityData.labelPositions.map(l => ({ ...l, ad_id: adId }))
      : [],
    fontSize: 21 - ((16 - zoom) * 3),
  };
};

export default connect(mapStateToProps)(AreaMarkers);
