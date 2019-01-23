import { connect } from 'react-redux';
import AreaPolygons from '../presentational/AreaPolygons';
import { selectArea } from '../../../store/Actions';

const mapStateToProps = (state) => {
  // calculate the style each polygon
  const polygons = state.map.visiblePolygons.map((p) => {
    let fillOpacity = (state.showHOLCMaps) ? 0 : 0.25;
    let strokeOpacity = (state.showHOLCMaps) ? 0 : 1;
    if (state.selectedGrade && state.selectedGrade !== p.grade) {
      fillOpacity = 0.02;
      strokeOpacity = 0.5;
    }
    return {
      ...p,
      fillOpacity,
      strokeOpacity,
    };
  });

  return {
    polygons,
  };
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(AreaPolygons);
