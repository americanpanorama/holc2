import { connect } from 'react-redux';
import * as L from 'leaflet';
import ClickableCities from '../presentational/ClickableCities';
import { selectCity } from '../../../store/Actions';
import dorlings from '../../../../data/Dorlings.json';
import { constantsColors } from '../../../../data/constants.js';

const mapStateToProps = (state) => {
  const { map, cities } = state;
  const { zoom } = map;

  if (map.aboveThreshold) {
    return {
      cities: [],
    };
  }

  const citiesList = cities
    .map((c) => {
      let labelClass = 4;
      if (c.area.total >= 165) {
        labelClass = 1;
      } else if (c.area.total >= 30) {
        labelClass = 2;
      } else if (c.area.total >= 10) {
        labelClass = 3;
      }
      return {
        ...c,
        labelClass,
      };
    })
    .sort((a, b) => b.area.total - a.area.total);
    // .map((c) => {
    //   const areaBreak1 = state.cities.find(c => c.name === 'Philadelphia').area.total;
    //   const city = state.cities[id];
    //   if (state.cities.area.total >= areaBreak1) {
    //     city.labelClass = 1;
    //   } else {
    //     city.labelClass = 2;
    //   }
    //   return city;

    // });
  const citiesWithAreas = citiesList.filter(c => c.area && c.area.total);
  const largestArea = Math.max(...citiesWithAreas.map(c => c.area.total));
  
  const labelsWest = ['San Diego', 'Los Angeles', 'Portland', 'Seattle', 'San Francisco'];
  const labelsNorth = [];
  const labelsNorthEast = ['Sacramento', 'Tampa'];
  const labelsNorthWest = ['Oakland'];
  const labelsEast = ['Spokane', 'Fresno', 'Stockton', 'Miami', 'Jacksonville'];
  const labelsSouthWest = ['Tacoma', 'San Jose', 'St.Petersburg'];
  const labelsSouthEast = [];

  const cities2 = (state.map.aboveThreshold) ? [] :
    citiesList.map((city) => {
      // the markers stay the same absolute size for zoom levels 5 and above; they shrink below that
      const rDivisor = 2 ** Math.max(5 - zoom, 0);
      const rMultiplier = 70 / rDivisor;
      const markerRelativeSize = rMultiplier * Math.sqrt(city.area.total / largestArea);
      const smallestMarkerSize = 12 / rDivisor;
      const rDist = (city.area.total) ? Math.max(markerRelativeSize, smallestMarkerSize) : 2000;

      // make the svgs
      const achenSvgString = "<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'><path d='M 200, 200 m 0, -200 a 200, 200, 0, 1, 0, 1, 0 Z m 0 100 a 100, 100, 0, 1, 1, -1, 0 Z' fill='purple'/></svg>";
      const myIconUrl = encodeURI(`data:image/svg+xml,${achenSvgString}`).replace('#','%23');

      city.icon = L.icon({
        iconUrl: myIconUrl,
        iconSize: 20,
      });

      if (city.area && city.area.total) {
        const rs = {
          d: Math.sqrt(city.area.d / city.area.total) * 100,
          c: Math.sqrt((city.area.d + city.area.c) / city.area.total) * 100,
          b: Math.sqrt((city.area.d + city.area.c + city.area.b) / city.area.total) * 100,
          a: 100,
        };

        const svgString = `
          <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
            <circle cx='100' cy='100' r='${rs.d}' fill='${constantsColors.gradeD}' />
            <path d='M 100, 100 m 0, -${rs.c} a ${rs.c}, ${rs.c}, 0, 1, 0, 1, 0 Z m 0 ${rs.c - rs.d} a ${rs.d}, ${rs.d}, 0, 1, 1, -1, 0 Z' fill='${constantsColors.gradeC}'/>
            <path d='M 100, 100 m 0, -${rs.b} a ${rs.b}, ${rs.b}, 0, 1, 0, 1, 0 Z m 0 ${rs.b - rs.c} a ${rs.c}, ${rs.c}, 0, 1, 1, -1, 0 Z' fill='${constantsColors.gradeB}'/>
            <path d='M 100, 100 m 0, -${rs.a} a ${rs.a}, ${rs.a}, 0, 1, 0, 1, 0 Z m 0 ${rs.a - rs.b} a ${rs.b}, ${rs.b}, 0, 1, 1, -1, 0 Z' fill='${constantsColors.gradeA}'/>
          </svg>`;
        const iconUrl = encodeURI(`data:image/svg+xml,${svgString.trim().replace(/ +(?= )/g, '')}`).replace(/#/g, '%23');

        // default is above
        let radians = Math.PI * 1.5;
        let direction = 'center';

        // below
        if (['Tacoma', 'St.Petersburg', 'Albany', 'Greensboro', 'Buffalo', 'San Jose', 'Toledo', 'Lake County Gary', 'Norfolk', 'Camden'].includes(city.name)) {
          radians = Math.PI * 0.5;
        }

        // west
        if (['Essex County', 'San Francisco'].includes(city.name)) {
          radians = 0;
          direction = 'left';
        }

        if (['Bergen Co.', 'Winston Salem'].includes(city.name)) {
          radians = Math.PI * 1.75;
          direction = 'left';
        }
        const labelOffset = [Math.cos(radians) * (rDist / 2), Math.sin(radians) * (rDist / 2 + 10)];
        city.icon = L.icon({
          iconUrl,
          iconSize: [rDist, rDist],
          iconAnchor: [rDist / 2, rDist / 2],
          tooltipAnchor: labelOffset,
        });

        city.rDist = rDist;

        // place the dorling at the non-colliding point
        const dorling = dorlings[Math.max(zoom, 5)].find(d => d.city === city.ad_id);
        if (dorling && dorling.point) {
          const z = Math.max(zoom, 5);
          city.offsetPoint = dorlings[z].find(d => d.city === city.ad_id).point;
          // const radians = Math.PI;
          // city.labelOffset = [Math.cos(radians) * (rDist / 2), Math.sin(radians) * (rDist / 2)];
          city.labelDirection = direction;
        }
      }

      city.showLabel = (!['Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Manhattan', 'Boston'].includes(city.name)
        && city.population && city.population.total && city.population.total >= 500000);

      return city;
    });

  return {
    cities: cities2.filter(c => c.offsetPoint && c.ad_id),
  };
};

const mapDispatchToProps = {
  onCitySelected: selectCity,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClickableCities);
