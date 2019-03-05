import { connect } from 'react-redux';
import AreaPolygons from '../presentational/AreaPolygons';
import { selectArea } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const { showHOLCMaps, selectedGrade, selectedCity, selectedArea, map, adSearchHOLCIds } = state;
  const colors = {
    A: '#76a865',
    B: '#7cb5bd',
    C: '#d8d165',
    D: '#d9838d',
  };

  const fillColorsAdjusted = {
    A: '#58ff2c', // '#58cc2c',
    B: '#578DFF', //'#98f6ff',
    C: 'yellow', //'#a79500',
    D: '#FF3B4C', //'#ff536b',
  };

  // calculate the style each polygon
  const polygons = map.visiblePolygons.map((p) => {
    let fillColor = colors[p.grade];
    let fillOpacity = (state.showHOLCMaps) ? 0 : 0.25;
    let strokeColor = colors[p.grade];
    let strokeOpacity = (state.showHOLCMaps) ? 0 : 1;
    let weight = (state.showHOLCMaps) ? 0 : 1;
    let className = '';

    // styling for selected grade
    if (!showHOLCMaps && selectedGrade && selectedGrade !== p.grade) {
      fillOpacity = 0.02;
      strokeOpacity = 0.5;
    }
    if (showHOLCMaps && selectedGrade && selectedGrade === p.grade) {
      fillOpacity = 0.25;
      strokeOpacity = 1;
    }

    // styling for selected and unseleced polygons
    if (!showHOLCMaps && selectedCity.data && selectedCity.data.id === p.ad_id
      && selectedArea) {
      if (selectedArea === p.id) {
        weight = 3;
      } else {
        fillOpacity = 0.04;
        strokeOpacity = 0.5;
      }
    }
    if (showHOLCMaps
      && selectedCity.data && selectedCity.data.id === p.ad_id
      && selectedArea && selectedArea === p.id) {
      fillOpacity = 0.4;
      strokeOpacity = 1;
      weight = 3;
      fillColor = fillColorsAdjusted[p.grade];
      strokeColor = 'black';
    }

    // styling for search results
    if (adSearchHOLCIds.length > 0) {
      if (!showHOLCMaps) {
        if (adSearchHOLCIds.includes(p.id)) {
          weight = 3;
        } else {
          fillOpacity = 0.04;
          strokeOpacity = 0.5;
        }
      }

      if (showHOLCMaps && adSearchHOLCIds.includes(p.id)) {
        fillOpacity = 0.4;
        strokeOpacity = 1;
        weight = 3;
        fillColor = fillColorsAdjusted[p.grade];
        strokeColor = 'black';
      }
    }

    return {
      ...p,
      fillColor,
      fillOpacity,
      strokeColor,
      strokeOpacity,
      weight,
      className,
    };
  });

  let mask;
  if (selectedArea) {
    // invert the selected polygon
    //Create a new set of latlngs, adding our world-sized ring first
    const NWHemisphere = [[0, 0], [0, 90], [-180, 90], [-180, 0], [0, 0]];
    const newLatLngs = [NWHemisphere];
    const holes = [];

    selectedCity.data.polygons[selectedArea].area_geojson.coordinates.forEach((polygon) => {
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

  return {
    polygons,
    mask,
  };
};

const mapDispatchToProps = {
  selectArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(AreaPolygons);
