import React from 'react';
import PropTypes from 'prop-types';

const SimpleSubcategory = ({ data, num, letter, name }) => (
  <li>
    <span
      className="catLetter catSelectable"
      //onClick={ this.props.onCategoryClick }
      id={`${num}-${letter}`}
    >
      {letter}
    </span>
    <span
      className="subcatName catSelectable"
      //onClick={ this.props.onCategoryClick }
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
  </li>
);

export default SimpleSubcategory;

SimpleSubcategory.propTypes = {
  data: PropTypes.string,
  num: PropTypes.number.isRequired,
  letter: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

SimpleSubcategory.defaultProps = {
  data: undefined,
};
