import { connect } from 'react-redux';
import AreaPolygons from '../presentational/AreaPolygons';
import { selectArea } from '../../../store/Actions';
import { getPolygons } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const { selectedCity, selectedArea } = state;

  const polygons = getPolygons(state);

  let mask;
  if (selectedArea) {
    // invert the selected polygon
    //Create a new set of latlngs, adding our world-sized ring first
    const NWHemisphere = [[0, 0], [0, 90], [-180, 90], [-180, 0], [0, 0]];
    const newLatLngs = [NWHemisphere];
    const holes = [];

    const selectedPolygon = polygons.find(p => p.ad_id === selectedCity && p.id == selectedArea);

    if (selectedPolygon) {
      selectedPolygon.area_geojson.coordinates.forEach((polygon) => {
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
          holc_id: selectedArea,
        },
      };
    }
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
