import { connect } from 'react-redux';
import Downloader from '../presentational/Downloader';

const MapStateToProps = (state) => {
  const { selectedCity } = state;
  return {
    hasADData: !!(selectedCity.data && selectedCity.data.areaDescriptions
      && selectedCity.data.areaDescriptions.form_id),
    hasPolygons: !!(selectedCity.data && selectedCity.data.polygonsCenter[0]),
    adId: selectedCity.data.id,
    name: selectedCity.data.name,
    rasters: [],
  };
};

export default connect(MapStateToProps)(Downloader);
