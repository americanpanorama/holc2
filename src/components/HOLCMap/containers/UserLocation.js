import { connect } from 'react-redux';
import * as L from 'leaflet';
import UserLocation from '../presentational/UserLocation';

const mapStateToProps = (state) => {
  const { userPosition, aboveThreshold, bounds } = state.map;
  const lBounds = L.bounds(bounds);
  if (aboveThreshold && userPosition && lBounds.contains(userPosition)) {
    return {
      position: userPosition,
    };
  }

  return {};
};

export default connect(mapStateToProps)(UserLocation);
