const fs = require('fs');
const d3 = require('d3');

// load raw data files
const rawCentroids = require('./data/centroids.json');
const rawPolylabels = require('./data/polylabelCoords.json');
const rawMetros = require('./data/metro_areas.json');
const rawParties = require('./data/party_codebook.json');
const ALsAndGTs = require('../atLargeAndGeneralTicket/data/alAndgts.json');
const pluralDistricts = require('../atLargeAndGeneralTicket/data/pluralDistricts.json');

// initialize variablesc
const projection = d3.geoAlbersUsa();
const path = d3.geoPath().projection(projection);

const congressesData = {};
const namesAndAbbrs = [{"name": "Alabama", "abbreviation": "AL"}, {"name": "Alaska", "abbreviation": "AK"}, {"name": "American Samoa", "abbreviation": "AS"}, {"name": "Arizona", "abbreviation": "AZ"}, {"name": "Arkansas", "abbreviation": "AR"}, {"name": "California", "abbreviation": "CA"}, {"name": "Colorado", "abbreviation": "CO"}, {"name": "Connecticut", "abbreviation": "CT"}, {"name": "Delaware", "abbreviation": "DE"}, {"name": "District Of Columbia", "abbreviation": "DC"}, {"name": "Federated States Of Micronesia", "abbreviation": "FM"}, {"name": "Florida", "abbreviation": "FL"}, {"name": "Georgia", "abbreviation": "GA"}, {"name": "Guam", "abbreviation": "GU"}, {"name": "Hawaii", "abbreviation": "HI"}, {"name": "Idaho", "abbreviation": "ID"}, {"name": "Illinois", "abbreviation": "IL"}, {"name": "Indiana", "abbreviation": "IN"}, {"name": "Iowa", "abbreviation": "IA"}, {"name": "Kansas", "abbreviation": "KS"}, {"name": "Kentucky", "abbreviation": "KY"}, {"name": "Louisiana", "abbreviation": "LA"}, {"name": "Maine", "abbreviation": "ME"}, {"name": "Marshall Islands", "abbreviation": "MH"}, {"name": "Maryland", "abbreviation": "MD"}, {"name": "Massachusetts", "abbreviation": "MA"}, {"name": "Michigan", "abbreviation": "MI"}, {"name": "Minnesota", "abbreviation": "MN"}, {"name": "Mississippi", "abbreviation": "MS"}, {"name": "Missouri", "abbreviation": "MO"}, {"name": "Montana", "abbreviation": "MT"}, {"name": "Nebraska", "abbreviation": "NE"}, {"name": "Nevada", "abbreviation": "NV"}, {"name": "New Hampshire", "abbreviation": "NH"}, {"name": "New Jersey", "abbreviation": "NJ"}, {"name": "New Mexico", "abbreviation": "NM"}, {"name": "New York", "abbreviation": "NY"}, {"name": "North Carolina", "abbreviation": "NC"}, {"name": "North Dakota", "abbreviation": "ND"}, {"name": "Northern Mariana Islands", "abbreviation": "MP"}, {"name": "Ohio", "abbreviation": "OH"}, {"name": "Oklahoma", "abbreviation": "OK"}, {"name": "Oregon", "abbreviation": "OR"}, {"name": "Palau", "abbreviation": "PW"}, {"name": "Pennsylvania", "abbreviation": "PA"}, {"name": "Puerto Rico", "abbreviation": "PR"}, {"name": "Rhode Island", "abbreviation": "RI"}, {"name": "South Carolina", "abbreviation": "SC"}, {"name": "South Dakota", "abbreviation": "SD"}, {"name": "Tennessee", "abbreviation": "TN"}, {"name": "Texas", "abbreviation": "TX"}, {"name": "Utah", "abbreviation": "UT"}, {"name": "Vermont", "abbreviation": "VT"}, {"name": "Virgin Islands", "abbreviation": "VI"}, {"name": "Virginia", "abbreviation": "VA"}, {"name": "Washington", "abbreviation": "WA"}, {"name": "West Virginia", "abbreviation": "WV"}, {"name": "Wisconsin", "abbreviation": "WI"}, {"name": "Wyoming", "abbreviation": "WY"} ];
const stateAltNames = {"TEX": "TX", "MASS": "MA", "TENN": "TN", "ILL": "IL", "ARK": "AR", "MISS": "MS", "CALIF": "CA", "ALA": "AL", "HAWAII": "HA", "IND": "IN", "FLA": "FL", "UTAH": "UT", "MONT": "MT", "OREG": "OR", "MICH": "MI", "KANS": "KA", "CONN": "CO", "OKLA": "OK", "IOWA": "IO", "NEBR": "NE", "Texarkana, AR": "null", "ARIZ": "AZ", "ORTHEAST PENNSYLVANIA": "null", "NEV": "NV", "WIS": "WI", "N DAK": "ND", "MINN": "MN", "OHIO": "OH", "W VA": "WV", "COLO": "CO", "WASH": "WA", "TEXARKANA, ARK": "null", "S DAK": "SD", "MAINE": "ME", "N MEX": "NM", "ALASKA": "AK", "DEL": "DE", "WYO": "WY", "IDAHO": "ID"};
const abbrAndFIPS = {"AK": "02", "AL": "01", "AR": "05", "AS": "60", "AZ": "04", "CA": "06", "CO": "08", "CT": "09", "DC": "11", "DE": "10", "FL": "12", "GA": "13", "GU": "66", "HI": "15", "IA": "19", "ID": "16", "IL": "17", "IN": "18", "KS": "20", "KY": "21", "LA": "22", "MA": "25", "MD": "24", "ME": "23", "MI": "26", "MN": "27", "MO": "29", "MS": "28", "MT": "30", "NC": "37", "ND": "38", "NE": "31", "NH": "33", "NJ": "34", "NM": "35", "NV": "32", "NY": "36", "OH": "39", "OK": "40", "OR": "41", "PA": "42", "PR": "72", "RI": "44", "SC": "45", "SD": "46", "TN": "47", "TX": "48", "UT": "49", "VA": "51", "VI": "78", "VT": "50", "WA": "53", "WI": "55", "WV": "54", "WY": "56"};
const enclosingCircleRadii = { "3": 2.154, "4": 2.4, "5": 2.7, "6": 3, "7": 3, "8": 3.304, "9": 3.613, "10": 3.813, "11": 3.923, "12": 4.029, "13": 4.236, "14": 4.328, "15": 4.521, "16": 4.615, "17": 4.8, "18": 4.9, "19": 4.9, "20": 5.2, "21": 5.3, "22": 5.5, "23": 5.6, "24": 5.7, "25": 5.8, "26": 5.9, "27": 6, "28": 6.1, "29": 6.2, "30": 6.2, "31": 6.3, "32": 6.5, "33": 6.5, "34": 6.7, "35": 6.7, "36": 6.8, "37": 6.8, "38": 7, "39": 7.1, "40": 7.2, "41": 7.3, "42": 7.4, "43": 7.5, "44": 7.55, "45": 7.6 };
const metrosCountsByYear = {};

