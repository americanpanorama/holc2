import { connect } from 'react-redux';
import MapSortPolygons from '../presentational/MapSortPolygons';
import { bringMapToFront } from '../../../store/Actions';
import { getOverlappingMaps } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const { zoom, sortingPossibilities, sortingLatLng } = state.map;
  const overlappingMaps = getOverlappingMaps(state);
  const selectableMaps = (sortingPossibilities.length > 0)
    ? overlappingMaps.filter(r => sortingPossibilities.includes(r.id)) : overlappingMaps;
  return {
    overlappingMaps: selectableMaps,
    sortingLatLng,
    fontSize: 60 - ((16 - zoom) * 6),
  };
};

const mapDispatchToProps = {
  bringMapToFront,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapSortPolygons);
