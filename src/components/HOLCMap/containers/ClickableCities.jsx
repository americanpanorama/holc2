import { connect } from 'react-redux';
import ClickableCities from '../presentational/ClickableCities';
import { selectCity } from '../../../store/Actions';

const mapStateToProps = (state) => {
  const labelsWest = ['San Diego', 'Los Angeles', 'Portland', 'Seattle', 'San Francisco'];
  const labelsNorth = [];
  const labelsNorthEast = ['Sacramento', 'Tampa'];
  const labelsNorthWest = ['Oakland'];
  const labelsEast = ['Spokane', 'Fresno', 'Stockton', 'Miami', 'Jacksonville'];
  const labelsSouthWest = ['Tacoma', 'San Jose', 'St.Petersburg'];
  const labelsSouthEast = [];
  const cities = (state.map.aboveThreshold) ? [] :
    Object.keys(state.cities).map((id) => {
      const city = state.cities[id];
      if (labelsWest.includes(city.name)) {
        city.labelDirection = 'left';
        city.labelOffset = [0, 0];
      } else if (labelsSouthWest.includes(city.name)) {
        city.labelDirection = 'left';
        city.labelOffset = [0, 10];
      } else if (labelsSouthEast.includes(city.name)) {
        city.labelDirection = 'right';
        city.labelOffset = [0, 10];
      } else if (labelsEast.includes(city.name)) {
        city.labelDirection = 'right';
        city.labelOffset = [0, 0];
      } else if (labelsNorth.includes(city.name)) {
        city.labelDirection = 'center';
        city.labelOffset = [0, -15];
      } else if (labelsNorthEast.includes(city.name)) {
        city.labelDirection = 'right';
        city.labelOffset = [0, -10];
      } else if (labelsNorthWest.includes(city.name)) {
        city.labelDirection = 'left';
        city.labelOffset = [0, -10];
      } else {
        city.labelDirection = 'center';
        city.labelOffset = [0, 0];
      }

      const rDist = 20000;
      const scaleFactor = 1 / Math.cos(city.centerLat * (Math.PI / 180));

      if (city.area && city.area.total) {
        const aggregateAreas = {
          a: city.area.total,
          b: city.area.d + city.area.c + city.area.b,
          c: city.area.d + city.area.c,
          d: city.area.d,
          e: 0,
        };

        const calculateCircleParamaters = (grade) => {
          const nextGrade = String.fromCharCode(grade.charCodeAt(0) + 1);
          const outer = aggregateAreas[grade] / city.area.total / scaleFactor * rDist;
          const inner = aggregateAreas[nextGrade] / city.area.total / scaleFactor * rDist;
          const strokeWidth = (outer - inner) / 2;
          const r = strokeWidth + inner;
          return {
            r,
            strokeWidth,
          };
        };

        city.radii = {
          a: calculateCircleParamaters('a'),
          b: calculateCircleParamaters('b'),
          c: calculateCircleParamaters('c'),
          d: calculateCircleParamaters('d'),
          total: calculateCircleParamaters('a').r,
        };
      } else {
        city.radii = {
          total: rDist / scaleFactor,
        };
      }

      return city;
    });

  return {
    cities,
  };
};

const mapDispatchToProps = {
  onCitySelected: selectCity,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClickableCities);