// helper functions
const getDecade = year => [Math.floor(year / 10) * 10];
const yearForCongress = function (congress) { return 1786 + parseInt(congress) * 2; };
const getStateFromFIPS = function (fips) {
  let abbr;
  Object.keys(abbrAndFIPS).forEach((s) => {
    if (parseInt(fips) === parseInt(abbrAndFIPS[s])) {
      abbr = s;
    }
  });
  return abbr;
};

const getMetro = function (metros, centroid) {
  let city = false;
  // check to see if you've already found it
  metros.forEach((m) => {
    if (d3.geoContains(m.geometry, centroid)) {
      city = m.name;
    }
  });
  return city;
};

// initial processing of data
console.log('initializing parties ...');
const parties = {};
rawParties.forEach((p) => {
  parties[p.party_id] = p.party;
});

console.log('initializing poles in inaccessibility ...');
const polylabels = {};
rawPolylabels.features.forEach((c) => {
  if (c.geometry) {
    polylabels[c.properties.id] = c.geometry.coordinates;
  }
});

console.log('initializing centroids ...');
const centroids = {};
rawCentroids.features.forEach((c) => {
  if (c.geometry) {
    centroids[c.properties.id] = c.geometry.coordinates;
  }
});

console.log('initializing metros ...');
const metros = {};
rawMetros.features.forEach((m) => {
  metros[m.properties.year] = metros[m.properties.year] || {};
  const states = m.properties.name.substring(m.properties.name.indexOf(',') + 2).split('-');
  states.forEach((s) => {
    let state = s.replace(/\./g, '');
    state = (state.length === 2) ? state : stateAltNames[state];
    metros[m.properties.year][state] = metros[m.properties.year][state] || [];
    metros[m.properties.year][state].push({
      name: m.properties.name,
      centroid: [m.properties.lng, m.properties.lat],
      geometry: m.geometry
    });
  });
});

