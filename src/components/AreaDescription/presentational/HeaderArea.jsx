import React from 'react';
import PropTypes from 'prop-types';

const HeaderArea = ({ holcId, name, previousArea, previousHOLCId, nextAreaId, selectArea }) => (
  <h2 className="sidebarTitle">
    {(previousArea) && (
      <span
        onClick={selectArea}
        id={previousArea.id}
        role='link'
        style={{
          float: 'left',
          marginLeft: 20,
        }}
      >
        <svg
          width={40}
          height={40}
        >
          <g transform={`translate(${20} ${20})`}>
            <circle
              cx={0}
              cy={0}
              r={20}
              className={`grade${previousArea.grade}`}
              fillOpacity={1}
            />
            <path
              d={`M${-8},${8} V${-8} H${8}`}
              fill="transparent"
              stroke={(previousArea.grade === 'C') ? "black" : "#ddd"}
              strokeWidth={20 / 10}
              transform={`rotate(315)`}
            />
            <text
              x={-3}
              y={6}
              fill={(previousArea.grade === 'C') ? "black" : "#ddd"}
              fontSize={12}
            >
              {previousArea.holcId}
            </text>
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
  previousArea: PropTypes.shape({
    id: PropTypes.string,
    holcId: PropTypes.string,
    grade: PropTypes.string,
  }),
  previousHOLCId: PropTypes.string,
  nextAreaId: PropTypes.string,
  selectArea: PropTypes.func.isRequired,
};

HeaderArea.defaultProps = {
  name: undefined,
  previousArea: undefined,
  previousHOLCId: undefined,
  nextAreaId: undefined,
};
