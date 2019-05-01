import { connect } from 'react-redux';
import * as L from 'leaflet';
import ClickableCities from '../presentational/ClickableCities';
import { selectCity } from '../../../store/Actions';
import dorlings from '../../../../data/Dorlings.json';
import { constantsColors } from '../../../../data/constants';

const mapStateToProps = (state) => {
  const { map, cities } = state;
  const { zoom } = map;

  if (map.aboveThreshold) {
    return {
      cities: [],
      otherLabels: [],
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

  const citiesWithAreas = citiesList.filter(c => c.area && c.area.total);
  const largestArea = Math.max(...citiesWithAreas.map(c => c.area.total));
  
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

        // default is below
        let radians = Math.PI * 0.5;
        let direction = 'center';

        // above
        if (['Newport News', 'Niagara Falls', 'Philadelphia', 'Winston Salem', 'Trenton', 'Stamford, Darien, and New Canaan', 'Schenectady', 'Bay City', 'Battle Creek', 'Warren', 'Binghamton/Johnson City', 'Oakland'].includes(city.name)) {
          radians = Math.PI * 1.5;
        }

        // west
        if (['Essex County', 'Hartford', 'St.Louis', 'St. Louis', 'Omaha', 'Minneapolis'].includes(city.name)) {
          radians = 0;
          direction = 'left';
        }

        // east
        if (['Troy', 'East Hartford', 'East St. Louis', 'Council Bluffs', 'St. Paul', 'StPaul'].includes(city.name)) {
          radians = Math.PI * 2;
          direction = 'right';
        }

        // northeast
        if (zoom === 7 && ['Haverhill'].includes(city.name)) {
          radians = Math.PI * 1.75;
          direction = 'right';
        }

        // northwest
        if (['Bergen Co.'].includes(city.name)) {
          radians = Math.PI * 1.75;
          direction = 'left';
        }

        city.showLabel = (!['Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Manhattan', 'Boston', 'Quincy', 'Newton', 'Medford', 'Needham', 'Dedham', 'Milton', 'Lexington', 'Malden', 'Watertown', 'Chelsea', 'Everett', 'Cambridge', 'Waltham', 'Arlington', 'Winchester', 'Brookline', 'Braintree', 'Belmont', 'Winthrop', 'Somerville', 'Melrose', 'Saugus', 'Revere'].includes(city.name));

        if (zoom === 8 && ['Lower Westchester Co.', 'Hudson County'].includes(city.name)) {
          city.showLabel = false;
        }

        if (zoom <= 7) {
          // above
          if (['Manchester', 'Cleveland', 'Holyoke Chicopee', 'East Hartford', 'Chicago', 'Milwaukee Co.', 'Tampa', 'Dallas', 'South Bend', 'SouthBend' ].includes(city.name)) {
            radians = Math.PI * 1.5;
            direction = 'center';
          }
          if (city.name === 'Springfield' && city.state === 'OH') {
            radians = Math.PI * 1.5;
            direction = 'center';
          }
          // east
          if (['New Castle', 'Racine'].includes(city.name)) {
            radians = Math.PI * 2;
            direction = 'right';
          }

          // northwest
          if (['Philadelphia'].includes(city.name)) {
            radians = Math.PI * 1.75;
            direction = 'left';
          }
          // northeast 
          if (['Pontiac'].includes(city.name)) {
            radians = Math.PI * 1.75;
            direction = 'right';
          }
          // southeast 
          if (['New Britain', 'New Haven', 'Lake County Gary'].includes(city.name)) {
            radians = Math.PI * 0.25;
            direction = 'right';
          }

          // southwest
          if (['Waterbury', 'Akron'].includes(city.name)) {
            radians = Math.PI * 0.25;
            direction = 'left';
          }

          if (['Stamford, Darien, and New Canaan', 'Lower Westchester Co.', 'Hudson County'].includes(city.name)) {
            city.showLabel = false;
          }
        }

        if (zoom <= 6) {
          // above
          if (['Portsmouth', 'Ogden', 'Utica', 'Oshkosh', 'Muncie', 'Terre Haute', 'Seattle', 'Sacramento', 'Poughkeepsie', 'Lynchburg', 'Decatur', 'Altoona', 'Houston', 'Muskegon', 'Des Moines', 'Waterloo', 'St. Joseph', 'St.Joseph'].includes(city.name)) {
            radians = Math.PI * 1.5;
            direction = 'center';
          }

          // east
          if (['Charleston', 'Camden', 'Durham', 'Albany', 'Stockton'].includes(city.name)) {
            radians = Math.PI * 2;
            direction = 'right';
          }

          // west
          if (['Saginaw', 'San Francisco'].includes(city.name)) {
            radians = 0;
            direction = 'left';
          }

          // north-northwest
          if (['Philadelphia'].includes(city.name)) {
            radians = Math.PI * 1.55;
            direction = 'left';
          }

          // northwest
          if (['Essex County', 'Manchester', 'Hartford', 'Winston Salem', 'Topeka'].includes(city.name)) {
            radians = Math.PI * 1.75;
            direction = 'left';
          }

          // northeast 
          if (['Haverhill', 'Youngstown', 'Newport News', 'SouthBend', 'South Bend', 'Detroit', 'Chicago'].includes(city.name)) {
            radians = Math.PI * 1.75;
            direction = 'right';
          }
          // southeast 
          if (['Brockton', 'Pittsburgh', 'Council Bluffs'].includes(city.name)) {
            radians = Math.PI * 0.25;
            direction = 'right';
          }

          // southwest
          if (['Aurora'].includes(city.name)) {
            radians = Math.PI * 0.25;
            direction = 'left';
          }

          if (['Hamilton', 'Lake County Gary', 'Grand Rapids', 'Flint', 'Muskegon', 'Warren', 'Johnstown', 'East Hartford', 'Holyoke Chicopee', 'Poughkeepsie', 'Waterbury', 'New Britain', 'Trenton', 'Racine', 'Battle Creek', 'Kalamazoo', 'Lansing', 'Kenosha'].includes(city.name)) {
            city.showLabel = false;
          }
          if (city.name === 'Springfield' && city.state === 'OH') {
            city.showLabel = false;
          }
        }

        if (zoom <= 5) {
          // below
          if (['Pittsburgh', 'Chicago'].includes(city.name)) {
            radians = Math.PI * 0.5;
            direction = 'center';
          }

          // above
          if (['Memphis', 'Sioux City', 'SiouxCity', 'Los Angeles', 'Fresno', 'Knoxville', 'Saginaw', 'Rochester', 'Denver'].includes(city.name)) {
            radians = Math.PI * 1.5;
            direction = 'center';
          }

          // east
          if (['Charlotte', 'Columbia'].includes(city.name)) {
            radians = Math.PI * 2;
            direction = 'right';
          }

          // west
          if (['Birmingham', 'Chicago'].includes(city.name)) {
            radians = 0;
            direction = 'left';
          }

          // northwest
          if (['Oakland', 'Nashville', 'Fort Worth'].includes(city.name)) {
            radians = Math.PI * 1.75;
            direction = 'left';
          }
          // north-northwest
          if (['St.Louis', 'St. Louis'].includes(city.name)) {
            radians = Math.PI * 1.55;
            direction = 'left';
          }
          // northeast 
          if (['Atlanta', 'St. Paul', 'StPaul'].includes(city.name)) {
            radians = Math.PI * 1.75;
            direction = 'right';
          }

          // north-northeast
          if (['Detroit'].includes(city.name)) {
            radians = Math.PI * 1.6;
            direction = 'right';
          }
          // southeast 
          if ([ 'Norfolk', 'Augusta', 'Macon', 'Baltimore'].includes(city.name)) {
            radians = Math.PI * 0.25;
            direction = 'right';
          }
          // south southeast 
          if (['Des Moines'].includes(city.name)) {
            radians = Math.PI * 0.55;
            direction = 'right';
          }

          // southwest
          if (['Waco'].includes(city.name)) {
            radians = Math.PI * 0.25;
            direction = 'left';
          }


          if (['Harrisburg', 'Council Bluffs', 'Atlantic City', 'Providence', 'Asheville', 'Oshkosh', 'Schenectady', 'Niagara Falls', 'Pontiac', 'Bay City', 'Lima', 'Troy', 'Toledo', 'Akron', 'Fort Wayne', 'Indianapolis', 'Cleveland', 'Roanoke', 'Buffalo', 'Newport News', 'Columbus', 'Dayton', 'Greensboro', 'Covington', 'Evansville', 'Chattanooga', 'Winston Salem', 'Cofington', 'East St. Louis', 'Joliet', 'Decatur', 'SouthBend', 'South Bend', 'Aurora', 'Dubuque', 'Terre Haute', 'Richmond', 'Philadelphia', 'Madison', 'Bergen Co.', 'Wheeling', 'Springfield', 'Portsmouth', 'Lorain', 'Canton', 'Essex County', 'Youngstown', 'Hartford', 'Syracuse', 'Rockford', 'New Haven', 'Elmira', 'New Castle', 'Erie', 'Altoona', 'Binghamton/Johnson City', 'Muncie', 'Lynchburg', 'Albany', 'Utica', 'Camden'].includes(city.name)) {
            city.showLabel = false;
          }
          if ((city.name === 'Columbus' && city.state === 'GA') || (city.name === 'Rochester' && city.state === 'MN')) {
            city.showLabel = false;
          }
        }

        if (zoom <= 4) {
          // below
          if (['St.Louis', 'St. Louis'].includes(city.name)) {
            radians = Math.PI * 0.5;
            direction = 'center';
          }

          // above
          if (['Denver', 'Duluth'].includes(city.name)) {
            radians = Math.PI * 1.5;
            direction = 'center';
          }

          // east
          if (['Savannah', 'Jacksonville', 'Fresno', 'Norfolk', 'Tampa', 'Mobile'].includes(city.name)) {
            radians = Math.PI * 2;
            direction = 'right';
          }

          // west
          if (['Birmingham', 'Los Angeles', 'Fort Worth', 'St. Petersburg', 'Tacoma', 'SiouxCity', 'Sioux City', 'Topeka'].includes(city.name)) {
            radians = 0;
            direction = 'left';
          }

          // northwest
          if ([].includes(city.name)) {
            radians = Math.PI * 1.75;
            direction = 'left';
          }
          // north-northwest
          if ([].includes(city.name)) {
            radians = Math.PI * 1.55;
            direction = 'left';
          }
          // northeast 
          if ([].includes(city.name)) {
            radians = Math.PI * 1.75;
            direction = 'right';
          }

          // north-northeast
          if ([].includes(city.name)) {
            radians = Math.PI * 1.6;
            direction = 'right';
          }
          // southeast 
          if (['Durham'].includes(city.name)) {
            radians = Math.PI * 0.25;
            direction = 'right';
          }
          // south southeast 
          if ([].includes(city.name)) {
            radians = Math.PI * 0.55;
            direction = 'right';
          }

          // southwest
          if (['St.Petersburg', 'Wichita'].includes(city.name)) {
            radians = Math.PI * 0.25;
            direction = 'left';
          }

          // south southeast 
          if (['Chicago'].includes(city.name)) {
            radians = Math.PI * 0.4;
            direction = 'left';
          }


          if (['Huntington', 'Waco', 'Montgomery', 'San Jose', 'Sacramento', 'Brockton', 'Charlotte', 'Augusta', 'Dallas', 'Memphis', 'Des Moines', 'Shreveport', 'Galveston', 'Pittsburgh', 'Charleston', 'Rochester', 'Manchester',  'Nashville', 'LittleRock', 'Little Rock', 'St.Joseph', 'St. Josesph', 'Louisville', 'Columbia', 'Macon', 'Greater Kansas City', 'Milwaukee Co.', 'Waterloo'].includes(city.name)) {
            city.showLabel = false;
          }
          if (false) {
            city.showLabel = false;
          }
        }

        if (zoom <= 3) {
          city.showLabel = false;
        }

        const labelOffset = [Math.cos(radians) * (rDist / 2), Math.sin(radians) * (rDist / 2 + 10)];
        city.icon = L.icon({
          iconUrl,
          iconSize: [rDist, rDist],
          iconAnchor: [rDist / 2, rDist / 2],
          tooltipAnchor: labelOffset,
        });
        city.markerKey = `labelFor${city.id}-${labelOffset.join('-')}`;

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

//        && city.population && city.population.total && city.population.total >= 500000);



      return city;
    });

  const svgString = "<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'><rect x='0' y='0' width='1' height='1' fill='transparent' stroke='transparent' /></svg>";
  const transparentIconUrl = encodeURI(`data:image/svg+xml,${svgString}`).replace('#','%23');

  const transparentIcon = L.icon({
    iconUrl: transparentIconUrl,
    iconSize: [1, 1],
    iconAnchor: [0, 0],
  });

  // Greater Boston label
  const bostonPos = {
    8: [42.3, -70.95],
    7: [42.2, -70.75],
    6: [42.2, -70],
    5: [41, -69],
    4: [41.6, -69],
    3: [41, -70],
  };
  const bostonLabel = {
    label: 'Greater Boston',
    offsetPoint: bostonPos[zoom],
    direction: 'right',
    icon: transparentIcon,
  };

  const nyPos = {
    8: [40.4, -73.95],
    7: [40.2, -73.65],
    6: [40, -73],
    5: [38, -72.5],
    4: [39.2, -71.5],
    3: [37.3, -72.7],
  };

  const nyLabel = {
    label: 'Boroughs of New York',
    offsetPoint: nyPos[zoom],
    direction: 'right',
    icon: transparentIcon,
  };

  const otherLabels = (zoom >= 4) ? [
    bostonLabel,
    nyLabel,
  ] : [];

  return {
    cities: cities2.filter(c => c.offsetPoint && c.offsetPoint[0] && c.centerLat && c.ad_id),
    otherLabels,
  };
};

const mapDispatchToProps = {
  onCitySelected: selectCity,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClickableCities);
