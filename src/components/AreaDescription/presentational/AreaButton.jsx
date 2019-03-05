import React from 'react';
import PropTypes from 'prop-types';

const AreaButton = ({ id, holcId, grade, direction, selectArea }) => {
  if (!holcId) {
    return null;
  }

  return (
    <svg
      width={40}
      height={40}
      viewBox="-20 -20 40 40"
      onClick={selectArea}
      id={id}
      className={`adButton ${direction} grade${grade}`}
    >
      <circle
        cx={0}
        cy={0}
        r={20}
      />
     {/*
      <path
        d={`M${5},${-10} L${-5},${0} L${5},${10}`}
      /> */}
      <text
        x={0}
        y={5}
      >
        {(direction === 'previous') ? `<${holcId}` : `${holcId}>`}
      </text>
    </svg>
  )
};


export default AreaButton;

AreaButton.propTypes = {
  id: PropTypes.string,
  holcId: PropTypes.string,
  grade: PropTypes.string,
  direction: PropTypes.string,
  selectArea: PropTypes.func.isRequired,
};

AreaButton.defaultProps = {
  holcId: null,
  id: null,
  grade: null,
  direction: 'next',
};
