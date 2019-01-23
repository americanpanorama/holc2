import React from 'react';
import PropTypes from 'prop-types';

const SimpleCategory = ({ num, data, name }) => (
  <li key={`AD-${num}`}>
    <span
      className="num catSelectable"
      //onClick={ this.props.onCategoryClick }
      id={num}
    >
      {`${num}. `}
    </span>
    <span
      className="catName catSelectable"
      //onClick={ this.props.onCategoryClick }
      id={num}
    >
      {name}
    </span>
    <span className="catData">
      { (data) ? (
        <span>
          {data.split('\n').map((item, key) => (
            <p key={key}>
              {item}
            </p>
          ))}
        </span>
      ) : (
        <span className="empty">
          empty
        </span>
      ) }
    </span>
  </li>
);

export default SimpleCategory;

SimpleCategory.propTypes = {
  data: PropTypes.string,
  num: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

SimpleCategory.defaultProps = {
  data: undefined,
};
