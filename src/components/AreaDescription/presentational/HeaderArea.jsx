import React from 'react';
import PropTypes from 'prop-types';

const HeaderArea = ({ holcId, name, previousAreaId, nextAreaId, selectArea }) => (
  <h2 className="sidebarTitle">
    {(previousAreaId) && (
      <span
        onClick={selectArea}
        id={previousAreaId}
        role='link'
        style={{
          float: 'left',
          marginLeft: 20,
        }}
      >
        <svg
          width={20}
          height={20}
        >
          <g transform={`translate(${20 / 2} ${20 / 2}) rotate(315)`}>
            <circle
              cx={0}
              cy={0}
              r={20 / 2}
              fill="#4B4E6D"
              fillOpacity={1}
            />
            <path
              d={`M${20 / -8},${20 / 4} V${20 / -8} H${20 / 4}`}
              fill="transparent"
              stroke="#ddd"
              strokeWidth={20 / 10}
            />
          </g>
        </svg>
      </span>
    )}

    {holcId}
    {(name) ? ` ${name}` : ''}
  </h2>
);

export default HeaderArea;

HeaderArea.propTypes = {
  holcId: PropTypes.string.isRequired,
  name: PropTypes.string,
  previousAreaId: PropTypes.string,
  nextAreaId: PropTypes.string,
  selectArea: PropTypes.func.isRequired,
};

HeaderArea.defaultProps = {
  name: undefined,
  previousAreaId: undefined,
  nextAreaId: undefined,
};
