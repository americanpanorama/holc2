import { connect } from 'react-redux';
import CityMarkers from '../presentational/CityMarkers';
import { selectCity } from '../../../store/Actions';
import { getCityMarkers } from '../../../store/selectors';

const mapStateToProps = (state) => {
  const { zoom } = state.map;
  const markers = getCityMarkers(state)
    .filter((m) => {
      return !['Boston (north)', 'Manhattan (south)', 'Manhattan (north)', 'Chicago (north)', 'Davenport (north)', 'Los Angeles (north)', 'Los Angeles (northwest)', 'Los Angeles (central)'].includes(m.label);
    })
    .map((m) => {
      let { label } = m;
      if (m.label.includes(' (south)')) {
        label = m.label.replace(' (south)', '');
      }

      let className = 'class3';
      if (m.area > 350) {
        className = 'class2';
      }
      if (m.area > 1000 || ['Boston', 'Los Angeles', 'Chicago'].includes(label)) {
        className = 'class1';
      }
      return {
        ...m,
        label,
        position: [m.bounds[0][0] - 0.04 / (1 + zoom - 9), m.centerLng],
        direction: 'center',
        className,
      };
    });

  // east 
  ['Bronx', 'Queens', 'Darien',  'Camden', 'East Hartford', 'Council Bluffs', 'East St. Louis', 'St. Paul', 'Racine', 'Lake County Gary', 'Troy'].forEach((name) => {
    const i = markers.findIndex(m => m.label === name);
    if (i !== -1) {
      markers[i].position = [markers[i].centerLat, markers[i].bounds[1][1] + 0.04 / (1 + zoom - 9)];
      markers[i].direction = 'right';
    }
  });

  // west
  ['Essex County', 'Hudson County'].forEach((name) => {
    const i = markers.findIndex(m => m.label === name);
    if (i !== -1) {
      markers[i].position = [markers[i].centerLat, markers[i].bounds[0][1] - 0.04 / (1 + zoom - 9)];
      markers[i].direction = 'left';
    }
  });

  // north 
  ['Newport News', 'Bergen County', 'New Canaan', 'Lower Westchester Co.','Hartford', 'Holyoke', 'Warren', 'Bay City', 'Pontiac', 'Niagara Falls', 'Schenectady'].forEach((name) => {
    const i = markers.findIndex(m => m.label === name);
    if (i !== -1) {
      markers[i].position = [markers[i].bounds[1][0] + 0.05 / (1 + zoom - 9), markers[i].centerLng];
    }
  });

  // refine marker position
  if (zoom === 9) {
    // north 
    ['Cleveland'].forEach((name) => {
      const i = markers.findIndex(m => m.label === name);
      if (i !== -1) {
        markers[i].position = [markers[i].bounds[1][0] + 0.05 / (1 + zoom - 9), markers[i].centerLng];
      }
    });

    // under left corner
    ['San Francisco'].forEach((name) => {
      const i = markers.findIndex(m => m.label === name);
      if (i !== -1) {
        markers[i].position[1] = markers[i].bounds[0][1];
      }
    });

    // under right corner
    ['Oakland', 'New Britain'].forEach((name) => {
      const i = markers.findIndex(m => m.label === name);
      if (i !== -1) {
        markers[i].position[1] = markers[i].bounds[1][1];
      }
    });
  }

  return {
    markers,
  };
};

const mapDispatchToProps = {
  selectCity,
};

export default connect(mapStateToProps, mapDispatchToProps)(CityMarkers);
