import React from 'react';
import PropTypes from 'prop-types';

const SimpleCategory = ({ num, data, name, selectCategory }) => (
  <li key={`AD-${num}`}>
    <span
      className={`catNum ${(selectCategory) ? 'catSelectable' : ''}`}
      onClick={selectCategory}
      id={num}
    >
      {num}
    </span>
    <span
      className={`catName ${(selectCategory) ? 'catSelectable' : ''}`}
      onClick={selectCategory}
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
  selectCategory: PropTypes.func,
};

SimpleCategory.defaultProps = {
  data: undefined,
  selectCategory: undefined,
};
