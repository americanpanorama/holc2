import React from 'react';
import PropTypes from 'prop-types';
import MinimizeButton from '../../Buttons/presentational/Minimize';

const Legend = ({ show, showNationalLegend, donutCityMarkers, toggleNationalLegend, toggleCityMarkerStyle }) => {
  if (show) {
    if (showNationalLegend) {
      return (
        <div
          id="legend"
        >
          <span
            onClick={toggleNationalLegend}
            role="button"
            tabIndex={0}
            style={{
              float: 'right',
              marginLeft: 10,
            }}
          >
            <MinimizeButton />
          </span>
          <div
            className="citySymbol"
            onClick={toggleCityMarkerStyle}
          >
            {(!donutCityMarkers) ? (
              <svg
                width={50}
                height={120}
              >

                <defs>
                  <marker
                    id="triangle"
                    viewBox="0 0 5 5"
                    refX="1"
                    refY="2.5"
                    markerUnits="strokeWidth"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto"
                  >
                    <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#888888" />
                  </marker>
                </defs>
                <g transform="translate(25, 25)">
                  <circle
                    cx={0}
                    cy={0}
                    r={25}
                    className="gradeA"
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={21}
                    className="gradeB"
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={17}
                    className="gradeC"
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={10}
                    className="gradeD"
                  />
                </g>

                <g transform="translate(25, 61)">
                  <path d="M 12 -6.5 A 12 12 0 0 1 12 4.5" fill="transparent" stroke="#888888" markerEnd="url(#triangle)" />
                  <path d="M -12 6.5 A 12 12 0 0 1 -12 -4.5" fill="transparent" stroke="#888888" markerEnd="url(#triangle)" />
                </g>

                <g transform="translate(12.5, 70) scale(0.125)">
                  <path d="M 157.1723042022722 17.95533148215631 A 100 100 0 0 0 100 0 L 100 66.66666666666666 A 33.333333333333336 33.333333333333336 0 0 1 119.05743473409072 72.65177716071877" fill="#76a865" />
                  <path d="M 193.56069542859666 135.3043378484482 A 100 100 0 0 0 157.1723042022722 17.95533148215631 L 119.05743473409072 72.65177716071877 A 33.333333333333336 33.333333333333336 0 0 1 131.1868984761989 111.7681126161494" fill="#7cb5bd" />
                  <path d="M 36.06826792772 23.10569829799998 A 100 100 0 1 0 193.56069542859666 135.3043378484482 L 131.1868984761989 111.7681126161494 A 33.333333333333336 33.333333333333336 0 1 1 78.68942264257333 74.36856609933332" fill="#ffff00" />
                  <path d="M 99.99999999999999 0 A 100 100 0 0 0 36.06826792772 23.10569829799998 L 78.68942264257333 74.36856609933332 A 33.333333333333336 33.333333333333336 0 0 1 100 66.66666666666666" fill="#d9838d" />
                  <circle cx="100" cy="100" r="99" fill="transparent" stroke="black" strokeWidth="2" />
                  <circle cx="100" cy="100" r="33.333" fill="transparent" stroke="black" strokeWidth="2"  />
                  <line x1="100" y1="0" x2="100" y2="66.66666666666666" stroke="black" strokeWidth="2" />
                  <line x1="157.1723042022722" y1="17.95533148215631" x2="119.05743473409072" y2="72.65177716071877" stroke="black" strokeWidth="2" />
                  <line x1="193.56069542859666" y1="135.3043378484482" x2="131.1868984761989" y2="111.7681126161494" stroke="black" strokeWidth="2" />
                  <line x1="36.06826792772" y1="23.10569829799998" x2="78.68942264257333" y2="74.36856609933332" stroke="black" strokeWidth="2" />
                  <circle cx="100" cy="100" r="100" className='mask' />
                </g>
              </svg>
            ) : (
              <svg
                width={50}
                height={120}
              >
                <defs>
                  <marker
                    id="triangle"
                    viewBox="0 0 5 5"
                    refX="1"
                    refY="2.5"
                    markerUnits="strokeWidth"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto"
                  >
                    <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#888888" />
                  </marker>
                </defs>
                <g transform="translate(0 0) scale(0.25)">
                  <path d="M 157.1723042022722 17.95533148215631 A 100 100 0 0 0 100 0 L 100 66.66666666666666 A 33.333333333333336 33.333333333333336 0 0 1 119.05743473409072 72.65177716071877" fill="#76a865" />
                  <path d="M 193.56069542859666 135.3043378484482 A 100 100 0 0 0 157.1723042022722 17.95533148215631 L 119.05743473409072 72.65177716071877 A 33.333333333333336 33.333333333333336 0 0 1 131.1868984761989 111.7681126161494" fill="#7cb5bd" />
                  <path d="M 36.06826792772 23.10569829799998 A 100 100 0 1 0 193.56069542859666 135.3043378484482 L 131.1868984761989 111.7681126161494 A 33.333333333333336 33.333333333333336 0 1 1 78.68942264257333 74.36856609933332" fill="#ffff00" />
                  <path d="M 99.99999999999999 0 A 100 100 0 0 0 36.06826792772 23.10569829799998 L 78.68942264257333 74.36856609933332 A 33.333333333333336 33.333333333333336 0 0 1 100 66.66666666666666" fill="#d9838d" />
                  <circle cx="100" cy="100" r="99" fill="transparent" stroke="black" strokeWidth="2" />
                  <circle cx="100" cy="100" r="33.333" fill="transparent" stroke="black" strokeWidth="2"  />
                  <line x1="100" y1="0" x2="100" y2="66.66666666666666" stroke="black" strokeWidth="2" />
                  <line x1="157.1723042022722" y1="17.95533148215631" x2="119.05743473409072" y2="72.65177716071877" stroke="black" strokeWidth="2" />
                  <line x1="193.56069542859666" y1="135.3043378484482" x2="131.1868984761989" y2="111.7681126161494" stroke="black" strokeWidth="2" />
                  <line x1="36.06826792772" y1="23.10569829799998" x2="78.68942264257333" y2="74.36856609933332" stroke="black" strokeWidth="2" />
                </g>

                <g transform="translate(25, 61)">
                  <path d="M 12 -6.5 A 12 12 0 0 1 12 4.5" fill="transparent" stroke="#888888" markerEnd="url(#triangle)" />
                  <path d="M -12 6.5 A 12 12 0 0 1 -12 -4.5" fill="transparent" stroke="#888888" markerEnd="url(#triangle)" />
                </g>

                <g transform="translate(25, 82.5) scale(0.5)">
                  <circle
                    cx={0}
                    cy={0}
                    r={25}
                    className="gradeA"
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={21}
                    className="gradeB"
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={17}
                    className="gradeC"
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={10}
                    className="gradeD"
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={25}
                    className="mask"
                  />
                </g>

              </svg>
            )}

            <div className="tooltiptext">
              Click to switch between marker types. The default uses concentric circles with D grades in the center and A on the edge. It represents the typical spatial pattern of HOLC maps where lower graded areas tended to be near city centers and higher graded areas on the suburban periphery of cities (a pattern described by 20th-century sociologist Ernest Burgess's "concentric city model"). The alternative donut charts is likely easier to read if you are interested in the percentage of area assigned to each grade.
            </div>
          </div>



          <p>
            The size of each circle represents the area in that city that HOLC graded, with each color representing
            the proportion of the city graded and colored.
          </p>
          <ul>
            <li>
              A
              <span className="gradeA">
                "Best"
              </span>
            </li>
            <li>
              B
              <span className="gradeB">
                "Still Desirable"
              </span>
            </li>
            <li>
              C
              <span className="gradeC">
                "Definitely Declining"
              </span>
            </li>
            <li>
              D
              <span className="gradeD">
                "Hazardous"
              </span>
            </li>
          </ul>
        </div>
      );
    }

    return (
      <button
        className="toggle"
        id="showNationalLegend"
        onClick={toggleNationalLegend}
      >
        show legend
      </button>
    );
  }

  return null;
};

export default Legend;

Legend.propTypes = {
  show: PropTypes.bool.isRequired,
  donutCityMarkers: PropTypes.bool.isRequired,
  showNationalLegend: PropTypes.bool.isRequired,
  toggleNationalLegend: PropTypes.func.isRequired,
  toggleCityMarkerStyle: PropTypes.func.isRequired,
};
