import { connect } from 'react-redux';
import * as L from 'leaflet';
import Points from '../presentational/Points';

const mapStateToProps = (state) => {
    const { points, map } = state;
    const { aboveThreshold, bounds } = map;
    const lBounds = L.bounds(bounds);
    return {
        points: points.filter(point => aboveThreshold && lBounds.contains(point)),
    };
};

export default connect(mapStateToProps)(Points);