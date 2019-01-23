function run(argv) {
  var citiesData = [
    {
      city: "Birmingham",
      state: "AL",
      status: "in MI"
    },
    {
      city: "Mobile",
      state: "AL",
      status: "in MI"
    },
    {
      city: "Montgomery",
      state: "AL",
      status: "in MI"
    },
    {
      city: "LittleRock",
      state: "AR",
      status: "in MI"
    },
    {
      city: "Phoenix",
      state: "AZ",
      status: "in MI"
    },
    {
      city: "Fresno",
      state: "CA",
      status: "in MI"
    },
    {
      city: "Los Angeles",
      state: "CA",
      status: "in MI"
    },
    {
      city: "Oakland",
      state: "CA",
      status: "in MI"
    },
    {
      city: "Sacramento",
      state: "CA",
      status: "in MI"
    },
    {
      city: "San Diego",
      state: "CA",
      status: "in MI"
    },
    {
      city: "San Francisco",
      state: "CA",
      status: "in MI"
    },
    {
      city: "San Jose",
      state: "CA",
      status: "in MI"
    },
    {
      city: "Stockton",
      state: "CA",
      status: "in MI"
    },
    {
      city: "Denver",
      state: "CO",
      status: "in MI"
    },
    {
      city: "Pueblo",
      state: "CO",
      status: "in MI"
    },
    {
      city: "Bridgeport",
      state: "CT",
      status: "in MI"
    },
    {
      city: "East Hartford",
      state: "CT",
      status: "in MI"
    },
    {
      city: "New Britain",
      state: "CT",
      status: "in MI"
    },
    {
      city: "New Haven",
      state: "CT",
      status: "in MI"
    },
    {
      city: "Stamford, Darien, and New Canaan",
      state: "CT",
      status: "in MI"
    },
    {
      city: "Waterbury",
      state: "CT",
      status: "in MI"
    },
    {
      city: "Jacksonville",
      state: "FL",
      status: "in MI"
    },
    {
      city: "Miami",
      state: "FL",
      status: "in MI"
    },
    {
      city: "St.Petersburg",
      state: "FL",
      status: "in MI"
    },
    {
      city: "Tampa",
      state: "FL",
      status: "in MI"
    },
    {
      city: "Atlanta",
      state: "GA",
      status: "in MI"
    },
    {
      city: "Augusta",
      state: "GA",
      status: "in MI"
    },
    {
      city: "Columbus",
      state: "GA",
      status: "in MI"
    },
    {
      city: "Macon",
      state: "GA",
      status: "in MI"
    },
    {
      city: "Savannah",
      state: "GA",
      status: "in MI"
    },
    {
      city: "Council Bluffs",
      state: "IA",
      status: "in MI"
    },
    {
      city: "Davenport",
      state: "IA",
      status: "in MI"
    },
    {
      city: "Des Moines",
      state: "IA",
      status: "in MI"
    },
    {
      city: "Dubuque",
      state: "IA",
      status: "in MI"
    },
    {
      city: "SiouxCity",
      state: "IA",
      status: "in MI"
    },
    {
      city: "Waterloo",
      state: "IA",
      status: "in MI"
    },
    {
      city: "Aurora",
      state: "IL",
      status: "in MI"
    },
    {
      city: "Chicago",
      state: "IL",
      status: "in MI"
    },
    {
      city: "Decatur",
      state: "IL",
      status: "in MI"
    },
    {
      city: "East St. Louis",
      state: "IL",
      status: "in MI"
    },
    {
      city: "Joliet",
      state: "IL",
      status: "in MI"
    },
    {
      city: "Rockford",
      state: "IL",
      status: "in MI"
    },
    {
      city: "Springfield",
      state: "IL",
      status: "in MI"
    },
    {
      city: "Evansville",
      state: "IN",
      status: "in MI"
    },
    {
      city: "Fort Wayne",
      state: "IN",
      status: "in MI"
    },
    {
      city: "Indianapolis",
      state: "IN",
      status: "in MI"
    },
    {
      city: "Lake County Calumet/Hammond",
      state: "IN",
      status: "in MI"
    },
    {
      city: "Lake County Gary",
      state: "IN",
      status: "in MI"
    },
    {
      city: "Muncie",
      state: "IN",
      status: "in MI"
    },
    {
      city: "SouthBend",
      state: "IN",
      status: "in MI"
    },
    {
      city: "Terre Haute",
      state: "IN",
      status: "in MI"
    },
    {
      city: "Topeka",
      state: "KS",
      status: "in MI"
    },
    {
      city: "Wichita",
      state: "KS",
      status: "in MI"
    },
    {
      city: "Covington",
      state: "KY",
      status: "in MI"
    },
    {
      city: "Lexington",
      state: "KY",
      status: "in MI"
    },
    {
      city: "Louisville",
      state: "KY",
      status: "in MI"
    },
    {
      city: "New Orleans",
      state: "LA",
      status: "in MI"
    },
    {
      city: "Shreveport",
      state: "LA",
      status: "in MI"
    },
    {
      city: "Arlington",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Belmont",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Boston",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Braintree",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Brockton",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Brookline",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Cambridge",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Chelsea",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Dedham",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Everett",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Haverhill",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Holyoke Chicopee",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Lexington",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Malden",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Medford",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Melrose",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Milton",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Needham",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Newton",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Quincy",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Revere",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Saugus",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Somerville",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Springfield",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Waltham",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Watertown",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Winchester",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Winthrop",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Worcester",
      state: "MA",
      status: "in MI"
    },
    {
      city: "Baltimore",
      state: "MD",
      status: "in MI"
    },
    {
      city: "Battle Creek",
      state: "MI",
      status: "in MI"
    },
    {
      city: "Bay City",
      state: "MI",
      status: "in MI"
    },
    {
      city: "Detroit",
      state: "MI",
      status: "in MI"
    },
    {
      city: "Flint",
      state: "MI",
      status: "in MI"
    },
    {
      city: "Grand Rapids",
      state: "MI",
      status: "in MI"
    },
    {
      city: "Jackson",
      state: "MI",
      status: "in MI"
    },
    {
      city: "Kalamazoo",
      state: "MI",
      status: "in MI"
    },
    {
      city: "Lansing",
      state: "MI",
      status: "in MI"
    },
    {
      city: "Muskegon",
      state: "MI",
      status: "in MI"
    },
    {
      city: "Pontiac",
      state: "MI",
      status: "in MI"
    },
    {
      city: "Saginaw",
      state: "MI",
      status: "in MI"
    },
    {
      city: "Duluth",
      state: "MN",
      status: "in MI"
    },
    {
      city: "Minneapolis",
      state: "MN",
      status: "in MI"
    },
    {
      city: "Rochester",
      state: "MN",
      status: "in MI"
    },
    {
      city: "StPaul",
      state: "MN",
      status: "in MI"
    },
    {
      city: "Greater Kansas City",
      state: "MO",
      status: "in MI"
    },
    {
      city: "Springfield",
      state: "MO",
      status: "in MI"
    },
    {
      city: "St.Joseph",
      state: "MO",
      status: "in MI"
    },
    {
      city: "St.Louis",
      state: "MO",
      status: "in MI"
    },
    {
      city: "Jackson",
      state: "MS",
      status: "in MI"
    },
    {
      city: "Asheville",
      state: "NC",
      status: "in MI"
    },
    {
      city: "Charlotte",
      state: "NC",
      status: "in MI"
    },
    {
      city: "Durham",
      state: "NC",
      status: "in MI"
    },
    {
      city: "Greensboro",
      state: "NC",
      status: "in MI"
    },
    {
      city: "Winston Salem",
      state: "NC",
      status: "in MI"
    },
    {
      city: "Manchester",
      state: "NH",
      status: "in MI"
    },
    {
      city: "Atlantic City",
      state: "NJ",
      status: "in MI"
    },
    {
      city: "Bergen Co.",
      state: "NJ",
      status: "in MI"
    },
    {
      city: "Camden",
      state: "NJ",
      status: "in MI"
    },
    {
      city: "Essex County",
      state: "NJ",
      status: "in MI"
    },
    {
      city: "Hudson County",
      state: "NJ",
      status: "in MI"
    },
    {
      city: "Trenton",
      state: "NJ",
      status: "in MI"
    },
    {
      city: "Albany",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Binghamton/Johnson City",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Bronx",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Brooklyn",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Buffalo",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Elmira",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Lower Westchester Co.",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Manhattan",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Niagara Falls",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Poughkeepsie",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Queens",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Rochester",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Schenectady",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Staten Island",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Syracuse",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Troy",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Utica",
      state: "NY",
      status: "in MI"
    },
    {
      city: "Akron",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Canton",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Cleveland",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Columbus",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Dayton",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Hamilton",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Lima",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Lorain",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Portsmouth",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Springfield",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Toledo",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Warren",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Youngstown",
      state: "OH",
      status: "in MI"
    },
    {
      city: "Oklahoma City",
      state: "OK",
      status: "in MI"
    },
    {
      city: "Oklahoma City",
      state: "OK",
      status: "in MI"
    },
    {
      city: "Tulsa",
      state: "OK",
      status: "in MI"
    },
    {
      city: "Portland",
      state: "OR",
      status: "in MI"
    },
    {
      city: "Allentown",
      state: "PA",
      status: "in MI"
    },
    {
      city: "Altoona",
      state: "PA",
      status: "in MI"
    },
    {
      city: "Bethlehem",
      state: "PA",
      status: "in MI"
    },
    {
      city: "Chester",
      state: "PA",
      status: "in MI"
    },
    {
      city: "Erie",
      state: "PA",
      status: "in MI"
    },
    {
      city: "Harrisburg",
      state: "PA",
      status: "in MI"
    },
    {
      city: "Johnstown",
      state: "PA",
      status: "in MI"
    },
    {
      city: "Lancaster",
      state: "PA",
      status: "in MI"
    },
    {
      city: "McKeesport",
      state: "PA",
      status: "in MI"
    },
    {
      city: "New Castle",
      state: "PA",
      status: "in MI"
    },
    {
      city: "Philadelphia",
      state: "PA",
      status: "in MI"
    },
    {
      city: "Pittsburgh",
      state: "PA",
      status: "in MI"
    },
    {
      city: "Scranton",
      state: "PA",
      status: "in MI"
    },
    {
      city: "WilkesBarre",
      state: "PA",
      status: "in MI"
    },
    {
      city: "York",
      state: "PA",
      status: "in MI"
    },
    {
      city: "Pawtucket & Central Falls",
      state: "RI",
      status: "in MI"
    },
    {
      city: "Providence",
      state: "RI",
      status: "in MI"
    },
    {
      city: "Woonsocket",
      state: "RI",
      status: "in MI"
    },
    {
      city: "Columbia",
      state: "SC",
      status: "in MI"
    },
    {
      city: "Chattanooga",
      state: "TN",
      status: "in MI"
    },
    {
      city: "Knoxville",
      state: "TN",
      status: "in MI"
    },
    {
      city: "Memphis",
      state: "TN",
      status: "in MI"
    },
    {
      city: "Nashville",
      state: "TN",
      status: "in MI"
    },
    {
      city: "Amarillo",
      state: "TX",
      status: "in MI"
    },
    {
      city: "Austin",
      state: "TX",
      status: "in MI"
    },
    {
      city: "Beaumont",
      state: "TX",
      status: "in MI"
    },
    {
      city: "Dallas",
      state: "TX",
      status: "in MI"
    },
    {
      city: "ElPaso",
      state: "TX",
      status: "in MI"
    },
    {
      city: "Fort Worth",
      state: "TX",
      status: "in MI"
    },
    {
      city: "Galveston",
      state: "TX",
      status: "in MI"
    },
    {
      city: "Houston",
      state: "TX",
      status: "in MI"
    },
    {
      city: "Port Arthur",
      state: "TX",
      status: "in MI"
    },
    {
      city: "SanAntonio",
      state: "TX",
      status: "in MI"
    },
    {
      city: "Waco",
      state: "TX",
      status: "in MI"
    },
    {
      city: "Ogden",
      state: "UT",
      status: "in MI"
    },
    {
      city: "SaltLakeCity",
      state: "UT",
      status: "in MI"
    },
    {
      city: "Lynchburg",
      state: "VA",
      status: "in MI"
    },
    {
      city: "Newport News",
      state: "VA",
      status: "in MI"
    },
    {
      city: "Norfolk",
      state: "VA",
      status: "in MI"
    },
    {
      city: "Portsmouth",
      state: "VA",
      status: "in MI"
    },
    {
      city: "Richmond",
      state: "VA",
      status: "in MI"
    },
    {
      city: "Roanoke",
      state: "VA",
      status: "in MI"
    },
    {
      city: "Seattle",
      state: "WA",
      status: "in MI"
    },
    {
      city: "Spokane",
      state: "WA",
      status: "in MI"
    },
    {
      city: "Tacoma",
      state: "WA",
      status: "in MI"
    },
    {
      city: "Kenosha",
      state: "WI",
      status: "in MI"
    },
    {
      city: "Madison",
      state: "WI",
      status: "in MI"
    },
    {
      city: "Milwaukee Co.",
      state: "WI",
      status: "in MI"
    },
    {
      city: "Oshkosh",
      state: "WI",
      status: "in MI"
    },
    {
      city: "Racine",
      state: "WI",
      status: "in MI"
    },
    {
      city: "Charleston",
      state: "WV",
      status: "in MI"
    },
    {
      city: "Huntington",
      state: "WV",
      status: "in MI"
    },
    {
      city: "Wheeling",
      state: "WV",
      status: "in MI"
    }
  ];

  var searchFor = argv[0];

  return citiesData.filter(c => (c.city.toLowerCase().includes(searchFor)
    || c.state.toLowerCase().includes(searchFor)));
}

console.log(run(['spokane']));