// use 1940 for each previous decade
for (let d = 1790; d <= 1940; d += 10) {
  metros[d] = metros['1950'];
}
metros['1990'] = metros['1980'];
metros['2000'] = metros['1980'];
metros['2010'] = metros['1980'];

console.log('creating nodes');
const nodes = {};
const districtsDir = '../districts/final-simplified-geojson/';
fs.readdirSync(districtsDir)
  .filter(f => f.slice(-5) === '.json' && parseInt(f.slice(0, -5)) >= 27)
  .sort((a, b) => parseInt(a.slice(0, -5)) - parseInt(b.slice(0, -5)))
  .forEach((f) => {
    const year = yearForCongress(parseInt(f.slice(0, -5)));
    const decade = Math.floor(year / 10) * 10;
    const districts = JSON.parse(fs.readFileSync(`${districtsDir}${f}`, 'utf8')).features;
    nodes[year] = { notCity: [], cities: {} };
    const metrosCounts = {};
    const potentialMetroNodes = [];
    console.log(`   for ${year}`)

    // make the 
    districts.forEach((d) => {
      const { id } = d.properties;
      const state = getStateFromFIPS(id.slice(0, 3));
      const centroid = polylabels[id];

      // is it a metro
      const metro = (metros[decade] && metros[decade][state]) ?
        getMetro(metros[decade][state], centroid) : false;

      if (metro) {
        metrosCounts[metro] = metrosCounts[metro] || 0;
        metrosCounts[metro] += 1;
      }

      // is it an at large or general ticket election?
      const alOrGT = (ALsAndGTs[id] && ALsAndGTs[id].elections[year]) ? ALsAndGTs[id].elections[year] : false;

      const pathD = path({ type: 'Point', coordinates: centroid });
      const point = [parseFloat(pathD.substr(1, 7)), parseFloat(pathD.substr(pathD.indexOf(',') + 1, 7))];

      // if it's an at large or gt election, add the appropriate number of
      // nodes each with a different id
      if (alOrGT) {
        for (let i = 0; i < alOrGT; i += 1) {
          const node = {
            x: point[0],
            y: point[1],
            xOrigin: point[0],
            yOrigin: point[1],
            r: 5,
            id: `${id}-${i}`,
            color: 'navy'
          };

          nodes[year].notCity.push(node);
        }
      } else {
        const node = {
          x: point[0],
          y: point[1],
          xOrigin: point[0],
          yOrigin: point[1],
          r: (pluralDistricts[year] && pluralDistricts[year][id]) ? Math.sqrt(25 * pluralDistricts[year][id]) : 5,
          id: id,
          color: 'white',
          metro: metro
        };

        if (metro) {
          potentialMetroNodes.push(node);
        } else {
          nodes[year].notCity.push(node);
        }
      }
    });

    // calculate which cities have three or more congresspeople in a given year
    Object.keys(metrosCounts).forEach((city) => {
      if (metrosCounts[city] >= 3) {
        let centroid = null;
        Object.keys(metros[Math.floor(year / 10) * 10]).forEach((state) => {
          metros[Math.floor(year / 10) * 10][state].forEach((m) => {
            if (m.name === city) {
              centroid = m.centroid;
            }
          });
        });
        if (centroid) {
          const pathD = path({ type: 'Point', coordinates: centroid });
          const point = [parseFloat(pathD.substr(1, 7)), parseFloat(pathD.substr(pathD.indexOf(',') + 1, 7))];
          nodes[year].notCity.push({
            x: point[0],
            y: point[1],
            r: enclosingCircleRadii[metrosCounts[city]] * 8 + 5,
            id: city,
            class: 'city',
            color: 'transparent',
            xOrigin: point[0],
            yOrigin: point[1]
          });
        }
      }
    });

    // distribute the might-be-city nodes appropriately
    potentialMetroNodes.forEach((n) => {
      if (metrosCounts[n.metro] >= 3) {
        nodes[year].cities[n.metro] = nodes[year].cities[n.metro] || [];
        nodes[year].cities[n.metro].push(n);
      } else {
        delete n.metro;
        nodes[year].notCity.push(n);
      }
    });
  });

console.log('writing file ...');
fs.writeFile('./data/dorlingNodes.json', JSON.stringify(nodes, null, ' '), (err) => {
  if (err) throw err;
  console.log('COMPLETE');
});
