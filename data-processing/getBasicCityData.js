// I'm using this script to create the basic version of a json object where I can lookup cities
// I'm intending this as a convenience for responding to repeated inquiries about HOLC
// I'll supplement what we have with the full list from Hillier's article

const request = require('request');

const url = 'https://digitalscholarshiplab.cartodb.com/api/v1/sql?format=JSON&q=';
const query = 'SELECT distinct on (city, state) city, state, map_id FROM digitalscholarshiplab.holc_ads left join holc_maps_ads_join on city_id = ad_id order by state, city';

const states = [
  ['Arizona', 'AZ'],
  ['Alabama', 'AL'],
  ['Alaska', 'AK'],
  ['Arizona', 'AZ'],
  ['Arkansas', 'AR'],
  ['California', 'CA'],
  ['Colorado', 'CO'],
  ['Connecticut', 'CT'],
  ['Delaware', 'DE'],
  ['Florida', 'FL'],
  ['Georgia', 'GA'],
  ['Hawaii', 'HI'],
  ['Idaho', 'ID'],
  ['Illinois', 'IL'],
  ['Indiana', 'IN'],
  ['Iowa', 'IA'],
  ['Kansas', 'KS'],
  ['Kentucky', 'KY'],
  ['Kentucky', 'KY'],
  ['Louisiana', 'LA'],
  ['Maine', 'ME'],
  ['Maryland', 'MD'],
  ['Massachusetts', 'MA'],
  ['Michigan', 'MI'],
  ['Minnesota', 'MN'],
  ['Mississippi', 'MS'],
  ['Missouri', 'MO'],
  ['Montana', 'MT'],
  ['Nebraska', 'NE'],
  ['Nevada', 'NV'],
  ['New Hampshire', 'NH'],
  ['New Jersey', 'NJ'],
  ['New Mexico', 'NM'],
  ['New York', 'NY'],
  ['North Carolina', 'NC'],
  ['North Dakota', 'ND'],
  ['Ohio', 'OH'],
  ['Oklahoma', 'OK'],
  ['Oregon', 'OR'],
  ['Pennsylvania', 'PA'],
  ['Rhode Island', 'RI'],
  ['South Carolina', 'SC'],
  ['South Dakota', 'SD'],
  ['Tennessee', 'TN'],
  ['Texas', 'TX'],
  ['Utah', 'UT'],
  ['Vermont', 'VT'],
  ['Virginia', 'VA'],
  ['Washington', 'WA'],
  ['West Virginia', 'WV'],
  ['Wisconsin', 'WI'],
  ['Wyoming', 'WY'],
];

request({
  url: `${url}${query}`,
  json: true,
}, (error, response, data) => {
  const cities = data.rows.map((c) => {
    const fullState = states.find(s => s[1] === c.state)[0];
    return {
      uid: `${fullState}-${c.city}`,
      title: `${fullState} - ${c.city}`,
      autocomplete: `${fullState} ${c.city}`,
      subtitle: (c.map_id) ? 'in Mapping Inequality' : 'NOT in Mapping Inequality',
      valid: 'no',
    };
  });

  console.log(JSON.stringify(cities));
});
