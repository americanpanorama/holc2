import { connect } from 'react-redux';
import AreaPolygons from '../presentational/AreaPolygons';
import { selectArea } from '../../../store/Actions';

const mapStateToProps = (state) => {
  // calculate the style each polygon
  const polygons = state.map.visiblePolygons.map((p) => {
    let fillOpacity = (state.showHOLCMaps) ? 0 : 0.25;
    let strokeOpacity = (state.showHOLCMaps) ? 0 : 1;
    let weight = (state.showHOLCMaps) ? 0 : 1;

    // styling for selected grade
    if (!state.showHOLCMaps && state.selectedGrade && state.selectedGrade !== p.grade) {
      fillOpacity = 0.02;
      strokeOpacity = 0.5;
    }
    if (state.showHOLCMaps && state.selectedGrade && state.selectedGrade === p.grade) {
      fillOpacity = 0.25;
      strokeOpacity = 1;
    }

    // styling for selected and unseleced polygons
    if (!state.showHOLCMaps && state.selectedCity.data && state.selectedCity.data.id === p.ad_id
      && state.selectedArea) {
      if (state.selectedArea === p.id) {
        weight = 3;
      } else {
        fillOpacity = 0.04;
        strokeOpacity = 0.5;
      }
    }
    if (state.showHOLCMaps
      && state.selectedCity.data && state.selectedCity.data.id === p.ad_id
      && state.selectedArea && state.selectedArea === p.id) {
      fillOpacity = 0.4;
      strokeOpacity = 1;
      weight = 3;
    }
    return {
      ...p,
      fillOpacity,
      strokeOpacity,
      weight,
    };
  });

  let mask;
  if (state.selectedArea) {
    // invert the selected polygon
    //Create a new set of latlngs, adding our world-sized ring first
    const NWHemisphere = [[0, 0], [0, 90], [-180, 90], [-180, 0], [0, 0]];
    const newLatLngs = [NWHemisphere];
    const holes = [];

    state.selectedCity.data.polygons[state.selectedArea].area_geojson.coordinates.forEach((polygon) => {
      polygon.forEach((polygonpieces, i) => {
        if (i === 0) {
          newLatLngs.push(polygonpieces);
        } else {
          holes.push(polygonpieces);
        }
      });
    });
    mask = {
      type: 'MultiPolygon',
      coordinates: (holes.length > 0) ? [newLatLngs.concat(holes)] : [newLatLngs],
      properties: {
        holc_id: state.selectedArea,
      },
    };
  }

  return {
    polygons,
    mask,
  };
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(AreaPolygons);
