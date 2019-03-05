import React from 'react';
import PropTypes from 'prop-types';

const SimpleSubcategory = ({ data, num, letter, name, after, selectCategory }) => (
  <li>
    <span
      className={`catLetter ${(selectCategory) ? 'catSelectable' : ''}`}
      onClick={selectCategory}
      id={`${num}-${letter}`}
    >
      {letter}
    </span>
    <span
      className={`subcatName ${(selectCategory) ? 'catSelectable' : ''}`}
      onClick={selectCategory}
      id={`${num}-${letter}`}
    >
      {name}
    </span>
    <span className="subcatData">
      {(data && typeof data !== 'object')
        ? data
        : (
          <span className="empty">
            empty
          </span>
        )
      }
    </span>
    {(after) && (
      <span className="subcatName">
        {after}
      </span>
    )}
  </li>
);

export default SimpleSubcategory;

SimpleSubcategory.propTypes = {
  data: PropTypes.string,
  num: PropTypes.number.isRequired,
  letter: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  after: PropTypes.string,
  selectCategory: PropTypes.func,
};

SimpleSubcategory.defaultProps = {
  data: undefined,
  selectCategory: undefined,
  after: undefined,
};
