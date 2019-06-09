import React from 'react';
import PropTypes from 'prop-types';
import MinimizeButton from '../../Buttons/presentational/Minimize';

const Legend = ({ show, showNationalLegend, toggleNationalLegend }) => {
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

          <svg
            width={50}
            height={50}
          >
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
          </svg>
          <p>
            The size of each circle represents the area in that city that HOLC graded, with each color representing
            the proportion of the city graded and colored:
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
  showNationalLegend: PropTypes.bool.isRequired,
  toggleNationalLegend: PropTypes.func.isRequired,
};
